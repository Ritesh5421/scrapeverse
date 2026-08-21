"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project, ProjectQueryFilters } from "@/lib/types";
import { searchProjects } from "@/lib/services/project-service";

export function useSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  return { query, debouncedQuery: debounced, setQuery };
}

export function useProjects(filters: ProjectQueryFilters) {
  const key = useMemo(() => JSON.stringify(filters), [filters]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    searchProjects(JSON.parse(key) as ProjectQueryFilters).then((results) => {
      if (!cancelled) {
        setProjects(results);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { projects, isLoading };
}
