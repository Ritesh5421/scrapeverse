import { db } from "./db";
import {
  discoverTrendingRepos,
  fetchRepoDetails,
  fetchRepoDetailsBatch,
  fetchIssues,
  closeClient,
  type RepoData,
  type IssueData,
} from "./brightdata";
import { fetchAndAnalyzeReadme } from "./readme-analyzer";

const SCRAPE_STALENESS_MS = 6 * 60 * 60 * 1000;

export async function runScrapePipeline(): Promise<{
  discovered: number;
  scraped: number;
  issuesScraped: number;
  readmesScraped: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let discovered = 0;
  let scraped = 0;
  let issuesScraped = 0;
  let readmesScraped = 0;

  try {
    const urls = await discoverTrendingRepos();
    discovered = urls.length;

    if (urls.length === 0) {
      errors.push("No trending repos discovered");
      return { discovered: 0, scraped: 0, issuesScraped: 0, readmesScraped: 0, errors };
    }

    const repoDataList = await fetchRepoDetailsBatch(urls);

    for (const repoData of repoDataList) {
      try {
        const repoId = await upsertRepo(repoData);
        scraped++;

        const issues = await fetchIssues(repoData.owner, repoData.repository_name);
        for (const issue of issues) {
          await upsertIssue(repoId, issue);
          issuesScraped++;
        }

        const readme = await fetchAndAnalyzeReadme(repoData.owner, repoData.repository_name);
        if (readme) {
          await upsertReadme(repoId, readme);
          readmesScraped++;
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

  return { discovered, scraped, issuesScraped, readmesScraped, errors };
}

export async function runScrapeForRepo(fullName: string): Promise<boolean> {
  try {
    const match = fullName.match(/^([^/]+)\/([^/]+)$/);
    if (!match) return false;

    const [, owner, repo] = match;
    const repoData = await fetchRepoDetails(owner, repo);
    if (!repoData) return false;

    const repoId = await upsertRepo(repoData);
    const issues = await fetchIssues(repoData.owner, repoData.repository_name);
    for (const issue of issues) {
      await upsertIssue(repoId, issue);
    }

    const readme = await fetchAndAnalyzeReadme(repoData.owner, repoData.repository_name);
    if (readme) {
      await upsertReadme(repoId, readme);
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
      language: data.language,
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

const VALID_SETUP_COMPLEXITIES = ["simple", "moderate", "complex", "unknown"] as const;

function validateSetupComplexity(value: string): "simple" | "moderate" | "complex" | "unknown" {
  return VALID_SETUP_COMPLEXITIES.includes(value as (typeof VALID_SETUP_COMPLEXITIES)[number])
    ? (value as (typeof VALID_SETUP_COMPLEXITIES)[number])
    : "unknown";
}

async function upsertReadme(
  repoId: number,
  data: { rawContent: string; hasContributionGuide: boolean; setupComplexity: string; techStack: string[]; architectureKeywords: string[] }
): Promise<void> {
  const setupComplexity = validateSetupComplexity(data.setupComplexity);
  await db.scrapedReadme.upsert({
    where: { repoId },
    create: {
      repoId,
      rawContent: data.rawContent.slice(0, 50000),
      hasContributionGuide: data.hasContributionGuide,
      setupComplexity,
      techStack: JSON.stringify(data.techStack),
      architectureKeywords: JSON.stringify(data.architectureKeywords),
    },
    update: {
      rawContent: data.rawContent.slice(0, 50000),
      hasContributionGuide: data.hasContributionGuide,
      setupComplexity,
      techStack: JSON.stringify(data.techStack),
      architectureKeywords: JSON.stringify(data.architectureKeywords),
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
      readme: {
        hasContributionGuide: boolean;
        setupComplexity: string;
        techStack: string;
        architectureKeywords: string;
      } | null;
    };
  }[]
> {
  const where: Record<string, unknown> = {};

  if (filters.languages.length > 0) {
    const languageOr = filters.languages.map((lang) => ({
      language: { equals: lang, mode: "insensitive" },
    }));

    const topicOr = filters.languages.map((lang) => ({
      topics: { contains: lang, mode: "insensitive" as const },
    }));

    where.repo = {
      OR: [...languageOr, ...topicOr],
    };
  }

  if (filters.interests.length > 0) {
    const interestOr = filters.interests.map((interest) => ({
      topics: { contains: interest, mode: "insensitive" as const },
    }));

    if (where.repo) {
      where.repo = {
        AND: [
          where.repo as Record<string, unknown>,
          { OR: interestOr },
        ],
      };
    } else {
      where.repo = { OR: interestOr };
    }
  }

  const issues = await db.scrapedIssue.findMany({
    where,
    include: {
      repo: {
        include: { readme: true },
      },
    },
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
