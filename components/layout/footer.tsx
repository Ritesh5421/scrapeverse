import Link from "next/link";
import { PageContainer } from "./page-container";
import { GithubIcon } from "@/components/common/github-icon";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Discover", href: "/projects" },
      { label: "Trending", href: "/trending" },
      { label: "How it works", href: "/how-it-works" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Get started", href: "/signup" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "GitHub", href: "https://github.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <PageContainer className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5 text-primary-foreground"
                  aria-hidden
                >
                  <path d="M12 2L22 12L12 22L2 12Z" />
                </svg>
              </div>
              <span className="font-semibold text-foreground">ContribHub</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Find open source projects that match your skills and start
              contributing today.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="mt-5 inline-flex text-muted-foreground hover:text-primary transition-colors"
            >
              <GithubIcon className="size-5" />
            </a>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ContribHub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for the open source community.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
