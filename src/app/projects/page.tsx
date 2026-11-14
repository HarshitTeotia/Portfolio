import { pageMetadata } from "@/lib/page-metadata";
import { SectionHeading } from "@/components/ui";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/content/projects";

export const metadata = pageMetadata(
  "/projects/",
  "Projects — Harshit Teotia",
  "Backend and applied AI case studies: MSME lending and document intelligence, multi-tenant distribution ERP, hospitality operations, and agentic marketing automation."
);

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <SectionHeading
        level="h1"
        size="display"
        kicker="Case studies"
        title="Backend & Applied AI Projects"
        description="The problem, my contribution, and the engineering decisions behind each system. Start with lending, distribution ERP, and hospitality operations."
      />
      <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}
