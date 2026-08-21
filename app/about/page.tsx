import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageContainer } from "@/components/layout/page-container";

const values = [
  {
    title: "Open source first",
    description:
      "Everything we build serves people contributing to open source. The ecosystem thrives when newcomers find their way in.",
  },
  {
    title: "Data-driven matching",
    description:
      "Recommendations come from real repository signals: issue labels, maintainer response times, community activity, and project health.",
  },
  {
    title: "Beginner friendly by design",
    description:
      "Good first issues are front and center. We surface projects where maintainers genuinely welcome newcomers.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        <PageContainer>
          <header className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              About ContribHub
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              We help developers find open source projects that match their
              skills — so great code gets written, and great contributors get
              made.
            </p>
          </header>

          <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="glass-card glass-card-hover rounded-2xl p-6"
              >
                <span className="text-primary" aria-hidden>
                  ◇
                </span>
                <h2 className="mt-3 text-base font-semibold text-foreground">
                  {value.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-4xl glass-card rounded-2xl p-8 lg:p-10">
            <h2 className="text-xl font-semibold text-foreground">
              Our mission
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Millions of developers want to contribute to open source but
              don&apos;t know where to start. Meanwhile, maintainers of vital
              projects are starving for help. ContribHub bridges that gap: we
              index the open source ecosystem, understand what each project
              needs, and match it against what each contributor offers. The
              result is fewer abandoned issues, healthier repositories, and
              more first-time contributors who come back for more.
            </p>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
