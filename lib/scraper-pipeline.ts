import { db } from "./db";
import {
  discoverTrendingRepos,
  scrapeRepo,
  scrapeRepos,
  fetchIssues,
  closeClient,
  type RepoData,
  type IssueData,
} from "./brightdata";

const SCRAPE_STALENESS_MS = 6 * 60 * 60 * 1000;

export async function runScrapePipeline(): Promise<{
  discovered: number;
  scraped: number;
  issuesScraped: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let discovered = 0;
  let scraped = 0;
  let issuesScraped = 0;

  try {
    const urls = await discoverTrendingRepos();
    discovered = urls.length;

    if (urls.length === 0) {
      errors.push("No trending repos discovered");
      return { discovered: 0, scraped: 0, issuesScraped: 0, errors };
    }

    const repoDataList = await scrapeRepos(urls);

    for (const repoData of repoDataList) {
      try {
        const repoId = await upsertRepo(repoData);
        scraped++;

        const issues = await fetchIssues(repoData.owner, repoData.repository_name);
        for (const issue of issues) {
          await upsertIssue(repoId, issue);
          issuesScraped++;
        }
      } catch (err) {
        errors.push(`Failed to store ${repoData.owner}/${repoData.repository_name}: ${err}`);
      }
    }
  } catch (err) {
    errors.push(`Pipeline error: ${err}`);
  } finally {
    await closeClient();
  }

  return { discovered, scraped, issuesScraped, errors };
}

export async function runScrapeForRepo(fullName: string): Promise<boolean> {
  try {
    const url = `https://github.com/${fullName}`;
    const repoData = await scrapeRepo(url);
    if (!repoData) return false;

    const repoId = await upsertRepo(repoData);
    const issues = await fetchIssues(repoData.owner, repoData.repository_name);
    for (const issue of issues) {
      await upsertIssue(repoId, issue);
    }
    return true;
  } catch (err) {
    console.error(`Failed to scrape ${fullName}:`, err);
    return false;
  } finally {
    await closeClient();
  }
}

async function upsertRepo(data: RepoData): Promise<number> {
  const githubId = hashFullName(data.owner, data.repository_name);

  await db.scrapedRepo.upsert({
    where: { fullName: `${data.owner}/${data.repository_name}` },
    create: {
      id: githubId,
      fullName: `${data.owner}/${data.repository_name}`,
      owner: data.owner,
      name: data.repository_name,
      description: data.description,
      language: null,
      stars: data.star_count,
      forks: data.fork_count,
      topics: JSON.stringify(data.topics || []),
      license: data.license,
      defaultBranch: data.default_branch,
    },
    update: {
      description: data.description,
      stars: data.star_count,
      forks: data.fork_count,
      topics: JSON.stringify(data.topics || []),
      license: data.license,
      defaultBranch: data.default_branch,
      scrapedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return githubId;
}

async function upsertIssue(repoId: number, data: IssueData): Promise<void> {
  await db.scrapedIssue.upsert({
    where: { repoId_number: { repoId, number: data.number } },
    create: {
      repoId,
      number: data.number,
      title: data.title,
      url: data.url,
      labels: JSON.stringify(data.labels),
      comments: data.comments,
      author: data.author,
      createdAt: new Date(data.createdAt),
    },
    update: {
      title: data.title,
      labels: JSON.stringify(data.labels),
      comments: data.comments,
      scrapedAt: new Date(),
    },
  });
}

function hashFullName(owner: string, name: string): number {
  const str = `${owner}/${name}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

export async function getIssuesWithRepo(filters: {
  languages: string[];
  interests: string[];
}): Promise<
  {
    id: number;
    number: number;
    title: string;
    url: string;
    labels: string;
    comments: number;
    author: string | null;
    createdAt: Date | null;
    repo: {
      id: number;
      fullName: string;
      owner: string;
      name: string;
      description: string | null;
      language: string | null;
      stars: number;
      topics: string;
      license: string | null;
    };
  }[]
> {
  const where: Record<string, unknown> = {};

  if (filters.languages.length > 0) {
    where.repo = {
      OR: [
        { language: { in: filters.languages, mode: "insensitive" } },
        { topics: { hasSome: filters.languages } },
      ],
    };
  }

  const issues = await db.scrapedIssue.findMany({
    where,
    include: { repo: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return issues;
}

export async function isDataStale(): Promise<boolean> {
  const latest = await db.scrapedRepo.findFirst({
    orderBy: { scrapedAt: "desc" },
  });
  if (!latest) return true;
  return Date.now() - latest.scrapedAt.getTime() > SCRAPE_STALENESS_MS;
}
