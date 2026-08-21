"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageContainer } from "@/components/layout/page-container";
import { ProjectSearch } from "@/components/projects/project-search";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectGrid, EmptyState } from "@/components/projects/project-grid";
import { useProjects, useSearch } from "@/hooks/use-projects";
import {
  getSavedProjects,
  toggleSavedProject,
} from "@/lib/services/saved-projects";
import type { Project, ProjectQueryFilters } from "@/lib/types";

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const { query, debouncedQuery, setQuery } = useSearch(initialQuery);

  const [filters, setFilters] = useState<ProjectQueryFilters>({
    language: "any",
    difficulty: "any",
    minStars: 0,
    activity: "any",
    goodFirstIssuesOnly: false,
    sort: "best-match",
  });

  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setSavedIds(new Set(getSavedProjects().map((p) => p.id)));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleSave = (project: Project) => {
    const next = toggleSavedProject(project);
    setSavedIds(new Set(next.map((p) => p.id)));
  };

  const effectiveFilters = useMemo(
    () => ({ ...filters, query: debouncedQuery }),
    [filters, debouncedQuery]
  );

  const { projects, isLoading } = useProjects(effectiveFilters);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        <PageContainer>
          <header className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Discover Projects
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Browse open source repositories matched to your skills. Filter by
              language, difficulty, and activity to find your next
              contribution.
            </p>
          </header>

          <div className="mt-8 max-w-2xl">
            <ProjectSearch value={query} onChange={setQuery} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProjectFilters filters={filters} onChange={setFilters} />
            </div>

            <div>
              {isLoading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="glass-card h-56 animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <>
                  <p className="mb-4 text-xs font-medium text-muted-foreground">
                    {projects.length} project{projects.length > 1 ? "s" : ""}{" "}
                    found
                  </p>
                  <ProjectGrid
                    projects={projects}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                  />
                </>
              ) : (
                <EmptyState message="Try adjusting your search or clearing some filters." />
              )}
            </div>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
        </div>
      }
    >
      <ProjectsPageContent />
    </Suspense>
  );
}
