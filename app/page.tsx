"use client";

import { useState, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Hero } from "@/components/landing/hero";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/lib/auth-context";
import type {
  OnboardingStep,
  Interest,
  ExperienceLevel,
  Goal,
  ProgrammingLanguage,
  TimeCommitment,
  OnboardingPreferences,
} from "@/lib/types";

function HomeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restart = searchParams.get("restart") === "true";
  const { user, isLoading, updatePreferences } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(restart);
  const [step, setStep] = useState<OnboardingStep>(1);

  const [interests, setInterests] = useState<Interest[]>([]);
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [customLanguages, setCustomLanguages] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment | null>(
    null
  );

  const toggleItem = useCallback(
    <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, item: T) => {
      setter((prev) =>
        prev.includes(item)
          ? prev.filter((i) => i !== item)
          : [...prev, item]
      );
    },
    []
  );

  const handleToggleInterest = useCallback(
    (interest: Interest) => toggleItem(setInterests, interest),
    [toggleItem]
  );

  const handleToggleGoal = useCallback(
    (goal: Goal) => toggleItem(setGoals, goal),
    [toggleItem]
  );

  const handleToggleLanguage = useCallback(
    (lang: ProgrammingLanguage) => toggleItem(setLanguages, lang),
    [toggleItem]
  );

  const handleAddCustomLanguage = useCallback((lang: string) => {
    setCustomLanguages((prev) => (prev.includes(lang) ? prev : [...prev, lang]));
  }, []);

  const handleRemoveCustomLanguage = useCallback((lang: string) => {
    setCustomLanguages((prev) => prev.filter((l) => l !== lang));
  }, []);

  const currentPrefs: OnboardingPreferences = useMemo(
    () => ({
      interests,
      experienceLevel,
      goals,
      languages,
      customLanguages,
      timeCommitment,
    }),
    [interests, experienceLevel, goals, languages, customLanguages, timeCommitment]
  );

  const handleGetStarted = () => {
    if (user?.preferences) {
      router.push("/results");
      return;
    }
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authUser: { name: string; email: string; preferences: OnboardingPreferences | null }) => {
    setAuthModalOpen(false);
    if (authUser.preferences) {
      router.push("/results");
    } else {
      setShowOnboarding(true);
      setStep(1);
    }
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 5) as OnboardingStep);
  };

  const handleBack = () => {
    setStep((prev) => {
      if (prev <= 1) {
        setShowOnboarding(false);
        return 1;
      }
      return (prev - 1) as OnboardingStep;
    });
  };

  const handleComplete = async () => {
    if (user) {
      await updatePreferences(currentPrefs);
    }
    router.push("/results");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow
        currentStep={step}
        interests={interests}
        experienceLevel={experienceLevel}
        goals={goals}
        languages={languages}
        customLanguages={customLanguages}
        timeCommitment={timeCommitment}
        onToggleInterest={handleToggleInterest}
        onSelectExperience={setExperienceLevel}
        onToggleGoal={handleToggleGoal}
        onToggleLanguage={handleToggleLanguage}
        onAddCustomLanguage={handleAddCustomLanguage}
        onRemoveCustomLanguage={handleRemoveCustomLanguage}
        onSelectTime={setTimeCommitment}
        onNext={handleNext}
        onBack={handleBack}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <>
      <Hero onGetStarted={handleGetStarted} />
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  );
}
