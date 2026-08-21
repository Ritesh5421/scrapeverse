import { Star, GitFork, CircleDot, Users, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";
import { formatNumber } from "@/lib/utils/format-number";
import { GITHUB_URL } from "@/lib/constants";
import { LanguageBadge } from "@/components/common/language-badge";
import { MatchScore } from "@/components/common/match-score";
import { ActivityBadge } from "./project-card";

function StatTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="glass-card rounded-xl p-4 text-center">
      <div className="mx-auto flex size-8 items-center justify-center text-primary">
        {icon}
      </div>
      <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

const ACTIVITY_BARS = [42, 65, 38, 80, 55, 92, 70, 60, 85, 48, 75, 90];

export function ProjectDetails({ project }: { project: Project }) {
  const repoUrl = `${GITHUB_URL}/${project.owner}/${project.name}`;

  return (
    <article className="flex flex-col gap-10">
      {/* Header */}
      <header className="glass-card rounded-2xl p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                {project.owner}/{project.name}
              </h1>
              <MatchScore score={project.matchScore} />
              <ActivityBadge activity={project.activity} />
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <LanguageBadge language={project.language} />
              {project.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
          <a
            href={`${repoUrl}/issues`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
          >
            Contribute on GitHub
            <ExternalLink className="size-4" />
          </a>
        </div>
      </header>

      {/* Stats */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Repository Stats
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile
            icon={<Star className="size-4" />}
            value={formatNumber(project.stars)}
            label="Stars"
          />
          <StatTile
            icon={<GitFork className="size-4" />}
            value={formatNumber(project.forks)}
            label="Forks"
          />
          <StatTile
            icon={<CircleDot className="size-4" />}
            value={formatNumber(project.issues)}
            label="Open Issues"
          />
          <StatTile
            icon={<Users className="size-4" />}
            value={formatNumber(project.contributors)}
            label="Contributors"
          />
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Opportunities */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Contribution Opportunities
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={`${repoUrl}/labels/good%20first%20issue`}
              target="_blank"
              rel="noreferrer"
              className="glass-card glass-card-hover flex items-center justify-between rounded-xl p-4"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  ◇ Good First Issues
                </p>
                <p className="text-xs text-muted-foreground">
                  Curated for newcomers — start here
                </p>
              </div>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-bold text-primary">
                {project.goodFirstIssues}
              </span>
            </a>
            <a
              href={`${repoUrl}/labels/help%20wanted`}
              target="_blank"
              rel="noreferrer"
              className="glass-card glass-card-hover flex items-center justify-between rounded-xl p-4"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  ● Help Wanted
                </p>
                <p className="text-xs text-muted-foreground">
                  Maintainers actively seeking contributions
                </p>
              </div>
              <span className="rounded-full bg-success/15 px-3 py-1 text-sm font-bold text-success">
                {project.helpWantedIssues}
              </span>
            </a>
            <a
              href={`${repoUrl}/labels/documentation`}
              target="_blank"
              rel="noreferrer"
              className="glass-card glass-card-hover flex items-center justify-between rounded-xl p-4"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  ▲ Documentation
                </p>
                <p className="text-xs text-muted-foreground">
                  A great way to learn the codebase
                </p>
              </div>
              <span className="text-muted-foreground">→</span>
            </a>
          </div>
        </section>

        {/* Activity chart */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Commit Activity — last 12 weeks
          </h2>
          <div className="glass-card mt-4 rounded-xl p-5">
            <div className="flex h-36 items-end gap-1.5">
              {ACTIVITY_BARS.map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`flex-1 rounded-t ${
                    i === ACTIVITY_BARS.length - 1
                      ? "bg-primary"
                      : "bg-primary/25"
                  }`}
                  aria-hidden
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Last commit{" "}
              {project.lastCommitDaysAgo === 0
                ? "today"
                : `${project.lastCommitDaysAgo} day${project.lastCommitDaysAgo > 1 ? "s" : ""} ago`}{" "}
              · consistently active repository
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}
