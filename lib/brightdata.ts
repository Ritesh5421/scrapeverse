import { bdclient } from "@brightdata/sdk";

const TRENDING_SCRAPER_ID = "c_mszmts63lwxh4wh0h";

let client: InstanceType<typeof bdclient> | null = null;

function getClient() {
  if (!client) {
    client = new bdclient({
      apiKey: process.env.BRIGHTDATA_API_KEY!,
      logLevel: "WARNING",
      structuredLogging: false,
      verbose: false,
    });
  }
  return client;
}

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

export interface IssueData {
  number: number;
  title: string;
  url: string;
  labels: string[];
  comments: number;
  author: string | null;
  createdAt: string;
}

export async function discoverTrendingRepos(): Promise<string[]> {
  try {
    const results = await getClient().scraperStudio.run(TRENDING_SCRAPER_ID, {
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

export async function fetchRepoDetails(owner: string, repo: string): Promise<RepoData | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "scrapeverse/0.1.0",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();

    return {
      repository_name: data.name,
      owner: data.owner.login,
      description: data.description || "",
      star_count: data.stargazers_count,
      fork_count: data.forks_count,
      topics: data.topics || [],
      license: data.license?.spdx_id || "",
      default_branch: data.default_branch || "main",
    };
  } catch (err) {
    console.error(`Failed to fetch repo details for ${owner}/${repo}:`, err);
    return null;
  }
}

export async function fetchRepoDetailsBatch(
  urls: string[]
): Promise<RepoData[]> {
  const results: RepoData[] = [];

  for (const url of urls) {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) continue;

    const [, owner, repo] = match;
    const details = await fetchRepoDetails(owner, repo);
    if (details) {
      results.push(details);
    }
  }

  return results;
}

export async function fetchIssues(
  owner: string,
  repo: string,
  labels: string[] = ["good first issue", "help wanted"]
): Promise<IssueData[]> {
  const allIssues: IssueData[] = [];

  for (const label of labels) {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/issues?labels=${encodeURIComponent(label)}&state=open&per_page=10`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "scrapeverse/0.1.0",
        },
      });

      if (!response.ok) {
        console.error(`GitHub API error for ${owner}/${repo}: ${response.status}`);
        continue;
      }

      const issues = await response.json();
      for (const issue of issues) {
        if (issue.pull_request) continue;

        allIssues.push({
          number: issue.number,
          title: issue.title,
          url: issue.html_url,
          labels: issue.labels.map((l: { name: string }) => l.name),
          comments: issue.comments,
          author: issue.user?.login ?? null,
          createdAt: issue.created_at,
        });
      }
    } catch (err) {
      console.error(`Failed to fetch issues for ${owner}/${repo} label=${label}:`, err);
    }
  }

  const seen = new Set<number>();
  return allIssues.filter((issue) => {
    if (seen.has(issue.number)) return false;
    seen.add(issue.number);
    return true;
  });
}

export async function closeClient(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}
