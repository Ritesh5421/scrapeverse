import { NextRequest, NextResponse } from "next/server";
import { getIssuesWithRepo, isDataStale, runScrapePipeline } from "@/lib/scraper-pipeline";
import type { Recommendation, MatchScore, MatchScoreBreakdown } from "@/lib/types";

function classifyDifficulty(labels: string[]): "beginner" | "intermediate" | "advanced" {
  const lower = labels.map((l) => l.toLowerCase());
  if (lower.some((l) => l.includes("good first issue") || l.includes("easy") || l.includes("beginner"))) {
    return "beginner";
  }
  if (lower.some((l) => l.includes("help wanted") || l.includes("medium") || l.includes("enhancement"))) {
    return "intermediate";
  }
  return "advanced";
}

function matchLabels(labels: string[], interests: string[]): string[] {
  const matched: string[] = [];
  const lowerLabels = labels.map((l) => l.toLowerCase());

  for (const interest of interests) {
    const lowerInterest = interest.toLowerCase();
    if (lowerLabels.some((l) => l.includes(lowerInterest))) {
      matched.push(interest);
    }
  }

  if (lowerLabels.some((l) => l.includes("good first issue"))) {
    matched.push("Beginner Friendly");
  }
  if (lowerLabels.some((l) => l.includes("help wanted"))) {
    matched.push("Help Wanted");
  }
  if (lowerLabels.some((l) => l.includes("bug"))) {
    matched.push("Bug Fix");
  }
  if (lowerLabels.some((l) => l.includes("documentation") || l.includes("docs"))) {
    matched.push("Documentation");
  }

  return [...new Set(matched)];
}

function daysSince(dateStr: string | null): number {
  if (!dateStr) return 999;
  const created = new Date(dateStr);
  return Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
}

