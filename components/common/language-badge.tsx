import { cn } from "@/lib/utils";

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3776AB",
  JavaScript: "#F1E05A",
  TypeScript: "#3178C6",
  Rust: "#DEA584",
  Go: "#00ADD8",
  C: "#555555",
  "C++": "#F34B7D",
  Java: "#B07219",
  Kotlin: "#A97BFF",
  Zig: "#EC915C",
  Ruby: "#701516",
  "C#": "#178600",
  Shell: "#89E051",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Lua: "#000080",
};

export function LanguageBadge({
  language,
  className,
}: {
  language: string;
  className?: string;
}) {
  const color = LANGUAGE_COLORS[language] ?? "#A1A1AA";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      <span
        className="size-2.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {language}
    </span>
  );
}
