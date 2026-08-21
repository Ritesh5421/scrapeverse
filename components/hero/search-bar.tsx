"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar({ size = "lg" }: { size?: "lg" | "md" }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/projects?q=${encodeURIComponent(q)}` : "/projects");
  };

  return (
    <form
      onSubmit={submit}
      className={`flex w-full items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-[0_8px_40px_rgba(0,0,0,0.5)] focus-within:border-primary/50 transition-colors ${
        size === "lg" ? "max-w-xl" : "max-w-md"
      }`}
    >
      <Search className="ml-2 size-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by language, topic, or project…"
        aria-label="Search projects"
        className="h-10 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
      <button
        type="submit"
        className="inline-flex h-10 shrink-0 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
      >
        Find Projects
      </button>
    </form>
  );
}
