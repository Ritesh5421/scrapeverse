"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Compass,
  Bookmark,
  GitPullRequest,
  UserRound,
  LogOut,
  Star,
  GitFork,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getSavedProjects, toggleSavedProject } from "@/lib/services/saved-projects";
import { mockRecommendations } from "@/lib/mock-data";
import type { Project, Recommendation } from "@/lib/types";
import { formatNumber } from "@/lib/utils/format-number";
import { ProjectCard } from "@/components/projects/project-card";
import { PreferencesEditor } from "@/components/account/preferences-editor";
import { cn } from "@/lib/utils";

type Tab = "overview" | "saved" | "contributions" | "profile";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "saved", label: "Saved Projects", icon: Bookmark },
  { id: "contributions", label: "My Contributions", icon: GitPullRequest },
  { id: "profile", label: "Profile", icon: UserRound },
] as const;

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-primary-foreground" aria-hidden>
          <path d="M12 2L22 12L12 22L2 12Z" />
        </svg>
      </div>
      <span className="font-semibold text-foreground tracking-tight">ContribHub</span>
    </Link>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();

  const [tab, setTab] = useState<Tab>("overview");
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setSavedProjects(getSavedProjects());
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const loadRecommendations = useCallback(() => {
    const prefs = user?.preferences;
    const params = new URLSearchParams();
    const languages = [...(prefs?.languages ?? []), ...(prefs?.customLanguages ?? [])];
    if (languages.length > 0) params.set("languages", languages.join(","));
    if (prefs?.interests.length) params.set("interests", prefs.interests.join(","));

    fetch(`/api/recommendations?${params}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) =>
        setRecommendations(
          data.recommendations?.length > 0 ? data.recommendations : mockRecommendations
        )
      )
      .catch(() => setRecommendations(mockRecommendations));
  }, [user]);

  useEffect(() => {
    if (user) loadRecommendations();
  }, [user, loadRecommendations]);

  const handleToggleSave = (project: Project) => {
    setSavedProjects(toggleSavedProject(project));
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
      </div>
    );
  }

  const prefs = user.preferences;
  const profileFields = [
    prefs?.interests.length,
    prefs?.experienceLevel,
    prefs?.goals.length,
    [...(prefs?.languages ?? []), ...(prefs?.customLanguages ?? [])].length,
    prefs?.timeCommitment,
  ];
  const filled = profileFields.filter(Boolean).length;
  const completeness = Math.round((filled / profileFields.length) * 100);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-6">
        <Logo />
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer",
              tab === id
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
        <Link
          href="/projects"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Compass className="size-4" />
          Discover
        </Link>
      </nav>
      <div className="border-t border-border/60 p-4">
        <p className="truncate px-2 text-sm font-medium text-foreground">{user.name}</p>
        <p className="truncate px-2 text-xs text-muted-foreground">{user.email}</p>
        <button
          onClick={() => void signOut().then(() => router.push("/"))}
          className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border/60 bg-card lg:block">
        {sidebar}
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <div className="glass-strong sticky top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden">
          <Logo />
          <button
            onClick={() => void signOut().then(() => router.push("/"))}
            aria-label="Sign out"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <LogOut className="size-4" />
          </button>
        </div>

        <main className="mx-auto max-w-5xl px-5 py-8 lg:px-10 lg:py-10">
          {/* Mobile tabs */}
          <div className="scrollbar-hide mb-8 flex gap-1.5 overflow-x-auto lg:hidden">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                  tab === id
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="flex flex-col gap-8">
              <header>
                <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                  Welcome back, {user.name.split(" ")[0]} 👋
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Here&apos;s your contribution overview.
                </p>
              </header>

              <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatTile value={`${completeness}%`} label="Profile completeness" />
                <StatTile value={String(savedProjects.length)} label="Saved projects" />
                <StatTile value={String(recommendations.length)} label="Matched issues" />
                <StatTile
                  value={
                    user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })
                      : "New"
                  }
                  label="Member since"
                />
              </section>

              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Skill Profile
                  </h2>
                  <button
                    onClick={() => setTab("profile")}
                    className="text-xs font-semibold text-primary hover:underline underline-offset-4 cursor-pointer"
                  >
                    Edit →
                  </button>
                </div>
                <div className="glass-card mt-3 flex flex-wrap gap-2 rounded-xl p-5">
                  {prefs ? (
                    <>
                      {[...(prefs.languages ?? []), ...(prefs.customLanguages ?? [])].map((lang) => (
                        <span key={lang} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {lang}
                        </span>
                      ))}
                      {(prefs.interests ?? []).map((interest) => (
                        <span key={interest} className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                          {interest}
                        </span>
                      ))}
                      {prefs.experienceLevel && (
                        <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                          {prefs.experienceLevel}
                        </span>
                      )}
                      {prefs.timeCommitment && (
                        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                          {prefs.timeCommitment}
                        </span>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No skills added yet.{" "}
                      <button onClick={() => setTab("profile")} className="font-semibold text-primary hover:underline cursor-pointer">
                        Set up your profile
                      </button>{" "}
                      to get personalized matches.
                    </p>
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Recommended For You
                </h2>
                <div className="mt-3 grid gap-3">
                  {recommendations.slice(0, 4).map((rec) => (
                    <a
                      key={rec.id}
                      href={rec.issueUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="glass-card glass-card-hover block rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {rec.issueTitle}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {rec.organization}/{rec.repository} · #{rec.issueNumber}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-primary">
                          {rec.difficulty}
                        </span>
                      </div>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        {rec.labels.slice(0, 3).map((label) => (
                          <span key={label} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                            {label}
                          </span>
                        ))}
                        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Star className="size-3" />
                          {formatNumber(rec.repoStars)}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent Activity
                </h2>
                <div className="glass-card mt-3 flex flex-col divide-y divide-border/60 rounded-xl">
                  {savedProjects.slice(-3).reverse().map((project) => (
                    <div key={project.id} className="flex items-center gap-3 px-5 py-3.5 text-sm">
                      <Bookmark className="size-4 shrink-0 text-primary" />
                      <span className="text-foreground">
                        Saved <span className="font-semibold">{project.owner}/{project.name}</span>
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="size-3" />
                        {formatNumber(project.stars)}
                      </span>
                    </div>
                  ))}
                  {savedProjects.length === 0 && (
                    <p className="px-5 py-6 text-sm text-muted-foreground">
                      No activity yet —{" "}
                      <Link href="/projects" className="font-semibold text-primary hover:underline">
                        discover projects
                      </Link>{" "}
                      and save the ones you like.
                    </p>
                  )}
                </div>
              </section>
            </div>
          )}

          {tab === "saved" && (
            <div className="flex flex-col gap-6">
              <header>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Saved Projects</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Projects you bookmarked for future contributions.
                </p>
              </header>
              {savedProjects.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  {savedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} saved onToggleSave={handleToggleSave} />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-14 text-center">
                  <Bookmark className="mx-auto size-8 text-muted-foreground" />
                  <h3 className="mt-4 text-base font-semibold text-foreground">Nothing saved yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Browse projects and hit the bookmark icon to save them here.
                  </p>
                  <Link
                    href="/projects"
                    className="mt-5 inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Discover Projects
                  </Link>
                </div>
              )}
            </div>
          )}

          {tab === "contributions" && (
            <div className="flex flex-col gap-6">
              <header>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">My Contributions</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Track your pull requests across open source.
                </p>
              </header>
              <div className="glass-card rounded-2xl p-14 text-center">
                <GitPullRequest className="mx-auto size-8 text-muted-foreground" />
                <h3 className="mt-4 text-base font-semibold text-foreground">No contributions yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick a good first issue from your recommendations and submit your first PR.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <GitFork className="size-3.5" />
                  Connect your GitHub account soon to auto-track PRs.
                </span>
              </div>
            </div>
          )}

          {tab === "profile" && <PreferencesEditor onClose={() => setTab("overview")} />}
        </main>
      </div>
    </div>
  );
}
