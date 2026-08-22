"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/account/user-menu";
import { RecommendationGrid } from "./recommendation-grid";
import { FilterSidebar } from "./filter-sidebar";
import { EmptyState } from "./empty-state";
import { defaultFilters } from "@/lib/mock-data";
import type { Filters, Recommendation } from "@/lib/types";

interface ResultsPageProps {
  recommendations: Recommendation[];
  onRestart: () => void;
  initialDifficulty?: Filters["maxDifficulty"];
  dataSource?: "live" | "mock";
}

export function ResultsPage({
  recommendations,
  onRestart,
  initialDifficulty = "any",
  dataSource = "mock",
}: ResultsPageProps) {
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    maxDifficulty: initialDifficulty,
  });

  const filtered = useMemo(() => {
    return recommendations.filter((rec) => {
      if (
        filters.language !== "any" &&
        rec.repoLanguage !== filters.language
      )
        return false;
      if (
        filters.maxDifficulty !== "any" &&
        rec.difficulty !== filters.maxDifficulty
      )
        return false;
      return true;
    });
  }, [recommendations, filters]);

  const handleBroadenSearch = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Your Issue Recommendations
            </h1>
            <p className="text-xs text-muted-foreground">
              {filtered.length}{" "}
              {filtered.length === 1 ? "issue" : "issues"} found
              <span className="mx-1.5">·</span>
              <span
                className={
                  dataSource === "live"
                    ? "text-emerald-400"
                    : "text-amber-400"
                }
              >
                {dataSource === "live" ? "Live data" : "Demo data"}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRestart}
              className="cursor-pointer text-xs"
            >
              Start Over
            </Button>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="shrink-0">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <EmptyState onBroadenSearch={handleBroadenSearch} />
            ) : (
              <RecommendationGrid recommendations={filtered} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
