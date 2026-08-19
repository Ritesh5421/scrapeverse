"use client";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import type { Filters } from "@/lib/types";
import { defaultFilters } from "@/lib/mock-data";

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const difficultyLevels = [
  { value: "any", label: "Any" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const languages = [
  "any",
  "Rust",
  "C",
  "C++",
  "Go",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Kotlin",
  "Zig",
];

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="w-full lg:w-64 shrink-0 space-y-6">
      <div>
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Difficulty
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {difficultyLevels.map((d) => (
            <button
              key={d.value}
              onClick={() => update("maxDifficulty", d.value as Filters["maxDifficulty"])}
              className={cn(
                "px-3 py-1.5 rounded-md border text-[11px] font-medium transition-all cursor-pointer",
                filters.maxDifficulty === d.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

        <Separator className="bg-border/50" />

      <div>
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Language
        </h3>
        <select
          value={filters.language}
          onChange={(e) => update("language", e.target.value)}
          className="w-full h-8 rounded-md border border-input bg-input/20 px-2 text-xs text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 cursor-pointer"
        >
          {languages.map((l) => (
            <option key={l} value={l}>
              {l === "any" ? "Any Language" : l}
            </option>
          ))}
        </select>
      </div>

        <Separator className="bg-border/50" />

      <div className="space-y-3">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.beginnerFriendlyOnly}
            onChange={(e) => update("beginnerFriendlyOnly", e.target.checked)}
            className="w-3.5 h-3.5 rounded border-border accent-foreground cursor-pointer"
          />
          <span className="text-xs text-muted-foreground">Beginner friendly only</span>
        </label>
      </div>

      <button
        onClick={() => onChange(defaultFilters)}
        className="w-full text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
      >
        Reset all filters
      </button>
    </div>
  );
}
