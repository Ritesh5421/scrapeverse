"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageContainer } from "@/components/layout/page-container";
import { ProjectCard } from "@/components/projects/project-card";
import {
  getTrending,
  type TrendingPeriod,
} from "@/lib/services/project-service";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const PERIODS: { value: TrendingPeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

export default function TrendingPage() {
  const [period, setPeriod] = useState<TrendingPeriod>("today");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getTrending(period).then((results) => {
      if (!cancelled) {
        setProjects(results);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        <PageContainer>
          <header className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                Trending Projects
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                The open source repositories gaining the most momentum right
                now — ranked by stars, activity, and contribution
                opportunities.
              </p>
            </div>
            <div className="flex gap-1.5 rounded-xl border border-border bg-card p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={cn(
                    "rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                    period === p.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </header>

          <div className="mt-10 flex flex-col gap-5">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="glass-card h-40 animate-pulse rounded-2xl"
                />
              ))
            ) : (
              projects.map((project, index) => (
                <div key={project.id} className="flex items-stretch gap-5">
                  <div className="glass-card hidden w-16 shrink-0 flex-col items-center justify-center rounded-2xl sm:flex">
                    <span className="text-2xl font-bold text-primary">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 [&>article]:h-full">
                    <ProjectCard project={project} />
                  </div>
                </div>
              ))
            )}
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
