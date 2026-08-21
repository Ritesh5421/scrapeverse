"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultsPage } from "@/components/recommendations/results-page";
import { useAuth } from "@/lib/auth-context";
import { mockRecommendations } from "@/lib/mock-data";
import type { Recommendation, Filters } from "@/lib/types";

export default function Results() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [dataSource, setDataSource] = useState<"live" | "mock">("mock");
  const fetchedRef = useRef(false);

  const hasLanguages = user?.preferences
    ? [...user.preferences.languages, ...user.preferences.customLanguages].length > 0
    : false;

  useEffect(() => {
    if (isLoading || !user) return;
    if (fetchedRef.current) return;
    if (!hasLanguages) return;
    fetchedRef.current = true;

    const allLanguages = [...user.preferences!.languages, ...user.preferences!.customLanguages];

    const params = new URLSearchParams({
      languages: allLanguages.join(","),
      interests: user.preferences!.interests.join(","),
    });
    if (user.preferences!.experienceLevel) {
      params.set("experience", user.preferences!.experienceLevel);
    }

    fetch(`/api/recommendations?${params}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.recommendations?.length > 0) {
          setRecommendations(data.recommendations);
          setDataSource(data.dataSource ?? "mock");
        }
      })
      .catch(() => {});
  }, [user, isLoading, hasLanguages]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  const initialDifficulty: Filters["maxDifficulty"] =
    user?.preferences?.experienceLevel === "Beginner"
      ? "beginner"
      : user?.preferences?.experienceLevel === "Intermediate"
      ? "intermediate"
      : user?.preferences?.experienceLevel === "Advanced"
      ? "advanced"
      : "any";

  return (
    <ResultsPage
      recommendations={recommendations}
      onRestart={() => router.push("/")}
      onOpenPreferences={() => router.push("/preferences")}
      initialDifficulty={initialDifficulty}
      dataSource={dataSource}
    />
  );
}
