import type { Metadata } from "next";
import Link from "next/link";
import { Badge, SectionHeading } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Experience — THE DEVELOPER",
  description:
    "Python Developer at Vrozart Group — backend APIs, AI/agent workflows, and real production debugging.",
};

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <SectionHeading
        level="h1"
        size="display"
        kicker="Experience"
        title="Where the real-world work happens"
      />

      <div className="mt-14 flex flex-col gap-14">
        {experience.map((entry) => {
          const relatedProjects = projects.filter((project) =>
            entry.relatedProjectIds.includes(project.id)
          );

          return (
            // The border-l is this entry's timeline rail — muted at rest,
            // steps toward the accent on hover so "this is the active
            // chapter" reads as a single, deliberate response.
            <div
              key={entry.id}
              className="group border-border duration-base ease-standard hover:border-accent-500/60 relative border-l-2 py-1 pl-6 transition-[transform,border-color] hover:-translate-y-0.5"
            >
              {/* Date → company → role → description, in that order — the
                  brief's "subtle vertical progression" for this section. */}
              <Stagger staggerDelay={0.1}>
                <StaggerItem>
                  <p className="text-text-muted font-mono text-xs tracking-wide uppercase">
                    {entry.dateRange}
                  </p>
                </StaggerItem>
                <StaggerItem>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-text-primary duration-base ease-standard text-2xl transition-[text-shadow] group-hover:[text-shadow:0_0_24px_var(--color-accent-glow)] sm:text-3xl">
                      {entry.role}
                    </h2>
                    {entry.current && (
                      <Badge
                        tone="accent"
                        className="group-hover:border-accent-400 group-hover:bg-accent-600/20"
                      >
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-accent-300 mt-1">{entry.company}</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-text-secondary mt-5 max-w-2xl">{entry.summary}</p>
                </StaggerItem>

                <StaggerItem>
                  <ul className="mt-6 flex flex-col gap-2">
                    {entry.responsibilities.map((item) => (
                      <li key={item} className="text-text-secondary flex gap-3">
                        <span className="bg-accent-500 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </StaggerItem>

                {relatedProjects.length > 0 && (
                  <StaggerItem className="mt-8">
                    <p className="text-text-muted font-mono text-xs tracking-[0.2em] uppercase">
                      Built during this role
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {relatedProjects.map((project) => (
                        <Link key={project.id} href={`/projects/${project.slug}`}>
                          <Badge className="group-hover:border-border-strong group-hover:text-text-primary">
                            {project.title}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </StaggerItem>
                )}
              </Stagger>
            </div>
          );
        })}
      </div>
    </div>
  );
}
