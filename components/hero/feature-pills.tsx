const pills = [
  { icon: "◇", label: "Good first issues" },
  { icon: "●", label: "Active maintainers" },
  { icon: "▲", label: "Beginner friendly" },
  { icon: "✦", label: "High impact" },
];

export function FeaturePills() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((pill) => (
        <span
          key={pill.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <span className="text-primary" aria-hidden>
            {pill.icon}
          </span>
          {pill.label}
        </span>
      ))}
    </div>
  );
}
