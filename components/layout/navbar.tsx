"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-primary-foreground"
          aria-hidden
        >
          <path d="M12 2L22 12L12 22L2 12Z" />
        </svg>
      </div>
      <span className="font-semibold text-lg text-foreground tracking-tight">
        ContribHub
      </span>
    </Link>
  );
}

export function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "glass-strong" : "bg-transparent border-b border-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-16">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
              <button
                onClick={() => void signOut()}
                title={`Sign out (${user.name})`}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-px transition-all"
              >
                Get Started
                <span aria-hidden>→</span>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-strong px-6 py-4 flex flex-col gap-4"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    void signOut();
                  }}
                  className="text-sm text-left text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Sign out ({user.name})
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold cursor-pointer"
                >
                  Get Started →
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
