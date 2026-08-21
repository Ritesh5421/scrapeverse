import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageContainer } from "@/components/layout/page-container";

const steps = [
  {
    number: "01",
    title: "Tell us your skills",
    description:
      "Pick the languages you know, the topics you care about, and how much time you can give each week.",
  },
  {
    number: "02",
    title: "We scan the ecosystem",
    description:
      "Our engine continuously indexes GitHub repositories, tracking good first issues, maintainer responsiveness, and community health.",
  },
  {
    number: "03",
    title: "Get matched instantly",
    description:
      "Search or browse projects ranked by match score — every result shows stars, activity, and open contribution opportunities.",
  },
  {
    number: "04",
    title: "Make your first contribution",
    description:
      "Jump straight to a curated good first issue and submit your pull request. Your open source journey starts here.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        <PageContainer>
          <header className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              How it works
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              From &ldquo;where do I even start?&rdquo; to merged pull request
              in four steps.
            </p>
          </header>

          <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
            {steps.map((step) => (
              <div
                key={step.number}
                className="glass-card glass-card-hover rounded-2xl p-6"
              >
                <span className="text-sm font-bold text-primary">
                  {step.number}
                </span>
                <h2 className="mt-3 text-base font-semibold text-foreground">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
