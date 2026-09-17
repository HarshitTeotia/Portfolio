import type { Metadata } from "next";
import Link from "next/link";
import { Badge, SectionHeading } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { ArchitectureHint } from "@/components/projects/ArchitectureHint";
import { projects } from "@/content/projects";
import { getTechnology } from "@/content/technologies";
import { getProjectPhase } from "@/content/experience";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Projects — THE DEVELOPER",
  description:
    "Four real projects — agentic automation, hospitality infrastructure, document intelligence, and a multi-tenant ERP.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        level="h1"
        size="display"
        kicker="Index"
        title="Special episodes"
        description="Each one is real, shipped work — not a demo. Open one for the problem, the architecture, and what it took to build."
      />

      <div className="mt-20 flex flex-col">
        {projects.map((project, index) => {
          const reversed = index % 2 === 1;
          const projectNumber = String(index + 1).padStart(2, "0");
          const phase = getProjectPhase(project.id);
          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group border-border relative block border-t py-14 first:border-t-0 first:pt-0"
            >
              {/* Hover panel — a card the row lifts onto, not a permanent box.
                  Sits behind the content and extends slightly past the row's
                  own padding so the accent border/glow reads as one surface. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -inset-x-6 -inset-y-4 -z-10 rounded-lg border border-transparent opacity-0",
                  "duration-base ease-standard transition-[opacity,border-color,box-shadow]",
                  "group-hover:border-accent-500/30 group-hover:opacity-100",
                  "group-hover:shadow-[0_24px_48px_-28px_var(--color-accent-glow)]"
                )}
              />

              {/* Each row choreographs itself as it enters view — number, then
                  domain, title, description, architecture hint, tech, CTA. */}
              <Stagger
                staggerDelay={0.09}
                amount={0.3}
                className={cn(
                  "duration-base ease-standard flex flex-col gap-8 transition-transform group-hover:-translate-y-1 md:flex-row md:items-start md:gap-12",
                  reversed && "md:flex-row-reverse"
                )}
              >
                <StaggerItem className="shrink-0 md:w-40">
                  <span
                    aria-hidden="true"
                    className="font-display text-text-primary/[0.08] duration-base ease-standard group-hover:text-accent-500/15 block text-7xl leading-none transition-colors sm:text-8xl"
                  >
                    {projectNumber}
                  </span>
                  <p className="text-text-muted duration-base ease-standard group-hover:text-accent-400 mt-2 font-mono text-xs tracking-[0.2em] uppercase transition-colors">
                    Project {projectNumber}
                  </p>
                </StaggerItem>

                <div className="min-w-0 flex-1">
                  <StaggerItem>
                    <p className="text-accent-400 font-mono text-xs tracking-[0.2em] uppercase">
                      {project.positioning}
                    </p>
                  </StaggerItem>

                  <StaggerItem>
                    <p className="font-display text-text-primary duration-base ease-standard mt-3 text-4xl transition-[color,transform] group-hover:translate-x-1 group-hover:text-white sm:text-5xl">
                      {project.title}
                    </p>
                  </StaggerItem>

                  <StaggerItem>
                    <p className="text-text-secondary mt-3 max-w-xl">{project.theme}</p>
                  </StaggerItem>

                  <StaggerItem>
                    <ArchitectureHint
                      architecture={project.architecture}
                      className="mt-4 block"
                    />
                  </StaggerItem>

                  <StaggerItem>
                    <p className="text-text-muted mt-4 font-mono text-xs tracking-[0.15em] uppercase">
                      {phase ? phase.label : "Independent Project"}
                    </p>
                    {phase && (
                      <p className="text-text-muted mt-0.5 font-mono text-xs tracking-[0.15em] uppercase">
                        {phase.dateRange}
                      </p>
                    )}
                  </StaggerItem>

                  <StaggerItem className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 5).map((techId) => {
                      const tech = getTechnology(techId);
                      return tech ? (
                        <Badge
                          key={techId}
                          className="group-hover:border-border-strong group-hover:text-text-primary"
                        >
                          {tech.name}
                        </Badge>
                      ) : null;
                    })}
                  </StaggerItem>

                  <StaggerItem>
                    <span className="text-text-secondary duration-base ease-standard group-hover:text-accent-300 relative mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors">
                      View case study
                      <span
                        aria-hidden="true"
                        className="duration-base ease-standard transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                      <span
                        aria-hidden="true"
                        className="bg-accent-400 duration-base ease-standard absolute -bottom-1 left-0 h-px w-0 transition-[width] group-hover:w-full"
                      />
                    </span>
                  </StaggerItem>
                </div>
              </Stagger>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
