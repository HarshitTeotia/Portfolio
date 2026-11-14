import type { Metadata } from "next";
import Link from "@/components/ui/SiteLink";
import { pageMetadata } from "@/lib/page-metadata";
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
  return pageMetadata(
    `/projects/${project.slug}/`,
    `${project.title} — Harshit Teotia`,
    `${project.positioning}. ${project.theme}`
  );
}

export default async function ProjectDetailPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const projectIndex = projects.findIndex((p) => p.id === project.id);
  const projectNumber = String(projectIndex + 1).padStart(2, "0");
  const phase = getProjectPhase(project.id);
  const previous = projects[projectIndex - 1];
  const next = projects[projectIndex + 1];

  return (
    <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-20">
      <Reveal>
        <Link
          href="/projects"
          className="text-text-secondary hover:text-text-primary inline-flex min-h-11 items-center text-sm"
        >
          ← All projects
        </Link>
      </Reveal>

      {/* Domain */}
      <Reveal delay={0.05} className="relative mt-10">
        <p className="text-accent-400 font-mono text-xs tracking-[0.3em] uppercase">
          Project {projectNumber}
        </p>
        <p className="text-text-muted mt-3 font-mono text-xs tracking-[0.2em] uppercase">
          {project.episodeTitle}
        </p>
        <h1 className="font-display text-text-primary mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.12] font-semibold text-balance">
          {project.title}
        </h1>
        <p className="text-accent-300 mt-5 text-lg">{project.positioning}</p>
        <p className="text-text-secondary mt-2">{project.role}</p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
          <p className="text-text-muted font-mono text-xs tracking-[0.15em] uppercase">
            {phase ? phase.label : "Backend Developer"}
          </p>
          {phase && (
            <p className="text-text-muted font-mono text-xs tracking-[0.15em] uppercase">
              {phase.dateRange}
            </p>
          )}
        </div>
      </Reveal>

      <nav
        aria-label="Case study sections"
        className="border-border mt-8 flex flex-wrap gap-x-5 gap-y-2 border-y py-3"
      >
        <a
          href="#problem"
          className="text-accent-300 inline-flex min-h-11 items-center text-sm"
        >
          Problem
        </a>
        <a
          href="#architecture"
          className="text-accent-300 inline-flex min-h-11 items-center text-sm"
        >
          Architecture
        </a>
        <a
          href="#contributions"
          className="text-accent-300 inline-flex min-h-11 items-center text-sm"
        >
          Contributions
        </a>
        {project.investigation && (
          <a
            href="#investigation"
            className="text-accent-300 inline-flex min-h-11 items-center text-sm"
          >
            LLM investigation
          </a>
        )}
      </nav>
      <Divider className="my-10" />

      {/* Problem */}
      <section id="problem" className="scroll-mt-24">
        <Reveal>
          <SectionHeading kicker="Problem" title="What needed solving" />
          <p className="text-text-secondary mt-4">{project.problem}</p>
        </Reveal>
      </section>
      {/* System */}
      <Reveal delay={0.05} className="mt-10">
        <SectionHeading kicker="My Role" title="My contribution in context" />
        <p className="text-text-secondary mt-4">{project.solution}</p>
      </Reveal>

      <section id="architecture" className="scroll-mt-24">
        <Reveal className="mt-12">
          <SectionHeading kicker="Architecture" title="How it's put together" />
          <div className="mt-6">
            <ArchitectureView architecture={project.architecture} />
          </div>
        </Reveal>

        <Divider className="my-14" />
      </section>
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
      <section id="contributions" className="scroll-mt-24">
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
      </section>
      {project.challenges.length > 0 && (
        <Reveal delay={0.05} className="mt-10">
          <SectionHeading
            kicker="Engineering Considerations"
            title="Challenges and lessons"
          />
          <ul className="mt-6 flex flex-col gap-3">
            {project.challenges.map((challenge) => (
              <li key={challenge} className="text-text-secondary">
                {challenge}
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {project.investigation && (
        <section
          id="investigation"
          className="border-accent-500/40 bg-accent-600/5 mt-10 scroll-mt-24 rounded-lg border p-5 sm:p-8"
        >
          <Reveal>
            <SectionHeading
              kicker="LLM Reliability"
              title={project.investigation.title}
            />
            <ul className="text-text-secondary mt-6 flex flex-col gap-3">
              {project.investigation.findings.map((finding) => (
                <li key={finding}>{finding}</li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}
      {project.lessons && (
        <Reveal className="mt-10">
          <SectionHeading kicker="Lessons" title="Engineering takeaways" />
          <ul className="text-text-secondary mt-4 flex flex-col gap-3">
            {project.lessons.map((lesson) => (
              <li key={lesson}>{lesson}</li>
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
      <nav
        aria-label="Project navigation"
        className="border-border mt-12 grid gap-4 border-t pt-6 sm:grid-cols-2"
      >
        {previous ? (
          <Link
            href={"/projects/" + previous.slug}
            className="border-border-strong hover:border-accent-400 rounded-md border p-5 text-sm"
          >
            <span className="text-accent-300 mb-2 block">← Previous case study</span>
            {previous.title}
          </Link>
        ) : (
          <Link
            href="/projects"
            className="text-accent-300 inline-flex min-h-11 items-center text-sm"
          >
            ← All case studies
          </Link>
        )}
        {next && (
          <Link
            href={"/projects/" + next.slug}
            className="border-border-strong hover:border-accent-400 rounded-md border p-5 text-sm"
          >
            <span className="text-accent-300 mb-2 block">Next case study →</span>
            {next.title}
          </Link>
        )}
      </nav>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <p className="text-text-secondary text-sm">
          Discuss a similar engineering problem?
        </p>
        <Link
          href="/contact"
          className="text-accent-300 inline-flex min-h-11 items-center text-sm"
        >
          Get in touch →
        </Link>
      </div>
    </article>
  );
}
