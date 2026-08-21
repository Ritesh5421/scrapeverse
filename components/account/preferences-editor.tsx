"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StepInterests } from "@/components/onboarding/step-interests";
import { StepExperience } from "@/components/onboarding/step-experience";
import { StepGoals } from "@/components/onboarding/step-goals";
import { StepLanguages } from "@/components/onboarding/step-languages";
import { StepTime } from "@/components/onboarding/step-time";
import { useAuth } from "@/lib/auth-context";
import type {
  Interest,
  ExperienceLevel,
  Goal,
  ProgrammingLanguage,
  TimeCommitment,
  OnboardingPreferences,
} from "@/lib/types";

type EditorSection = "overview" | "interests" | "experience" | "goals" | "languages" | "time" | "password";

interface PreferencesEditorProps {
  onClose: () => void;
}

export function PreferencesEditor({ onClose }: PreferencesEditorProps) {
  const { user, updatePreferences } = useAuth();
  const prefs = user?.preferences;

  const [section, setSection] = useState<EditorSection>("overview");

  const [interests, setInterests] = useState<Interest[]>(prefs?.interests ?? []);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(
    prefs?.experienceLevel ?? null
  );
  const [goals, setGoals] = useState<Goal[]>(prefs?.goals ?? []);
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>(
    prefs?.languages ?? []
  );
  const [customLanguages, setCustomLanguages] = useState<string[]>(
    prefs?.customLanguages ?? []
  );
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment | null>(
    prefs?.timeCommitment ?? null
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const newPrefs: OnboardingPreferences = {
        interests,
        experienceLevel,
        goals,
        languages,
        customLanguages,
        timeCommitment,
      };
      await updatePreferences(newPrefs);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaveError("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword) {
      setPasswordError("Both fields are required");
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError("New password must be at least 4 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Failed to change password");
        return;
      }
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch {
      setPasswordError("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const sections: { key: EditorSection; label: string; count?: number }[] = [
    { key: "interests", label: "Interests", count: interests.length },
    { key: "experience", label: "Experience", count: experienceLevel ? 1 : 0 },
    { key: "goals", label: "Goals", count: goals.length },
    { key: "languages", label: "Languages", count: languages.length + customLanguages.length },
    { key: "time", label: "Time Commitment", count: timeCommitment ? 1 : 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Edit Preferences
            </h1>
            <p className="text-xs text-muted-foreground">
              Update your profile to refine recommendations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="cursor-pointer text-xs"
            >
              Back to Results
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {section === "overview" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-6">
              Click any section below to edit your preferences. Changes are saved
              to your account.
            </p>

            <div className="grid gap-3">
              {sections.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSection(s.key)}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-muted-foreground/50 transition-all cursor-pointer text-left"
                >
                  <span className="text-sm font-medium text-foreground">
                    {s.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {s.count !== undefined && s.count > 0 && (
                      <Badge variant="secondary" className="text-[10px]">
                        {s.count}
                      </Badge>
                    )}
                    <span className="text-muted-foreground text-xs">→</span>
                  </div>
                </button>
              ))}

              <button
                onClick={() => setSection("password")}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-muted-foreground/50 transition-all cursor-pointer text-left"
              >
                <span className="text-sm font-medium text-foreground">
                  Change Password
                </span>
                <span className="text-muted-foreground text-xs">→</span>
              </button>
            </div>

            <div className="flex justify-end pt-4">
              {saveError && (
                <p className="text-xs text-red-400 mr-auto">{saveError}</p>
              )}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="cursor-pointer px-6"
              >
                {saving ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
              </Button>
            </div>
          </div>
        )}

        {section === "interests" && (
          <div>
            <button
              onClick={() => setSection("overview")}
              className="text-xs text-muted-foreground hover:text-foreground mb-6 cursor-pointer flex items-center gap-1"
            >
              ← Back
            </button>
            <StepInterests
              selected={interests}
              onToggle={(i) => toggleItem(setInterests, i)}
            />
            <div className="flex justify-center gap-3 mt-8">
              <Button
                variant="ghost"
                onClick={() => setSection("overview")}
                className="cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        )}

        {section === "experience" && (
          <div>
            <button
              onClick={() => setSection("overview")}
              className="text-xs text-muted-foreground hover:text-foreground mb-6 cursor-pointer flex items-center gap-1"
            >
              ← Back
            </button>
            <StepExperience
              selected={experienceLevel}
              onSelect={setExperienceLevel}
            />
            <div className="flex justify-center gap-3 mt-8">
              <Button
                variant="ghost"
                onClick={() => setSection("overview")}
                className="cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        )}

        {section === "goals" && (
          <div>
            <button
              onClick={() => setSection("overview")}
              className="text-xs text-muted-foreground hover:text-foreground mb-6 cursor-pointer flex items-center gap-1"
            >
              ← Back
            </button>
            <StepGoals
              selected={goals}
              onToggle={(g) => toggleItem(setGoals, g)}
            />
            <div className="flex justify-center gap-3 mt-8">
              <Button
                variant="ghost"
                onClick={() => setSection("overview")}
                className="cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        )}

        {section === "languages" && (
          <div>
            <button
              onClick={() => setSection("overview")}
              className="text-xs text-muted-foreground hover:text-foreground mb-6 cursor-pointer flex items-center gap-1"
            >
              ← Back
            </button>
            <StepLanguages
              selected={languages}
              customLanguages={customLanguages}
              onToggle={(l) => toggleItem(setLanguages, l)}
              onAddCustom={(l) =>
                setCustomLanguages((prev) =>
                  prev.includes(l) ? prev : [...prev, l]
                )
              }
              onRemoveCustom={(l) =>
                setCustomLanguages((prev) => prev.filter((c) => c !== l))
              }
            />
            <div className="flex justify-center gap-3 mt-8">
              <Button
                variant="ghost"
                onClick={() => setSection("overview")}
                className="cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        )}

        {section === "time" && (
          <div>
            <button
              onClick={() => setSection("overview")}
              className="text-xs text-muted-foreground hover:text-foreground mb-6 cursor-pointer flex items-center gap-1"
            >
              ← Back
            </button>
            <StepTime
              selected={timeCommitment}
              onSelect={setTimeCommitment}
            />
            <div className="flex justify-center gap-3 mt-8">
              <Button
                variant="ghost"
                onClick={() => setSection("overview")}
                className="cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        )}

        {section === "password" && (
          <div>
            <button
              onClick={() => setSection("overview")}
              className="text-xs text-muted-foreground hover:text-foreground mb-6 cursor-pointer flex items-center gap-1"
            >
              ← Back
            </button>
            <h2 className="text-sm font-semibold text-foreground mb-6">
              Change Password
            </h2>
            <div className="space-y-4 max-w-sm">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-input/20 px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-input/20 px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-input/20 px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>

              {passwordError && (
                <p className="text-xs text-red-400">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-xs text-emerald-400">Password changed successfully</p>
              )}

              <Button
                onClick={handlePasswordChange}
                disabled={changingPassword}
                className="cursor-pointer"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
