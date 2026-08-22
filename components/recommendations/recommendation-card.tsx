"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Recommendation, MatchScoreBreakdown } from "@/lib/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const difficultyColorMap: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  advanced: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const matchedLabelColorMap: Record<string, string> = {
  "Beginner Friendly": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Help Wanted": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Bug Fix": "bg-red-500/10 text-red-400 border-red-500/20",
  Documentation: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const languageColorMap: Record<string, string> = {
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Zig: "#ec915c",
};

const setupComplexityMap: Record<string, { label: string; color: string }> = {
  simple: { label: "Simple Setup", color: "text-emerald-400" },
  moderate: { label: "Moderate Setup", color: "text-amber-400" },
  complex: { label: "Complex Setup", color: "text-red-400" },
  unknown: { label: "Setup Unknown", color: "text-muted-foreground" },
};

const categoryColorMap: Record<string, string> = {
  language: "text-sky-400",
  interest: "text-violet-400",
  issue: "text-emerald-400",
  project: "text-amber-400",
  goal: "text-rose-400",
  fit: "text-teal-400",
};

function ScoreBreakdownGroup({ items, label }: { items: MatchScoreBreakdown[]; label: string }) {
  if (items.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider w-14 shrink-0">
        {label}
      </span>
      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
        {items.map((item) => (
          <span key={item.label} className="flex items-center gap-0.5 text-[10px]">
            <span className={`font-medium ${categoryColorMap[item.category]}`}>
              {item.points > 0 ? "+" : ""}{item.points}
            </span>
            <span className="text-muted-foreground">{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { readme, matchScore } = recommendation;
  const setupInfo = readme ? setupComplexityMap[readme.setupComplexity] : null;

  const languageItems = matchScore.breakdown.filter((b) => b.category === "language");
  const interestItems = matchScore.breakdown.filter((b) => b.category === "interest");
  const issueItems = matchScore.breakdown.filter((b) => b.category === "issue");
  const projectItems = matchScore.breakdown.filter((b) => b.category === "project");
  const goalItems = matchScore.breakdown.filter((b) => b.category === "goal");
  const fitItems = matchScore.breakdown.filter((b) => b.category === "fit");

  return (
    <Card className="p-0 overflow-hidden border-border/50 hover:border-border transition-all duration-300 group">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-muted-foreground mb-0.5">
              {recommendation.organization}/{recommendation.repository}
            </p>
            <a
              href={recommendation.issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
            >
              #{recommendation.issueNumber} {recommendation.issueTitle}
            </a>
          </div>
          <div className="shrink-0 ml-3 flex flex-col items-end gap-1">
            <div className="text-lg font-bold text-foreground tabular-nums">
              {matchScore.total}
            </div>
            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0.5 ${difficultyColorMap[recommendation.difficulty]}`}
            >
              {recommendation.difficulty}
            </Badge>
          </div>
        </div>

        {matchScore.breakdown.length > 0 && (
          <div className="space-y-1 mb-4">
            <ScoreBreakdownGroup items={languageItems} label="Lang" />
            <ScoreBreakdownGroup items={interestItems} label="Fit" />
            <ScoreBreakdownGroup items={issueItems} label="Issue" />
            <ScoreBreakdownGroup items={projectItems} label="Repo" />
            {goalItems.length > 0 && (
              <ScoreBreakdownGroup items={goalItems} label="Goal" />
            )}
            {fitItems.length > 0 && (
              <ScoreBreakdownGroup items={fitItems} label="Time" />
            )}
          </div>
        )}

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: languageColorMap[recommendation.repoLanguage] ?? "#888" }}
            />
            {recommendation.repoLanguage}
          </span>
          <span className="text-border">·</span>
          <span>★ {recommendation.repoStars.toLocaleString()}</span>
          <span className="text-border">·</span>
          <span>{recommendation.comments} comments</span>
        </div>

        {recommendation.matchedLabels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recommendation.matchedLabels.map((label) => (
              <Badge
                key={label}
                variant="outline"
                className={`text-[10px] px-2 py-0.5 ${matchedLabelColorMap[label] ?? "bg-muted/50 text-muted-foreground border-border"}`}
              >
                {label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border/50 px-5 py-3 bg-muted/30">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Why this project
        </p>

        <div className="space-y-1.5 mb-3">
          {recommendation.whyRecommended.map((reason, i) => (
            <div
              key={i}
              className="text-[11px] text-muted-foreground flex items-start gap-1.5"
            >
              <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
              {reason}
            </div>
          ))}
        </div>

        {readme && (
          <div className="pt-2 border-t border-border/30 space-y-1.5">
            {readme.hasContributionGuide && (
              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span>
                Has contribution guide
              </div>
            )}
            {setupInfo && (
              <div className="text-[11px] flex items-center gap-1.5">
                <span className={setupInfo.color}>✓</span>
                <span className="text-muted-foreground">{setupInfo.label}</span>
              </div>
            )}
            {readme.techStack.length > 0 && (
              <div className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                <span className="text-blue-400 mt-0.5 shrink-0">✓</span>
                <span>
                  Tech: {readme.techStack.slice(0, 5).join(", ")}
                  {readme.techStack.length > 5 && ` +${readme.techStack.length - 5} more`}
                </span>
              </div>
            )}
            {readme.architectureKeywords.length > 0 && (
              <div className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
                <span>
                  Architecture: {readme.architectureKeywords.slice(0, 3).join(", ")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