function generateWhyRecommended(
  languages: string[],
  interests: string[],
  repo: { language: string | null; topics: string; stars: number },
  labels: string[],
  difficulty: string,
  readme: { hasContributionGuide: boolean; setupComplexity: string; techStack: string[] } | null,
  issueAge: number,
  comments: number,
  isTrending: boolean,
  goals: string[],
  timeCommitment: string | null,
  complexity: "low" | "medium" | "high",
  goalSignals: { points: number; label: string }[],
  timeFitSignal: { points: number; label: string } | null
): string[] {
  const reasons: string[] = [];
  const topics: string[] = JSON.parse(repo.topics || "[]");
  const lowerTopics = topics.map((t) => t.toLowerCase());

  if (repo.language && languages.some((l) => l.toLowerCase() === repo.language!.toLowerCase())) {
    reasons.push(`Primary language is ${repo.language} — matches your stack.`);
  } else {
    const topicLangMatch = languages.find((l) => lowerTopics.some((t) => t.includes(l.toLowerCase())));
    if (topicLangMatch) {
      reasons.push(`Uses ${topicLangMatch} (via project topics).`);
    }
  }

  const matchedInterests = interests.filter((i) =>
    lowerTopics.some((t) => t.includes(i.toLowerCase()))
  );
  if (matchedInterests.length > 1) {
    reasons.push(`Matches ${matchedInterests.length} of your interests: ${matchedInterests.join(", ")}.`);
  } else if (matchedInterests.length === 1) {
    reasons.push(`Aligns with your interest in ${matchedInterests[0]}.`);
  }

  if (readme?.techStack && readme.techStack.length > 0) {
    const stackMatch = readme.techStack.filter((s) =>
      languages.some((l) => l.toLowerCase() === s.toLowerCase())
    );
    if (stackMatch.length > 0) {
      reasons.push(`Tech stack includes ${stackMatch.join(", ")}.`);
    }
  }

  if (difficulty === "beginner") {
    reasons.push("Marked as a good first issue — ideal for new contributors.");
  } else if (difficulty === "intermediate") {
    reasons.push("Open for community contributions.");
  }

  if (labels.includes("documentation") || labels.includes("docs")) {
    reasons.push("Documentation contribution — great way to learn the codebase.");
  }
  if (labels.includes("help wanted")) {
    reasons.push("Maintainers are actively seeking help on this.");
  }

  if (issueAge <= 7) {
    reasons.push(`Created ${issueAge === 0 ? "today" : `${issueAge}d ago`} — still fresh and actionable.`);
  } else if (issueAge > 90) {
    reasons.push(`Open for ${Math.floor(issueAge / 30)} months — may need a fresh take.`);
  }

  if (comments > 5) {
    reasons.push(`${comments} comments — active discussion on approach.`);
  }

  if (readme?.hasContributionGuide) {
    reasons.push("Has a contribution guide — onboarding is clear.");
  }

  if (readme?.setupComplexity === "simple") {
    reasons.push("Simple setup — get started in minutes.");
  } else if (readme?.setupComplexity === "complex") {
    reasons.push("Complex setup — plan extra time for environment config.");
  }

  if (repo.stars > 10000) {
    reasons.push(`Established project with ${repo.stars.toLocaleString()} stars.`);
  } else if (repo.stars > 1000) {
    reasons.push(`Growing project with ${repo.stars.toLocaleString()} stars.`);
  }

  if (isTrending) {
    reasons.push("Currently trending on GitHub.");
  }

  if (goals.includes("First Open Source Contribution") && difficulty === "beginner") {
    reasons.push("Great fit for your first open source contribution.");
  }
  if (goals.includes("Build Portfolio") && repo.stars > 1000) {
    reasons.push("Visible project that strengthens your portfolio.");
  }
  if (goals.includes("Find Mentors") && comments > 5) {
    reasons.push("Active discussion — good opportunity to connect with maintainers.");
  }
  if (goals.includes("Contribute to Production Systems") && repo.stars > 10000) {
    reasons.push("Production-grade project used by many teams.");
  }
  if (goals.includes("Prepare for Jobs") && repo.stars > 10000) {
    reasons.push("Resume-worthy project with wide industry recognition.");
  }
  if (goals.includes("Deep Technical Learning") && complexity === "high") {
    reasons.push("Deep technical challenge — great for skill growth.");
  }
  if (goals.includes("Learn New Technologies") && labels.includes("documentation")) {
    reasons.push("Documentation task — perfect for learning a new codebase.");
  }

  if (timeFitSignal && timeFitSignal.points > 0) {
    reasons.push(`Fits your ${timeCommitment?.toLowerCase()} availability.`);
  }

  if (reasons.length === 0) {
    reasons.push("Active issue in a relevant repository.");
  }

  return reasons.slice(0, 4);
}

