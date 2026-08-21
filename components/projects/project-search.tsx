"use client";

import { Search, X } from "lucide-react";

interface ProjectSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProjectSearch({ value, onChange }: ProjectSearchProps) {
  return (
    <div className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 focus-within:border-primary/50 transition-colors">
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search projects, languages, topics…"
        aria-label="Search projects"
        className="h-7 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
