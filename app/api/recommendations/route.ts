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

function generateWhyRecommended(
  languages: string[],
  interests: string[],
  repo: { language: string | null; topics: string; stars: number },
  labels: string[],
  difficulty: string
): string[] {
  const reasons: string[] = [];
  const topics = JSON.parse(repo.topics || "[]");

  if (repo.language && languages.some((l) => l.toLowerCase() === repo.language!.toLowerCase())) {
    reasons.push(`Uses ${repo.language}, which matches your selected language.`);
  }

  if (interests.some((i) => i.toLowerCase().includes("systems")) &&
    topics.some((t: string) => t.includes("systems-programming") || t.includes("os"))) {
    reasons.push("Project focuses on systems programming.");
  }

  if (interests.some((i) => i.toLowerCase().includes("web")) &&
    topics.some((t: string) => t.includes("web") || t.includes("javascript"))) {
    reasons.push("Project is web-related.");
  }

  if (interests.some((i) => i.toLowerCase().includes("ai")) &&
    topics.some((t: string) => t.includes("machine-learning") || t.includes("llm") || t.includes("ai"))) {
    reasons.push("Project is AI/ML related.");
  }

  if (difficulty === "beginner") {
    reasons.push("Marked as a good first issue — ideal for new contributors.");
  } else if (difficulty === "intermediate") {
    reasons.push("Open for community contributions.");
  }

  if (labels.includes("documentation") || labels.includes("docs")) {
    reasons.push("Documentation contribution — great way to learn the codebase.");
  }

  if (repo.stars > 10000) {
    reasons.push(`Well-established project with ${repo.stars.toLocaleString()} stars.`);
  }

  if (reasons.length === 0) {
    reasons.push("Active issue in a popular repository.");
  }

  return reasons.slice(0, 3);
}

function calculateMatchScore(
  languages: string[],
  interests: string[],
  repo: { language: string | null; topics: string; stars: number },
  labels: string[],
  readme: { hasContributionGuide: boolean } | null,
  isTrending: boolean
): MatchScore {
  const breakdown: MatchScoreBreakdown[] = [];
  const topics = JSON.parse(repo.topics || "[]");
  const lowerTopics = topics.map((t: string) => t.toLowerCase());
  const lowerLabels = labels.map((l) => l.toLowerCase());

  if (repo.language && languages.some((l) => l.toLowerCase() === repo.language!.toLowerCase())) {
    breakdown.push({ label: `${repo.language} match`, points: 30 });
  }

  const matchedInterest = interests.find((interest) =>
    lowerTopics.some((t: string) => t.includes(interest.toLowerCase()))
  );
  if (matchedInterest) {
    breakdown.push({ label: `${matchedInterest} interest`, points: 20 });
  }

  if (lowerLabels.some((l) => l.includes("good first issue"))) {
    breakdown.push({ label: "Good First Issue", points: 15 });
  }

  if (repo.stars > 1000) {
    breakdown.push({ label: "Active project", points: 10 });
  }

  if (readme?.hasContributionGuide) {
    breakdown.push({ label: "Contribution guide found", points: 10 });
  }

  if (isTrending) {
    breakdown.push({ label: "Recently trending", points: 7 });
  }

  const total = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { total, breakdown };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const languagesRaw = searchParams.get("languages");
  const interestsRaw = searchParams.get("interests");
  const experience = searchParams.get("experience");

  const languages = languagesRaw ? languagesRaw.split(",").filter(Boolean) : [];
  const interests = interestsRaw ? interestsRaw.split(",").filter(Boolean) : [];

  if (languages.length === 0) {
    return NextResponse.json(
      { error: "At least one language is required" },
      { status: 400 }
    );
  }

  const stale = await isDataStale();
  if (stale) {
    try {
      await runScrapePipeline();
    } catch (err) {
      console.error("Auto-scrape failed:", err);
    }
  }

  const issues = await getIssuesWithRepo({ languages, interests });

  const recommendations: Recommendation[] = issues.map((issue) => {
    const labels = JSON.parse(issue.labels || "[]");
    const repoTopics = JSON.parse(issue.repo.topics || "[]");
    const difficulty = classifyDifficulty(labels);
    const matchedLabels = matchLabels(labels, interests);

    const whyRecommended = generateWhyRecommended(
      languages,
      interests,
      { language: issue.repo.language, topics: issue.repo.topics, stars: issue.repo.stars },
      labels,
      difficulty
    );

    const readme = issue.repo.readme
      ? {
          hasContributionGuide: issue.repo.readme.hasContributionGuide,
          setupComplexity: issue.repo.readme.setupComplexity as "simple" | "moderate" | "complex" | "unknown",
          techStack: JSON.parse(issue.repo.readme.techStack || "[]"),
          architectureKeywords: JSON.parse(issue.repo.readme.architectureKeywords || "[]"),
        }
      : null;

    const matchScore = calculateMatchScore(
      languages,
      interests,
      { language: issue.repo.language, topics: issue.repo.topics, stars: issue.repo.stars },
      labels,
      readme,
      true
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
      readme,
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

  return NextResponse.json({ recommendations: filtered, count: filtered.length });
}
