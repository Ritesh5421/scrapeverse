"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Recommendation } from "@/lib/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const badgeColorMap: Record<string, string> = {
  "Beginner Friendly": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "High Activity": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Great Documentation": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Systems Programming": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Fast Maintainer Response":
    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const activityColorMap: Record<string, string> = {
  "Very High": "bg-emerald-500",
  High: "bg-blue-500",
  Moderate: "bg-amber-500",
  Low: "bg-muted-foreground",
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <Card className="p-0 overflow-hidden border-border/50 hover:border-border transition-all duration-300 group">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground mb-0.5">
              {recommendation.organization}
            </p>
            <h3 className="text-sm font-semibold text-foreground truncate">
              {recommendation.repository}
            </h3>
          </div>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0 ml-3">
            ★ {recommendation.stars.toLocaleString()}
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {recommendation.description}
        </p>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--lang-color)]" />
            {recommendation.primaryLanguage}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${activityColorMap[recommendation.activityLevel]}`}
            />
            {recommendation.activityLevel} Activity
          </span>
          <span className="text-border">·</span>
          <span>{recommendation.lastUpdated}</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] mb-4">
          <span className="text-emerald-400">
            {recommendation.openBeginnerIssues} beginner issues
          </span>
          <span className="text-blue-400">
            {recommendation.openHelpWantedIssues} help wanted
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {recommendation.badges.map((badge) => (
            <Badge
              key={badge}
              variant="outline"
              className={`text-[10px] px-2 py-0.5 ${badgeColorMap[badge] ?? ""}`}
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      <div className="border-t border-border/50 px-5 py-3 bg-muted/30">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Why this project
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
