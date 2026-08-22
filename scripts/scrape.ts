import { runScrapePipeline } from "../lib/scraper-pipeline";

async function main() {
  console.log("Starting scrape pipeline...");
  const result = await runScrapePipeline();

  console.log(`Discovered: ${result.discovered}`);
  console.log(`Scraped repos: ${result.scraped}`);
  console.log(`Issues: ${result.issuesScraped}`);
  console.log(`Readmes: ${result.readmesScraped}`);

  if (result.errors.length > 0) {
    console.error("Errors:", result.errors);
    process.exit(1);
  }

  console.log("Scrape complete.");
}

main().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
