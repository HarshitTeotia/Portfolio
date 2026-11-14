import Link from "@/components/ui/SiteLink";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/content/projects";

export function FeaturedWork() {
  return (
    <section
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20"
      aria-labelledby="featured-title"
    >
      <div id="featured-title">
        <SectionHeading
          kicker="Selected work"
          title="Backend systems. Applied AI. Real workflows."
          description="Three case studies in lending, distribution, and hospitality operations."
        />
      </div>
      <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.slice(0, 3).map((project, index) => (
          <Reveal key={project.id} amount={0.1} delay={index * 0.04} className="h-full">
            <ProjectCard project={project} index={index} headingLevel="h3" />
          </Reveal>
        ))}
      </div>
      <Link
        href="/projects"
        className="text-accent-300 mt-6 inline-flex min-h-11 items-center rounded-sm text-sm"
      >
        Explore all projects, including Viblets →
      </Link>
    </section>
  );
}