function calculateMatchScore(
  languages: string[],
  interests: string[],
  repo: { language: string | null; topics: string; stars: number },
  labels: string[],
  readme: { hasContributionGuide: boolean; setupComplexity: string; techStack: string[] } | null,
  isTrending: boolean,
  issueAge: number,
  comments: number,
  experienceLevel: string | null,
  goalSignals: { points: number; label: string }[],
  timeFitSignal: { points: number; label: string } | null
): MatchScore {
  const breakdown: MatchScoreBreakdown[] = [];
  const topics: string[] = JSON.parse(repo.topics || "[]");
  const lowerTopics = topics.map((t) => t.toLowerCase());
  const lowerLabels = labels.map((l) => l.toLowerCase());
  const isBeginner = experienceLevel === "Beginner";

  // --- Language match (max 35) ---
  if (repo.language && languages.some((l) => l.toLowerCase() === repo.language!.toLowerCase())) {
    breakdown.push({ label: `${repo.language} primary`, points: 30, category: "language" });
  } else {
    const topicLangMatch = languages.find((l) => lowerTopics.some((t) => t.includes(l.toLowerCase())));
    if (topicLangMatch) {
      breakdown.push({ label: `${topicLangMatch} in topics`, points: 15, category: "language" });
    }
  }

  if (readme?.techStack) {
    const stackMatch = readme.techStack.filter((s) =>
      languages.some((l) => l.toLowerCase() === s.toLowerCase())
    );
    if (stackMatch.length > 0) {
      breakdown.push({ label: `Tech: ${stackMatch[0]}`, points: 5, category: "language" });
    }
  }

  // --- Interest alignment (max 20) ---
  const matchedInterests = interests.filter((i) =>
    lowerTopics.some((t) => t.includes(i.toLowerCase()))
  );
  if (matchedInterests.length > 1) {
    breakdown.push({ label: `${matchedInterests.length} interests matched`, points: 20, category: "interest" });
  } else if (matchedInterests.length === 1) {
    breakdown.push({ label: `${matchedInterests[0]} interest`, points: 12, category: "interest" });
  }

  // --- Issue quality (max ~20) ---
  if (lowerLabels.some((l) => l.includes("good first issue"))) {
    breakdown.push({ label: "Good First Issue", points: isBeginner ? 15 : 10, category: "issue" });
  }
  if (lowerLabels.some((l) => l.includes("documentation") || l.includes("docs"))) {
    breakdown.push({ label: "Documentation", points: isBeginner ? 8 : 5, category: "issue" });
  }
  if (lowerLabels.some((l) => l.includes("help wanted"))) {
    breakdown.push({ label: "Help Wanted", points: 5, category: "issue" });
  }
  if (lowerLabels.some((l) => l.includes("bug"))) {
    breakdown.push({ label: "Bug Fix", points: 3, category: "issue" });
  }

  // Issue freshness
  if (issueAge <= 7) {
    breakdown.push({ label: "Fresh issue", points: 7, category: "issue" });
  } else if (issueAge <= 30) {
    breakdown.push({ label: "Recent issue", points: 4, category: "issue" });
  } else if (issueAge > 90) {
    breakdown.push({ label: "Stale (90d+)", points: -5, category: "issue" });
  }

  // Issue engagement
  if (comments >= 2 && comments <= 15) {
    breakdown.push({ label: "Active discussion", points: 3, category: "issue" });
  } else if (comments > 15) {
    breakdown.push({ label: "High engagement", points: 1, category: "issue" });
  }

  // --- Project health (max ~25) ---
  if (repo.stars > 10000) {
    breakdown.push({ label: "Established project", points: 12, category: "project" });
  } else if (repo.stars > 1000) {
    breakdown.push({ label: "Growing project", points: 8, category: "project" });
  } else if (repo.stars > 100) {
    breakdown.push({ label: "Emerging project", points: 4, category: "project" });
  }

  if (readme?.hasContributionGuide) {
    breakdown.push({ label: "Contribution guide", points: isBeginner ? 8 : 5, category: "project" });
  }

  if (readme?.setupComplexity === "simple") {
    breakdown.push({ label: "Simple setup", points: isBeginner ? 5 : 3, category: "project" });
  } else if (readme?.setupComplexity === "complex") {
    breakdown.push({ label: "Complex setup", points: isBeginner ? -3 : -1, category: "project" });
  }

  if (isTrending) {
    breakdown.push({ label: "Trending now", points: 7, category: "project" });
  }

  // --- Goal alignment (max ~15) ---
  for (const sig of goalSignals) {
    breakdown.push({ label: sig.label, points: sig.points, category: "goal" });
  }

  // --- Time fit (max ~5, can go negative) ---
  if (timeFitSignal) {
    breakdown.push({ label: timeFitSignal.label, points: timeFitSignal.points, category: "fit" });
  }

  const total = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { total, breakdown };
}

