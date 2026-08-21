import type { Project } from "@/lib/types";

const STORAGE_KEY = "contribhub:saved-projects";

export function getSavedProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

export function isProjectSaved(id: string): boolean {
  return getSavedProjects().some((p) => p.id === id);
}

export function toggleSavedProject(project: Project): Project[] {
  const current = getSavedProjects();
  const next = current.some((p) => p.id === project.id)
    ? current.filter((p) => p.id !== project.id)
    : [...current, project];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
