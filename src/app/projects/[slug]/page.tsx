import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/content/projects";
import { getTechnology } from "@/content/technologies";
import { getProjectPhase } from "@/content/experience";
import { Badge, Divider, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { ArchitectureView } from "@/components/projects/ArchitectureView";
import { ProjectLinksRow } from "@/components/projects/ProjectLinksRow";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — THE DEVELOPER`,
    description: `${project.positioning}. ${project.theme}`,
  };
}

export default async function ProjectDetailPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const projectIndex = projects.findIndex((p) => p.id === project.id);
  const projectNumber = String(projectIndex + 1).padStart(2, "0");
  const phase = getProjectPhase(project.id);

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <Reveal>
        <Link
          href="/projects"
          className="text-text-secondary hover:text-text-primary text-sm"
        >
          ← All projects
        </Link>
      </Reveal>

      {/* Domain */}
      <Reveal delay={0.05} className="relative mt-10">
        <span
          aria-hidden="true"
          className="font-display text-text-primary/[0.05] pointer-events-none absolute -top-8 right-0 text-9xl leading-none sm:text-[10rem]"
        >
          {projectNumber}
        </span>
        <p className="text-accent-400 font-mono text-xs tracking-[0.3em] uppercase">
          Project {projectNumber}
        </p>
        <p className="text-text-muted mt-3 font-mono text-xs tracking-[0.2em] uppercase">
          {project.episodeTitle}
        </p>
        <h1 className="font-display text-text-primary mt-4 max-w-2xl text-4xl leading-[1.02] font-semibold sm:text-5xl">
          {project.title}
        </h1>
        <p className="text-accent-300 mt-5 text-lg">{project.positioning}</p>
        <p className="text-text-secondary mt-2">{project.role}</p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
          <p className="text-text-muted font-mono text-xs tracking-[0.15em] uppercase">
            {phase ? phase.label : "Independent Project"}
          </p>
          {phase && (
            <p className="text-text-muted font-mono text-xs tracking-[0.15em] uppercase">
              {phase.dateRange}
            </p>
          )}
        </div>
      </Reveal>

      <Divider className="my-14" />

      {/* Problem */}
      <Reveal>
        <SectionHeading kicker="Problem" title="What needed solving" />
        <p className="text-text-secondary mt-4">{project.problem}</p>
      </Reveal>

      {/* System */}
      <Reveal delay={0.05} className="mt-10">
        <SectionHeading kicker="Solution" title="What I built" />
        <p className="text-text-secondary mt-4">{project.solution}</p>
      </Reveal>

      <Reveal className="mt-12">
        <SectionHeading kicker="Architecture" title="How it's put together" />
        <div className="mt-6">
          <ArchitectureView architecture={project.architecture} />
        </div>
      </Reveal>

      <Divider className="my-14" />

      {/* Technology */}
      <Reveal>
        <SectionHeading kicker="Technology" title="What it's built with" />
        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((techId) => {
            const tech = getTechnology(techId);
            return tech ? <Badge key={techId}>{tech.name}</Badge> : null;
          })}
        </div>
      </Reveal>

      <Divider className="my-14" />

      {/* Engineering */}
      <Reveal>
        <SectionHeading kicker="Highlights" title="Engineering worth calling out" />
        <ul className="mt-6 flex flex-col gap-3">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="text-text-secondary flex gap-3">
              <span className="bg-accent-500 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
              {highlight}
            </li>
          ))}
        </ul>
      </Reveal>

      {project.challenges.length > 0 && (
        <Reveal delay={0.05} className="mt-10">
          <SectionHeading kicker="The Hard Part" title="Challenges" />
          <ul className="mt-6 flex flex-col gap-3">
            {project.challenges.map((challenge) => (
              <li key={challenge} className="text-text-secondary">
                {challenge}
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {project.outcome && (
        <Reveal delay={0.1} className="mt-10">
          <SectionHeading kicker="Outcome" title="Where it landed" />
          <p className="text-text-secondary mt-4">{project.outcome}</p>
        </Reveal>
      )}

      <Divider className="my-14" />

      <Reveal>
        <ProjectLinksRow links={project.links} />
      </Reveal>
    </article>
  );
}
