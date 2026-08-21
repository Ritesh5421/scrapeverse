import { PageContainer } from "@/components/layout/page-container";
import { StatCard } from "./stat-card";

const stats = [
  { value: "12K+", label: "Projects indexed" },
  { value: "48K+", label: "Good first issues" },
  { value: "3.2K", label: "Active repositories" },
  { value: "96%", label: "Match accuracy" },
  { value: "180+", label: "Contributors placed weekly" },
];

export function StatsSection() {
  return (
    <section id="stats" className="py-16 lg:py-20">
      <PageContainer>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
