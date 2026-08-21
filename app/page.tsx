import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/hero/hero-section";
import { StatsSection } from "@/components/stats/stats-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
      </main>
    </div>
  );
}
