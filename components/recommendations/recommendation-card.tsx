"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Recommendation } from "@/lib/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const difficultyColorMap: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  advanced: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const labelColorMap: Record<string, string> = {
  "Beginner Friendly": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Help Wanted": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Bug Fix": "bg-red-500/10 text-red-400 border-red-500/20",
  Documentation: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
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
          <Badge
            variant="outline"
            className={`text-[10px] px-2 py-0.5 shrink-0 ml-3 ${difficultyColorMap[recommendation.difficulty]}`}
          >
            {recommendation.difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--lang-color)]" />
            {recommendation.repoLanguage}
          </span>
          <span className="text-border">·</span>
          <span>★ {recommendation.repoStars.toLocaleString()}</span>
          <span className="text-border">·</span>
          <span>{recommendation.comments} comments</span>
        </div>

        {recommendation.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recommendation.labels.map((label) => (
              <Badge
                key={label}
                variant="outline"
                className={`text-[10px] px-2 py-0.5 ${labelColorMap[label] ?? "bg-muted/50 text-muted-foreground border-border"}`}
              >
                {label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border/50 px-5 py-3 bg-muted/30">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Why this issue
        </p>
        <ul className="space-y-1">
          {recommendation.whyRecommended.map((reason, i) => (
            <li
              key={i}
              className="text-[11px] text-muted-foreground flex items-start gap-1.5"
            >
              <span className="text-foreground/60 mt-0.5 shrink-0">→</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
