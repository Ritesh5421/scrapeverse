"use client";

import type { ProjectQueryFilters, SortOption } from "@/lib/types";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  "any",
  "Python",
  "JavaScript",
  "TypeScript",
  "Rust",
  "Go",
  "C",
];

const DIFFICULTIES = [
  { value: "any", label: "Any" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

const ACTIVITIES = [
  { value: "any", label: "Any" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

const STAR_FILTERS = [
  { value: 0, label: "Any" },
  { value: 10000, label: "10K+" },
  { value: 50000, label: "50K+" },
  { value: 100000, label: "100K+" },
] as const;

const SORTS = [
  { value: "best-match", label: "Best Match" },
  { value: "most-stars", label: "Most Stars" },
  { value: "most-active", label: "Most Active" },
  { value: "beginner-friendly", label: "Beginner Friendly" },
] as const;

interface ProjectFiltersProps {
  filters: ProjectQueryFilters;
  onChange: (filters: ProjectQueryFilters) => void;
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="mt-2.5 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
      )}
    >
      {children}
    </button>
  );
}

export function ProjectFilters({ filters, onChange }: ProjectFiltersProps) {
  return (
    <aside className="glass-card flex flex-col gap-6 rounded-2xl p-5">
      <FilterGroup title="Sort by">
        {SORTS.map((s) => (
          <Chip
            key={s.value}
            active={(filters.sort ?? "best-match") === s.value}
            onClick={() =>
              onChange({ ...filters, sort: s.value as SortOption })
            }
          >
            {s.label}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Language">
        {LANGUAGES.map((lang) => (
          <Chip
            key={lang}
            active={(filters.language ?? "any") === lang}
            onClick={() => onChange({ ...filters, language: lang })}
          >
            {lang === "any" ? "Any" : lang}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Difficulty">
        {DIFFICULTIES.map((d) => (
          <Chip
            key={d.value}
            active={(filters.difficulty ?? "any") === d.value}
            onClick={() => onChange({ ...filters, difficulty: d.value })}
          >
            {d.label}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Stars">
        {STAR_FILTERS.map((s) => (
          <Chip
            key={s.value}
            active={(filters.minStars ?? 0) === s.value}
            onClick={() => onChange({ ...filters, minStars: s.value })}
          >
            {s.label}
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup title="Activity">
        {ACTIVITIES.map((a) => (
          <Chip
            key={a.value}
            active={(filters.activity ?? "any") === a.value}
            onClick={() => onChange({ ...filters, activity: a.value })}
          >
            {a.label}
          </Chip>
        ))}
      </FilterGroup>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={filters.goodFirstIssuesOnly ?? false}
          onChange={(e) =>
            onChange({ ...filters, goodFirstIssuesOnly: e.target.checked })
          }
          className="size-4 accent-[#FFD600]"
        />
        Good first issues only
      </label>
    </aside>
  );
}
