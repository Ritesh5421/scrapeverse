import { db } from "./db";
import {
  discoverTrendingRepos,
  scrapeRepo,
  scrapeRepos,
  closeClient,
  type RepoData,
} from "./brightdata";

const SCRAPE_STALENESS_MS = 6 * 60 * 60 * 1000;

export async function runScrapePipeline(): Promise<{
  discovered: number;
  scraped: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let discovered = 0;
  let scraped = 0;

  try {
    const urls = await discoverTrendingRepos();
    discovered = urls.length;

    if (urls.length === 0) {
      errors.push("No trending repos discovered");
      return { discovered: 0, scraped: 0, errors };
    }

    const repoDataList = await scrapeRepos(urls);

    for (const repoData of repoDataList) {
      try {
        await upsertRepo(repoData);
        scraped++;
      } catch (err) {
        errors.push(`Failed to store ${repoData.owner}/${repoData.repository_name}: ${err}`);
      }
    }
  } catch (err) {
    errors.push(`Pipeline error: ${err}`);
  } finally {
    await closeClient();
  }

  return { discovered, scraped, errors };
}

export async function runScrapeForRepo(fullName: string): Promise<boolean> {
  try {
    const url = `https://github.com/${fullName}`;
    const repoData = await scrapeRepo(url);
    if (!repoData) return false;
    await upsertRepo(repoData);
    return true;
  } catch (err) {
    console.error(`Failed to scrape ${fullName}:`, err);
    return false;
  } finally {
    await closeClient();
  }
}

async function upsertRepo(data: RepoData): Promise<void> {
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

export async function getFreshRepos(languages: string[]): Promise<
  {
    id: number;
    fullName: string;
    owner: string;
    name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    topics: string;
    license: string | null;
    pushedAt: Date | null;
    scrapedAt: Date;
    issues: { label: string; count: number }[];
  }[]
> {
  const repos = await db.scrapedRepo.findMany({
    where: {
      OR: [
        { language: { in: languages, mode: "insensitive" } },
        { topics: { contains: languages[0] || "", mode: "insensitive" } },
      ],
    },
    orderBy: { stars: "desc" },
    include: { issues: true },
  });

  return repos;
}

export async function isDataStale(): Promise<boolean> {
  const latest = await db.scrapedRepo.findFirst({
    orderBy: { scrapedAt: "desc" },
  });
  if (!latest) return true;
  return Date.now() - latest.scrapedAt.getTime() > SCRAPE_STALENESS_MS;
}
