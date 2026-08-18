"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { ProgrammingLanguage } from "@/lib/types";
import { languageOptions } from "@/lib/mock-data";

interface StepLanguagesProps {
  selected: ProgrammingLanguage[];
  customLanguages: string[];
  onToggle: (lang: ProgrammingLanguage) => void;
  onAddCustom: (lang: string) => void;
  onRemoveCustom: (lang: string) => void;
}

export function StepLanguages({
  selected,
  customLanguages,
  onToggle,
  onAddCustom,
  onRemoveCustom,
}: StepLanguagesProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddCustom = useCallback(() => {
    const trimmed = inputValue.trim();
    if (
      trimmed &&
      !customLanguages.includes(trimmed) &&
      !languageOptions.some((l) => l.value === trimmed)
    ) {
      onAddCustom(trimmed);
      setInputValue("");
    }
  }, [inputValue, customLanguages, onAddCustom]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddCustom();
      }
    },
    [handleAddCustom]
  );

  const allCustom = customLanguages;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
          What languages do you use?
        </h2>
        <p className="text-sm text-muted-foreground">
          Select your preferred languages or add custom ones.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5 mb-6">
        {languageOptions.map((lang) => {
          const isSelected = selected.includes(lang.value);
          return (
            <button
              key={lang.value}
              onClick={() => onToggle(lang.value)}
              className={cn(
                "px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer",
                "hover:border-muted-foreground/50",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {lang.label}
            </button>
          );
        })}

        {allCustom.map((lang) => (
          <button
            key={lang}
            onClick={() => onRemoveCustom(lang)}
            className="px-4 py-2.5 rounded-full border border-foreground bg-card text-foreground text-sm font-medium transition-all duration-200 cursor-pointer hover:bg-destructive/10 hover:border-destructive hover:text-destructive group flex items-center gap-2"
          >
            {lang}
            <span className="text-[10px] text-muted-foreground group-hover:text-destructive">
              ✕
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 max-w-xs mx-auto">
        <Input
          placeholder="Add custom language..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-9"
        />
        <button
          onClick={handleAddCustom}
          disabled={!inputValue.trim()}
          className="h-9 px-4 rounded-md border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          Add
        </button>
      </div>

      {(selected.length > 0 || allCustom.length > 0) && (
        <p className="text-center text-xs text-muted-foreground mt-6">
          {selected.length + allCustom.length}{" "}
          {selected.length + allCustom.length === 1 ? "language" : "languages"}{" "}
          selected
        </p>
      )}
    </div>
  );
}