function estimateIssueComplexity(
  labels: string[],
  readme: { setupComplexity: string } | null,
  comments: number
): "low" | "medium" | "high" {
  const lower = labels.map((l) => l.toLowerCase());
  if (
    lower.some((l) => l.includes("good first issue") || l.includes("easy") || l.includes("beginner"))
  ) {
    return "low";
  }
  if (readme?.setupComplexity === "complex") return "high";
  if (comments > 15) return "high";
  if (
    lower.some((l) => l.includes("help wanted") || l.includes("enhancement") || l.includes("documentation"))
  ) {
    return "medium";
  }
  return "medium";
}

function calculateGoalScore(
  goals: string[],
  labels: string[],
  repo: { stars: number },
  readme: { hasContributionGuide: boolean; setupComplexity: string } | null,
  difficulty: string
): { points: number; label: string }[] {
  const signals: { points: number; label: string }[] = [];
  const lower = labels.map((l) => l.toLowerCase());

  for (const goal of goals) {
    switch (goal) {
      case "First Open Source Contribution": {
        if (lower.some((l) => l.includes("good first issue"))) {
          signals.push({ points: 5, label: "First contribution pick" });
        }
        if (readme?.hasContributionGuide) {
          signals.push({ points: 3, label: "Contribution guide" });
        }
        if (readme?.setupComplexity === "simple") {
          signals.push({ points: 3, label: "Simple setup" });
        }
        break;
      }
      case "Build Portfolio": {
        if (repo.stars > 10000) {
          signals.push({ points: 5, label: "Portfolio-worthy project" });
        } else if (repo.stars > 1000) {
          signals.push({ points: 3, label: "Visible project" });
        }
        break;
      }
      case "Learn New Technologies": {
        if (lower.some((l) => l.includes("documentation") || l.includes("docs"))) {
          signals.push({ points: 5, label: "Documentation task" });
        }
        if (repo.stars > 1000) {
          signals.push({ points: 3, label: "Established codebase" });
        }
        break;
      }
      case "Find Mentors": {
        if (lower.some((l) => l.includes("help wanted"))) {
          signals.push({ points: 5, label: "Maintainers seeking help" });
        }
        if (repo.stars > 1000) {
          signals.push({ points: 3, label: "Active community" });
        }
        break;
      }
      case "Contribute to Production Systems": {
        if (repo.stars > 10000) {
          signals.push({ points: 8, label: "Production-grade project" });
        } else if (repo.stars > 1000) {
          signals.push({ points: 5, label: "Growing production project" });
        }
        break;
      }
      case "Prepare for Jobs": {
        if (repo.stars > 10000) {
          signals.push({ points: 5, label: "Resume-worthy project" });
        }
        if (lower.some((l) => l.includes("good first issue"))) {
          signals.push({ points: 3, label: "Quick win for portfolio" });
        }
        break;
      }
      case "Deep Technical Learning": {
        if (readme?.setupComplexity === "complex") {
          signals.push({ points: 5, label: "Complex system to explore" });
        }
        if (difficulty === "advanced") {
          signals.push({ points: 3, label: "Advanced challenge" });
        }
        break;
      }
    }
  }

  return signals;
}

