"use client";

import { cn } from "@/lib/utils";
import type { OnboardingStep } from "@/lib/types";

interface ProgressBarProps {
  currentStep: OnboardingStep;
  totalSteps: number;
}

const stepLabels = [
  "Interests",
  "Experience",
  "Goals",
  "Languages",
  "Time",
];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-10">
      <div className="flex items-center justify-between mb-3">
        {stepLabels.map((label, i) => {
          const step = (i + 1) as OnboardingStep;
          const isActive = step === currentStep;
          const isComplete = step < currentStep;

          return (
            <div
              key={label}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-colors duration-200",
                isActive && "text-foreground",
                isComplete && "text-muted-foreground",
                !isActive && !isComplete && "text-muted-foreground/40"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium border transition-all duration-200",
                  isActive &&
                    "border-foreground bg-foreground text-background",
                  isComplete &&
                    "border-muted-foreground bg-muted-foreground text-background",
                  !isActive &&
                    !isComplete &&
                    "border-border bg-transparent text-muted-foreground/40"
                )}
              >
                {isComplete ? "✓" : step}
              </div>
              <span className="text-[10px] hidden sm:block">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="h-0.5 w-full bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
