import type { Project, ProjectQueryFilters } from "@/lib/types";
import { mockProjects } from "@/data/mock-projects";

const latency = (ms = 120) => new Promise((r) => setTimeout(r, ms));

export async function searchProjects(
  filters: ProjectQueryFilters = {}
): Promise<Project[]> {
  await latency();

  let results = [...mockProjects];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.language.toLowerCase().includes(q) ||
        p.topics.some((t) => t.includes(q))
    );
  }

  if (filters.language && filters.language !== "any") {
    results = results.filter(
      (p) => p.language.toLowerCase() === filters.language!.toLowerCase()
    );
  }

  if (filters.difficulty === "beginner") {
    results = results.filter((p) => p.goodFirstIssues >= 20);
  } else if (filters.difficulty === "intermediate") {
    results = results.filter(
      (p) => p.goodFirstIssues < 20 || p.helpWantedIssues >= 10
    );
  } else if (filters.difficulty === "advanced") {
    results = results.filter((p) => p.stars > 90000);
  }

  if (filters.minStars) {
    results = results.filter((p) => p.stars >= filters.minStars!);
  }

  if (filters.activity && filters.activity !== "any") {
    results = results.filter((p) => p.activity === filters.activity);
  }

  if (filters.goodFirstIssuesOnly) {
    results = results.filter((p) => p.goodFirstIssues > 0);
  }

  return sortProjects(results, filters.sort ?? "best-match");
}

function sortProjects(projects: Project[], sort: ProjectQueryFilters["sort"]) {
  const sorted = [...projects];
  switch (sort) {
    case "most-stars":
      sorted.sort((a, b) => b.stars - a.stars);
      break;
    case "most-active":
      sorted.sort(
        (a, b) =>
          activityWeight(b) - activityWeight(a) ||
          a.lastCommitDaysAgo - b.lastCommitDaysAgo
      );
      break;
    case "beginner-friendly":
      sorted.sort((a, b) => b.goodFirstIssues - a.goodFirstIssues);
      break;
    default:
      sorted.sort((a, b) => b.matchScore - a.matchScore);
  }
  return sorted;
}

function activityWeight(p: Project): number {
  return p.activity === "high" ? 3 : p.activity === "medium" ? 2 : 1;
}

export async function getProject(
  owner: string,
  name: string
): Promise<Project | null> {
  await latency();
  return (
    mockProjects.find(
      (p) =>
        p.owner.toLowerCase() === owner.toLowerCase() &&
        p.name.toLowerCase() === name.toLowerCase()
    ) ?? null
  );
}

export type TrendingPeriod = "today" | "week" | "month";

export async function getTrending(period: TrendingPeriod): Promise<Project[]> {
  await latency();
  const factor = period === "today" ? 0.02 : period === "week" ? 0.1 : 0.4;
  return [...mockProjects]
    .map((p) => ({
      project: p,
      momentum:
        p.stars * factor * (p.activity === "high" ? 1.5 : 1) +
        p.goodFirstIssues * 40,
    }))
    .sort((a, b) => b.momentum - a.momentum)
    .map(({ project }) => project);
}
