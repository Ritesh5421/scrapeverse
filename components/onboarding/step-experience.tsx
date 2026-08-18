"use client";

import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ExperienceLevel } from "@/lib/types";
import { experienceOptions } from "@/lib/mock-data";

interface StepExperienceProps {
  selected: ExperienceLevel | null;
  onSelect: (level: ExperienceLevel) => void;
}

export function StepExperience({ selected, onSelect }: StepExperienceProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
          What&apos;s your experience level?
        </h2>
        <p className="text-sm text-muted-foreground">
          This helps us recommend the right difficulty of issues.
        </p>
      </div>

      <RadioGroup
        value={selected ?? undefined}
        onValueChange={(value) => onSelect(value as ExperienceLevel)}
        className="grid gap-4"
      >
        {experienceOptions.map((option) => {
          const isSelected = selected === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex items-start gap-4 p-5 rounded-lg border cursor-pointer transition-all duration-200",
                "hover:border-muted-foreground/50",
                isSelected
                  ? "border-foreground bg-card"
                  : "border-border bg-card/50"
              )}
            >
              <RadioGroupItem
                value={option.value}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm font-medium text-foreground">
                    {option.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </div>
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
