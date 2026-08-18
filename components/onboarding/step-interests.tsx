"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Interest } from "@/lib/types";
import { interestOptions } from "@/lib/mock-data";

interface StepInterestsProps {
  selected: Interest[];
  onToggle: (interest: Interest) => void;
}

export function StepInterests({ selected, onToggle }: StepInterestsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
          What interests you?
        </h2>
        <p className="text-sm text-muted-foreground">
          Select as many as you like. We&apos;ll find projects that match.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5">
        {interestOptions.map((interest) => {
          const isSelected = selected.includes(interest.value);
          return (
            <button
              key={interest.value}
              onClick={() => onToggle(interest.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer",
                "hover:border-muted-foreground/50",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="text-base">{interest.icon}</span>
              {interest.label}
              {isSelected && (
                <Badge
                  variant="secondary"
                  className="ml-0.5 bg-background/20 text-background border-0 text-[10px] px-1.5 py-0"
                >
                  ✓
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-center text-xs text-muted-foreground mt-6">
          {selected.length} {selected.length === 1 ? "interest" : "interests"}{" "}
          selected
        </p>
      )}
    </div>
  );
}
