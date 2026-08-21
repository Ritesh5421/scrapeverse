import { PageContainer } from "@/components/layout/page-container";

const companies = [
  "Vercel",
  "Meta",
  "Microsoft",
  "Google",
  "Rust Lang",
  "Kubernetes",
];

export function TrustedCompanies() {
  return (
    <section className="border-t border-border/60 py-12">
      <PageContainer>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by contributors at
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companies.map((company) => (
            <span
              key={company}
              className="text-lg font-semibold text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              {company}
            </span>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
