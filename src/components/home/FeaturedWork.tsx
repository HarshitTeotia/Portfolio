import Link from "next/link";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { projects } from "@/content/projects";
import { getTechnology } from "@/content/technologies";
import { getProjectPhase } from "@/content/experience";

export function FeaturedWork() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <SectionHeading
          kicker="Case Studies"
          title="What I've built"
          description="Four real projects — the clearest evidence of how I work."
        />
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((project, index) => {
          const projectNumber = String(index + 1).padStart(2, "0");
          const phase = getProjectPhase(project.id);
          return (
            <Reveal key={project.id} delay={index * 0.05}>
              <Link href={`/projects/${project.slug}`} className="group block h-full">
                <Card className="flex h-full flex-col">
                  <Badge
                    tone="accent"
                    className="group-hover:border-accent-400 group-hover:bg-accent-600/20 w-fit"
                  >
                    Project {projectNumber}
                  </Badge>
                  <p className="font-display text-text-primary duration-base ease-standard mt-4 text-xl transition-colors group-hover:text-white">
                    {project.title}
                  </p>
                  <p className="text-accent-300 mt-1 text-sm">{project.positioning}</p>
                  <p className="text-text-secondary mt-3 text-sm">{project.theme}</p>
                  <p className="text-text-muted mt-3 font-mono text-[10px] tracking-[0.15em] uppercase">
                    {phase ? phase.label : "Independent Project"}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((techId) => {
                      const tech = getTechnology(techId);
                      return tech ? <Badge key={techId}>{tech.name}</Badge> : null;
                    })}
                  </div>
                  <span className="text-text-secondary duration-base ease-standard group-hover:text-accent-300 mt-auto flex items-center gap-2 pt-4 text-sm transition-colors">
                    View case study
                    <span
                      aria-hidden="true"
                      className="duration-base ease-standard transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Card>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
