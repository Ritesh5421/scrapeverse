import { bdclient } from "@brightdata/sdk";

const TRENDING_SCRAPER_ID = "c_mszmts63lwxh4wh0h";
const REPO_SCRAPER_ID = "c_mszma8ux1xoygpchmn";
const ISSUES_SCRAPER_ID = "c_mszmcri32bjkg1yaf";

const client = new bdclient({
  apiKey: process.env.BRIGHTDATA_API_KEY!,
  logLevel: "WARNING",
  structuredLogging: false,
  verbose: false,
});

export interface TrendingEntry {
  product_page_url: string;
}

export interface RepoData {
  repository_name: string;
  owner: string;
  description: string;
  star_count: number;
  fork_count: number;
  topics: string[];
  license: string;
  default_branch: string;
}

export interface IssuesData {
  good_first_issue_count: number;
  help_wanted_count: number;
  total_open_issues: number;
}

export async function discoverTrendingRepos(): Promise<string[]> {
  try {
    const results = await client.scraperStudio.run(TRENDING_SCRAPER_ID, {
      input: { url: "https://github.com/trending" },
    });
    const urls: string[] = [];
    for (const result of results) {
      if (result.data) {
        for (const entry of result.data) {
          const url = (entry as TrendingEntry).product_page_url;
          if (url && url.includes("github.com/")) {
            urls.push(url);
          }
        }
      }
    }
    return [...new Set(urls)];
  } catch (err) {
    console.error("Failed to discover trending repos:", err);
    return [];
  }
}

export async function scrapeRepo(url: string): Promise<RepoData | null> {
  try {
    const results = await client.scraperStudio.run(REPO_SCRAPER_ID, {
      input: { url },
    });
    const first = results[0];
    if (!first || first.error || !first.data?.[0]) {
      return null;
    }
    return first.data[0] as RepoData;
  } catch (err) {
    console.error(`Failed to scrape repo ${url}:`, err);
    return null;
  }
}

export async function scrapeRepos(urls: string[]): Promise<RepoData[]> {
  try {
    const inputs = urls.map((url) => ({ url }));
    const results = await client.scraperStudio.run(REPO_SCRAPER_ID, {
      input: inputs,
    });
    return results
      .filter((r) => !r.error && r.data?.[0])
      .map((r) => r.data![0] as RepoData);
  } catch (err) {
    console.error("Failed to batch scrape repos:", err);
    return [];
  }
}

export async function scrapeIssues(url: string): Promise<IssuesData | null> {
  try {
    const results = await client.scraperStudio.run(ISSUES_SCRAPER_ID, {
      input: { url },
    });
    const first = results[0];
    if (!first || first.error || !first.data?.[0]) {
      return null;
    }
    return first.data[0] as IssuesData;
  } catch (err) {
    console.error(`Failed to scrape issues ${url}:`, err);
    return null;
  }
}

export async function closeClient(): Promise<void> {
  await client.close();
}
