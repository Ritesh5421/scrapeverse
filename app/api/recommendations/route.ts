import { NextRequest, NextResponse } from "next/server";
import { getFreshRepos, isDataStale, runScrapePipeline } from "@/lib/scraper-pipeline";
import type { Recommendation, ActivityLevel, Badge } from "@/lib/types";

function calculateActivityLevel(scrapedAt: Date): ActivityLevel {
  const hoursSinceUpdate = (Date.now() - scrapedAt.getTime()) / (1000 * 60 * 60);
  if (hoursSinceUpdate < 6) return "Very High";
  if (hoursSinceUpdate < 48) return "High";
  if (hoursSinceUpdate < 168) return "Moderate";
  return "Low";
}

function calculateBadges(
  repo: { topics: string; stars: number },
  beginnerIssues: number,
  activityLevel: ActivityLevel
): Badge[] {
  const badges: Badge[] = [];
  const topics = JSON.parse(repo.topics || "[]");

  if (beginnerIssues >= 5) badges.push("Beginner Friendly");
  if (activityLevel === "Very High" || activityLevel === "High") badges.push("High Activity");
  if (repo.stars > 5000) badges.push("Great Documentation");
  if (
    topics.some(
      (t: string) =>
        t.includes("systems-programming") || t.includes("os") || t.includes("kernel")
    )
  ) {
    badges.push("Systems Programming");
  }
  return badges;
}

function generateWhyRecommended(
  languages: string[],
  interests: string[],
  repo: { language: string | null; topics: string; stars: number; description: string | null },
  beginnerIssues: number
): string[] {
  const reasons: string[] = [];
  const topics = JSON.parse(repo.topics || "[]");

  if (repo.language && languages.some((l) => l.toLowerCase() === repo.language!.toLowerCase())) {
    reasons.push(`Matches your selected language ${repo.language}.`);
  }
  if (
    interests.some((i) => i.toLowerCase().includes("systems")) &&
    topics.some((t: string) => t.includes("systems-programming") || t.includes("os"))
  ) {
    reasons.push("Matches your interest in systems programming.");
  }
  if (
    interests.some((i) => i.toLowerCase().includes("web")) &&
    topics.some((t: string) => t.includes("web") || t.includes("javascript"))
  ) {
    reasons.push("Matches your interest in web development.");
  }
  if (
    interests.some((i) => i.toLowerCase().includes("ai")) &&
    topics.some((t: string) => t.includes("machine-learning") || t.includes("llm") || t.includes("ai"))
  ) {
    reasons.push("Matches your interest in AI/ML.");
  }
  if (beginnerIssues > 0) {
    reasons.push(`Has ${beginnerIssues} beginner-friendly issue${beginnerIssues > 1 ? "s" : ""}.`);
  }
  if (repo.stars > 10000) {
    reasons.push(`Well-established project with ${repo.stars.toLocaleString()} stars.`);
  }
  if (reasons.length === 0) {
    reasons.push("Popular project with active maintenance.");
  }
  return reasons.slice(0, 3);
}

function timeAgo(date: Date | null): string {
  if (!date) return "unknown";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const languagesRaw = searchParams.get("languages");
  const interestsRaw = searchParams.get("interests");

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

  const repos = await getFreshRepos(languages);

  const recommendations: Recommendation[] = repos.map((repo) => {
    const beginnerIssue = repo.issues.find((i) => i.label === "good first issue");
    const helpWantedIssue = repo.issues.find((i) => i.label === "help wanted");
    const beginnerCount = beginnerIssue?.count ?? 0;
    const helpWantedCount = helpWantedIssue?.count ?? 0;

    const activityLevel = calculateActivityLevel(repo.scrapedAt);
    const badges = calculateBadges(
      { topics: repo.topics, stars: repo.stars },
      beginnerCount,
      activityLevel
    );
    const whyRecommended = generateWhyRecommended(
      languages,
      interests,
      { language: repo.language, topics: repo.topics, stars: repo.stars, description: repo.description },
      beginnerCount
    );

    return {
      id: String(repo.id),
      repository: repo.name,
      organization: repo.owner,
      description: repo.description || "No description available.",
      primaryLanguage: repo.language || "Unknown",
      stars: repo.stars,
      activityLevel,
      openBeginnerIssues: beginnerCount,
      openHelpWantedIssues: helpWantedCount,
      lastUpdated: timeAgo(repo.pushedAt),
      badges,
      whyRecommended,
      url: `https://github.com/${repo.fullName}`,
    };
  });

  return NextResponse.json({ recommendations, count: recommendations.length });
}
