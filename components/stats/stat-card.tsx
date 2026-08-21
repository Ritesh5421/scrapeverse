import { cn } from "@/lib/utils";

export function StatCard({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-card glass-card-hover rounded-2xl p-6 text-center",
        className
      )}
    >
      <p className="text-3xl font-bold tracking-tight text-primary">{value}</p>
      <p className="mt-1.5 text-xs font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
