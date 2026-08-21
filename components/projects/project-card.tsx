import Link from "next/link";
import { Star, GitFork, Users, Bookmark } from "lucide-react";
import type { Project } from "@/lib/types";
import { formatNumber } from "@/lib/utils/format-number";
import { LanguageBadge } from "@/components/common/language-badge";
import { MatchScore } from "@/components/common/match-score";
import { cn } from "@/lib/utils";

export function ActivityBadge({
  activity,
}: {
  activity: Project["activity"];
}) {
  const map = {
    high: { label: "Active", color: "text-success border-success/30 bg-success/10" },
    medium: { label: "Moderate", color: "text-primary border-primary/30 bg-primary/10" },
    low: { label: "Low", color: "text-muted-foreground border-border bg-muted" },
  } as const;
  const { label, color } = map[activity];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${color}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {label}
    </span>
  );
}

interface ProjectCardProps {
  project: Project;
  saved?: boolean;
  onToggleSave?: (project: Project) => void;
}

export function ProjectCard({ project, saved, onToggleSave }: ProjectCardProps) {
  return (
    <article className="glass-card glass-card-hover flex h-full flex-col rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <LanguageBadge language={project.language} />
        <div className="flex items-center gap-2">
          <MatchScore score={project.matchScore} />
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(project)}
              aria-label={saved ? "Remove from saved" : "Save project"}
              className={cn(
                "rounded-full border p-1.5 transition-colors cursor-pointer",
                saved
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              )}
            >
              <Bookmark className={cn("size-3.5", saved && "fill-current")} />
            </button>
          )}
        </div>
      </div>

      <Link
        href={`/projects/${project.owner}/${project.name}`}
        className="mt-4 text-base font-semibold text-foreground transition-colors hover:text-primary"
      >
        {project.owner}/{project.name}
      </Link>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Star className="size-3.5" />
          {formatNumber(project.stars)}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork className="size-3.5" />
          {formatNumber(project.forks)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="size-3.5" />
          {formatNumber(project.contributors)}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          {project.goodFirstIssues > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              ◇ {project.goodFirstIssues} good first issues
            </span>
          )}
          <ActivityBadge activity={project.activity} />
        </div>
        <Link
          href={`/projects/${project.owner}/${project.name}`}
          className="shrink-0 text-xs font-semibold text-primary hover:underline underline-offset-4"
        >
          View Project →
        </Link>
      </div>
    </article>
  );
}
