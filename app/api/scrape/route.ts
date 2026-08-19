import { NextResponse } from "next/server";
import { runScrapePipeline, runScrapeForRepo } from "@/lib/scraper-pipeline";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  if (body.repo) {
    const success = await runScrapeForRepo(body.repo);
    return NextResponse.json({
      status: success ? "ok" : "failed",
      repo: body.repo,
    });
  }

  const result = await runScrapePipeline();
  return NextResponse.json(result);
}

export async function GET() {
  const result = await runScrapePipeline();
  return NextResponse.json(result);
}
