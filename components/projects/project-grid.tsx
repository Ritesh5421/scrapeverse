import type { Project } from "@/lib/types";
import { ProjectCard } from "./project-card";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass-card rounded-2xl p-16 text-center">
      <p className="text-3xl" aria-hidden>
        ◇
      </p>
      <h3 className="mt-4 text-base font-semibold text-foreground">
        No projects found
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function ProjectGrid({
  projects,
  savedIds,
  onToggleSave,
}: {
  projects: Project[];
  savedIds?: Set<string>;
  onToggleSave?: (project: Project) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          saved={savedIds?.has(project.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}
