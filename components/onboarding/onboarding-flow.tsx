"use client";

import { ProgressBar } from "./progress-bar";
import { StepInterests } from "./step-interests";
import { StepExperience } from "./step-experience";
import { StepGoals } from "./step-goals";
import { StepLanguages } from "./step-languages";
import { Button } from "@/components/ui/button";
import type {
  OnboardingStep,
  Interest,
  ExperienceLevel,
  Goal,
  ProgrammingLanguage,
} from "@/lib/types";

interface OnboardingFlowProps {
  currentStep: OnboardingStep;
  interests: Interest[];
  experienceLevel: ExperienceLevel | null;
  goals: Goal[];
  languages: ProgrammingLanguage[];
  customLanguages: string[];
  onToggleInterest: (interest: Interest) => void;
  onSelectExperience: (level: ExperienceLevel) => void;
  onToggleGoal: (goal: Goal) => void;
  onToggleLanguage: (lang: ProgrammingLanguage) => void;
  onAddCustomLanguage: (lang: string) => void;
  onRemoveCustomLanguage: (lang: string) => void;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
}

const TOTAL_STEPS = 4;

function canProceed(
  step: OnboardingStep,
  interests: Interest[],
  experienceLevel: ExperienceLevel | null,
  goals: Goal[],
  languages: ProgrammingLanguage[],
  customLanguages: string[]
): boolean {
  switch (step) {
    case 1:
      return interests.length > 0;
    case 2:
      return experienceLevel !== null;
    case 3:
      return goals.length > 0;
    case 4:
      return languages.length > 0 || customLanguages.length > 0;
    default:
      return false;
  }
}

export function OnboardingFlow({
  currentStep,
  interests,
  experienceLevel,
  goals,
  languages,
  customLanguages,
  onToggleInterest,
  onSelectExperience,
  onToggleGoal,
  onToggleLanguage,
  onAddCustomLanguage,
  onRemoveCustomLanguage,
  onNext,
  onBack,
  onComplete,
}: OnboardingFlowProps) {
  const isLastStep = currentStep === 4;
  const canGo = canProceed(
    currentStep,
    interests,
    experienceLevel,
    goals,
    languages,
    customLanguages
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      <div className="flex-1 flex items-center w-full">
        {currentStep === 1 && (
          <StepInterests selected={interests} onToggle={onToggleInterest} />
        )}
        {currentStep === 2 && (
          <StepExperience
            selected={experienceLevel}
            onSelect={onSelectExperience}
          />
        )}
        {currentStep === 3 && (
          <StepGoals selected={goals} onToggle={onToggleGoal} />
        )}
        {currentStep === 4 && (
          <StepLanguages
            selected={languages}
            customLanguages={customLanguages}
            onToggle={onToggleLanguage}
            onAddCustom={onAddCustomLanguage}
            onRemoveCustom={onRemoveCustomLanguage}
          />
        )}
      </div>

      <div className="flex items-center gap-3 mt-8">
        {currentStep > 1 && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="cursor-pointer"
          >
            Back
          </Button>
        )}
        <Button
          onClick={isLastStep ? onComplete : onNext}
          disabled={!canGo}
          size="lg"
          className="px-8 cursor-pointer"
        >
          {isLastStep ? "See My Recommendations" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
