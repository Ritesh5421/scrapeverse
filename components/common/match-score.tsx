import { cn } from "@/lib/utils";

export function MatchScore({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary",
        className
      )}
    >
      {score}% Match
    </span>
  );
}
