"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

interface HeroProps {
  onGetStarted: () => void;
}

function PreviewCard({
  name,
  org,
  language,
  stars,
  badges,
}: {
  name: string;
  org: string;
  language: string;
  stars: number;
  badges: string[];
}) {
  return (
    <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/50 min-w-55 shrink-0">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[11px] text-muted-foreground">{org}</p>
          <p className="text-sm font-medium text-foreground">{name}</p>
        </div>
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          ★ {stars.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] text-muted-foreground">{language}</span>
        <span className="text-border">·</span>
        <span className="text-[11px] text-muted-foreground">Updated 2h ago</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {badges.map((b) => (
          <Badge key={b} variant="secondary" className="text-[10px]">
            {b}
          </Badge>
        ))}
      </div>
    </Card>
  );
}

const previewCards = [
  {
    name: "rust-analyzer",
    org: "rust-lang",
    language: "Rust",
    stars: 9800,
    badges: ["Beginner Friendly"],
  },
  {
    name: "deno",
    org: "denoland",
    language: "Rust",
    stars: 100300,
    badges: ["High Activity"],
  },
  {
    name: "llama.cpp",
    org: "ggml-org",
    language: "C++",
    stars: 82400,
    badges: ["Great Documentation"],
  },
];

export function Hero({ onGetStarted }: HeroProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]" />

      {user && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {user.name}
          </span>
          <button
            onClick={signOut}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer underline underline-offset-2"
          >
            Sign out
          </button>
        </div>
      )}

      <div className="relative z-10 max-w-3xl mx-auto text-center mb-12 p-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
          Find Open Source Projects{" "}
          <span className="bg-linear-to-r from-muted-foreground to-foreground bg-clip-text text-transparent">
            Worth Contributing To
          </span>
        </h1>

        <Badge variant="outline" className="mb-6 text-xs px-3 py-1">
          Discover · Contribute · Grow
        </Badge>

        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Discover active projects, beginner-friendly issues, and communities
          that match your interests. Get personalized recommendations in under
          30 seconds.
        </p>

        <Button
          size="lg"
          onClick={onGetStarted}
          className="text-base px-8 py-6 font-medium cursor-pointer"
        >
          Find My Projects
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {previewCards.map((card) => (
            <div key={card.name} className="snap-center">
              <PreviewCard {...card} />
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-background to-transparent pointer-events-none" />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-[11px] tracking-widest uppercase">Scroll to explore</span>
        <div className="w-5 h-8 border border-border rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-muted-foreground rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
