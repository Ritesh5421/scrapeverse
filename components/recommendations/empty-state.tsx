"use client";

import { Badge } from "@/components/ui/badge";

interface EmptyStateProps {
  onBroadenSearch: () => void;
}

const adjacentTechnologies = [
  "Go",
  "Python",
  "JavaScript",
  "Web Development",
  "DevOps",
  "Security",
];

export function EmptyState({ onBroadenSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        No projects found
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        We couldn&apos;t find projects matching your exact criteria. Try broadening
        your filters or exploring adjacent technologies.
      </p>

      <div className="mb-6">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">
          You might also like
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {adjacentTechnologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <button
        onClick={onBroadenSearch}
        className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors cursor-pointer"
      >
        Broaden my search
      </button>
    </div>
  );
}
