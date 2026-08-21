import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageContainer } from "@/components/layout/page-container";
import { ProjectDetails } from "@/components/projects/project-details";
import { getProject } from "@/lib/services/project-service";

interface Props {
  params: Promise<{ owner: string; repo: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params;
  return { title: `${owner}/${repo} — ContribHub` };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { owner, repo } = await params;
  const project = await getProject(owner, repo);

  if (!project) notFound();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        <PageContainer>
          <ProjectDetails project={project} />
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
