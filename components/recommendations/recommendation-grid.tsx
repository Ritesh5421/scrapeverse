"use client";

import { RecommendationCard } from "./recommendation-card";
import type { Recommendation } from "@/lib/types";

interface RecommendationGridProps {
  recommendations: Recommendation[];
}

export function RecommendationGrid({
  recommendations,
}: RecommendationGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((rec) => (
        <RecommendationCard key={rec.id} recommendation={rec} />
      ))}
    </div>
  );
}
