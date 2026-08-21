"use client";

import { motion } from "framer-motion";
import { GithubIcon } from "@/components/common/github-icon";

function OrbitCard({
  className,
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={`absolute glass-card rounded-xl px-3.5 py-2.5 text-xs ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function GithubOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" aria-hidden />

      {/* Orbit rings */}
      <div className="absolute inset-[8%] rounded-full border border-primary/15 animate-spin-slow" aria-hidden>
        <span className="absolute -top-1 left-1/2 size-2 rounded-full bg-primary shadow-[0_0_12px_rgba(255,214,0,0.8)]" />
      </div>
      <div className="absolute inset-[24%] rounded-full border border-border animate-spin-slower" aria-hidden>
        <span className="absolute top-1/2 -right-1 size-1.5 rounded-full bg-muted-foreground" />
      </div>

      {/* Center sphere */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex size-36 items-center justify-center rounded-full bg-gradient-to-br from-card via-background to-card border border-primary/25 glow-yellow animate-glow-pulse">
          <GithubIcon className="size-14 text-foreground" />
        </div>
      </motion.div>

      {/* Orbiting cards */}
      <OrbitCard className="left-[-4%] top-[16%] animate-float-y" delay={0.2}>
        <p className="font-semibold text-foreground">good first issue</p>
        <p className="mt-0.5 text-muted-foreground">Fix parser edge case</p>
      </OrbitCard>

      <OrbitCard className="right-[-2%] top-[38%] animate-float-y-delayed" delay={0.35}>
        <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
          <span className="size-2 rounded-full bg-[#3776AB]" aria-hidden />
          Python
        </span>
        <p className="mt-0.5 text-muted-foreground">24 open issues</p>
      </OrbitCard>

      <OrbitCard className="bottom-[18%] left-[6%] animate-float-y" delay={0.5}>
        <p className="font-semibold text-success">● Active community</p>
        <p className="mt-0.5 text-muted-foreground">640+ contributors</p>
      </OrbitCard>

      <OrbitCard className="bottom-[4%] right-[10%] animate-float-y-delayed" delay={0.65}>
        <p className="font-semibold text-primary">✦ High impact</p>
        <p className="mt-0.5 text-muted-foreground">82K stars</p>
      </OrbitCard>
    </div>
  );
}