function calculateTimeFitScore(
  timeCommitment: string,
  complexity: "low" | "medium" | "high"
): { points: number; label: string } | null {
  switch (timeCommitment) {
    case "Less than 2 hours/week":
      if (complexity === "low") return { points: 5, label: "Quick task" };
      if (complexity === "high") return { points: -4, label: "Time-intensive" };
      return null;
    case "2–5 hours/week":
      if (complexity === "low") return { points: 3, label: "Manageable task" };
      if (complexity === "high") return { points: -2, label: "Needs more time" };
      return null;
    case "5–10 hours/week":
      if (complexity === "high") return { points: 2, label: "Good use of time" };
      return null;
    case "10+ hours/week":
      if (complexity === "high") return { points: 4, label: "Deep dive ready" };
      return null;
    default:
      return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const languagesRaw = searchParams.get("languages");
  const interestsRaw = searchParams.get("interests");
  const goalsRaw = searchParams.get("goals");
  const timeCommitment = searchParams.get("timeCommitment");
  const experience = searchParams.get("experience");

  const languages = languagesRaw ? languagesRaw.split(",").filter(Boolean) : [];
  const interests = interestsRaw ? interestsRaw.split(",").filter(Boolean) : [];
  const goals = goalsRaw ? goalsRaw.split(",").filter(Boolean) : [];

  if (languages.length === 0) {
    return NextResponse.json(
      { error: "At least one language is required" },
      { status: 400 }
    );
  }

  let dataSource: "live" | "mock" = "mock";
  let trendingRepos: string[] = [];

  const stale = await isDataStale();
  if (stale) {
    try {
      const result = await runScrapePipeline();
      trendingRepos = result.trendingRepos;
    } catch (err) {
      console.error("Auto-scrape failed:", err);
    }
  }

  const issues = await getIssuesWithRepo({ languages, interests });

  if (issues.length > 0) {
    dataSource = "live";
  }

  const recommendations: Recommendation[] = issues.map((issue) => {
    const labels = JSON.parse(issue.labels || "[]");
    const repoTopics = JSON.parse(issue.repo.topics || "[]");
    const difficulty = classifyDifficulty(labels);
    const matchedLabels = matchLabels(labels, interests);
    const fullName = `${issue.repo.owner}/${issue.repo.name}`;
    const isTrending = trendingRepos.includes(fullName);
    const issueAge = daysSince(issue.createdAt?.toISOString() ?? null);

    const readmeData = issue.repo.readme
      ? {
          hasContributionGuide: issue.repo.readme.hasContributionGuide,
          setupComplexity: issue.repo.readme.setupComplexity as "simple" | "moderate" | "complex" | "unknown",
          techStack: JSON.parse(issue.repo.readme.techStack || "[]"),
          architectureKeywords: JSON.parse(issue.repo.readme.architectureKeywords || "[]"),
        }
      : null;

    const complexity = estimateIssueComplexity(labels, readmeData, issue.comments);

    const goalSignals = calculateGoalScore(
      goals,
      labels,
      { stars: issue.repo.stars },
      readmeData,
      difficulty
    );

    const timeFitSignal = timeCommitment
      ? calculateTimeFitScore(timeCommitment, complexity)
      : null;

    const matchScore = calculateMatchScore(
      languages,
      interests,
      { language: issue.repo.language, topics: issue.repo.topics, stars: issue.repo.stars },
      labels,
      readmeData,
      isTrending,
      issueAge,
      issue.comments,
      experience,
      goalSignals,
      timeFitSignal
    );

    const whyRecommended = generateWhyRecommended(
      languages,
      interests,
      { language: issue.repo.language, topics: issue.repo.topics, stars: issue.repo.stars },
      labels,
      difficulty,
      readmeData,
      issueAge,
      issue.comments,
      isTrending,
      goals,
      timeCommitment,
      complexity,
      goalSignals,
      timeFitSignal
    );

    return {
      id: `${issue.repo.id}-${issue.number}`,
      issueNumber: issue.number,
      issueTitle: issue.title,
      issueUrl: issue.url,
      labels,
      comments: issue.comments,
      author: issue.author,
      repository: issue.repo.name,
      organization: issue.repo.owner,
      repoDescription: issue.repo.description || "No description available.",
      repoLanguage: issue.repo.language || "Unknown",
      repoStars: issue.repo.stars,
      repoTopics,
      whyRecommended,
      difficulty,
      matchedLabels,
      readme: readmeData,
      matchScore,
    };
  });

  let filtered = recommendations;
  if (experience === "Beginner") {
    filtered = recommendations.filter((r) => r.difficulty === "beginner");
  } else if (experience === "Intermediate") {
    filtered = recommendations.filter((r) => r.difficulty !== "advanced");
  }

  filtered.sort((a, b) => b.matchScore.total - a.matchScore.total);

  return NextResponse.json({ recommendations: filtered, count: filtered.length, dataSource });
}
