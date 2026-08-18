"use client";

import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TimeCommitment } from "@/lib/types";
import { timeOptions } from "@/lib/mock-data";

interface StepTimeProps {
  selected: TimeCommitment | null;
  onSelect: (time: TimeCommitment) => void;
}

export function StepTime({ selected, onSelect }: StepTimeProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
          How much time can you commit?
        </h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ll suggest projects that fit your schedule.
        </p>
      </div>

      <RadioGroup
        value={selected ?? undefined}
        onValueChange={(value) => onSelect(value as TimeCommitment)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {timeOptions.map((option) => {
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
              <RadioGroupItem value={option.value} className="mt-0.5" />
              <div>
                <span className="text-sm font-medium text-foreground">
                  {option.label}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {option.value}
                </p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">
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
