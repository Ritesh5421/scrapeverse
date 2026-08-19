"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import type { OnboardingPreferences } from "@/lib/types";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; preferences: OnboardingPreferences | null }) => void;
}

type Tab = "sign-in" | "sign-up" | "forgot-password";

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { signUp, signIn } = useAuth();

  if (!open) return null;

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setResetSuccess(false);
  };

  const handleTabSwitch = (newTab: Tab) => {
    reset();
    setTab(newTab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (tab === "sign-up") {
        if (!name.trim()) {
          setError("Name is required");
          return;
        }
        if (!email.trim()) {
          setError("Email is required");
          return;
        }
        if (password.length < 4) {
          setError("Password must be at least 4 characters");
          return;
        }
        const newUser = await signUp(name.trim(), email.trim().toLowerCase(), password);
        if (newUser) {
          onSuccess(newUser);
        }
      } else {
        if (!email.trim()) {
          setError("Email is required");
          return;
        }
        const user = await signIn(email.trim().toLowerCase(), password);
        if (user) {
          onSuccess(user);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!email.trim()) {
        setError("Email is required");
        return;
      }
      if (password.length < 4) {
        setError("New password must be at least 4 characters");
        return;
      }

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setResetSuccess(true);
    } catch {
      setError("Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <Card className="relative z-10 w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg">
            {tab === "sign-in" && "Welcome back"}
            {tab === "sign-up" && "Create your account"}
            {tab === "forgot-password" && "Reset password"}
          </CardTitle>
          <CardDescription className="text-xs">
            {tab === "sign-in" && "Sign in to access your saved preferences"}
            {tab === "sign-up" && "Save your preferences and pick up where you left off"}
            {tab === "forgot-password" && "Enter your email and a new password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tab !== "forgot-password" && (
            <div className="flex border border-border rounded-md mb-4 p-0.5">
              <button
                onClick={() => handleTabSwitch("sign-in")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-[5px] transition-all cursor-pointer ${
                  tab === "sign-in"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleTabSwitch("sign-up")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-[5px] transition-all cursor-pointer ${
                  tab === "sign-up"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {tab === "forgot-password" && !resetSuccess && (
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-8"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-8"
                />
              </div>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>

              <p className="text-center text-[11px] text-muted-foreground mt-4">
                <button
                  onClick={() => handleTabSwitch("sign-in")}
                  className="text-foreground underline underline-offset-2 cursor-pointer"
                >
                  Back to sign in
                </button>
              </p>
            </form>
          )}

          {tab === "forgot-password" && resetSuccess && (
            <div className="text-center space-y-4">
              <p className="text-sm text-emerald-400">
                Password reset successfully
              </p>
              <Button
                onClick={() => handleTabSwitch("sign-in")}
                className="cursor-pointer"
              >
                Sign in with new password
              </Button>
            </div>
          )}

          {tab !== "forgot-password" && (
            <>
              <form onSubmit={handleSubmit} className="space-y-3">
                {tab === "sign-up" && (
                  <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">
                      Name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="h-8"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-8"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-8"
                  />
                </div>

                {tab === "sign-in" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("forgot-password")}
                      className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  {tab === "sign-in" ? "Sign In" : "Create Account"}
                </Button>
              </form>

              <p className="text-center text-[11px] text-muted-foreground mt-4">
                {tab === "sign-in" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      onClick={() => handleTabSwitch("sign-up")}
                      className="text-foreground underline underline-offset-2 cursor-pointer"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => handleTabSwitch("sign-in")}
                      className="text-foreground underline underline-offset-2 cursor-pointer"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-[11px] text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={onClose}
              >
                Continue without account
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
