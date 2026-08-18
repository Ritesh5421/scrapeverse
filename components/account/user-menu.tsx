"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

interface UserMenuProps {
  onOpenPreferences: () => void;
}

export function UserMenu({ onOpenPreferences }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-8 pl-1 pr-2.5 rounded-full border border-border hover:border-muted-foreground/50 transition-all cursor-pointer"
      >
        <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-semibold">
          {initials}
        </div>
        <span className="text-xs text-foreground hidden sm:block max-w-[100px] truncate">
          {user.name}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-card shadow-lg z-50 py-1">
          <div className="px-3 py-2 border-b border-border/50">
            <p className="text-xs font-medium text-foreground truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

          <button
            onClick={() => {
              setOpen(false);
              onOpenPreferences();
            }}
            className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          >
            Edit Preferences
          </button>

          {user.preferences && (
            <div className="px-3 py-2 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                Current Setup
              </p>
              <div className="flex flex-wrap gap-1">
                {user.preferences.languages.slice(0, 3).map((l) => (
                  <span
                    key={l}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                  >
                    {l}
                  </span>
                ))}
                {user.preferences.languages.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{user.preferences.languages.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-border/50">
            <button
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full text-left px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
