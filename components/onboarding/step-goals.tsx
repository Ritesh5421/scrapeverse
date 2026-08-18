"use client";

import { cn } from "@/lib/utils";
import type { Goal } from "@/lib/types";
import { goalOptions } from "@/lib/mock-data";

interface StepGoalsProps {
  selected: Goal[];
  onToggle: (goal: Goal) => void;
}

export function StepGoals({ selected, onToggle }: StepGoalsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
          What are your goals?
        </h2>
        <p className="text-sm text-muted-foreground">
          Select what you want to achieve. Pick as many as apply.
        </p>
      </div>

      <div className="grid gap-3">
        {goalOptions.map((goal) => {
          const isSelected = selected.includes(goal.value);
          return (
            <button
              key={goal.value}
              onClick={() => onToggle(goal.value)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border text-left transition-all duration-200 cursor-pointer",
                "hover:border-muted-foreground/50",
                isSelected
                  ? "border-foreground bg-card"
                  : "border-border bg-card/50"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-200",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-transparent"
                )}
              >
                {isSelected && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-background"
                  >
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">
                  {goal.label}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {goal.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-center text-xs text-muted-foreground mt-6">
          {selected.length} {selected.length === 1 ? "goal" : "goals"} selected
        </p>
      )}
    </div>
  );
}
