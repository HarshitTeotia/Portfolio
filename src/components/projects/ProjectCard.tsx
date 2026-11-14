import Link from "@/components/ui/SiteLink";
import { Badge } from "@/components/ui";
import { getTechnology } from "@/content/technologies";
import type { Project } from "@/content/types";

/** Shared comparison hierarchy on Home and the project index. */
export function ProjectCard({
  project,
  index,
  headingLevel = "h2",
}: {
  project: Project;
  index: number;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const titleId = "project-" + project.id;
  return (
    <article
      aria-labelledby={titleId}
      className="group border-border-strong bg-bg-elevated/70 hover:border-accent-500/60 focus-within:border-accent-400 flex h-full min-w-0 flex-col rounded-lg border p-5 transition-colors sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-accent-300 font-mono text-xs tracking-widest uppercase">
          {index < 3 ? "Selected work" : "Additional work"}
        </span>
        <span aria-hidden="true" className="text-text-muted font-mono text-xs">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="text-text-muted mt-5 text-xs leading-relaxed">
        {project.positioning}
      </p>
      <Heading
        id={titleId}
        className="font-display mt-2 text-2xl leading-snug text-balance"
      >
        {project.title}
      </Heading>
      <p className="text-text-secondary mt-3 text-sm leading-relaxed">{project.role}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.technologies.slice(0, 5).map((id) => (
          <Badge key={id}>{getTechnology(id)?.name}</Badge>
        ))}
      </div>
      <dl className="text-text-secondary my-6 space-y-4 text-sm leading-relaxed">
        <div>
          <dt className="text-text-primary mb-1 font-medium">Contribution</dt>
          <dd>{project.highlights[0]}</dd>
        </div>
        <div>
          <dt className="text-text-primary mb-1 font-medium">Engineering challenge</dt>
          <dd>{project.challenges[0]}</dd>
        </div>
      </dl>
      <Link
        href={"/projects/" + project.slug}
        aria-label={"View case study: " + project.title}
        className="text-accent-300 mt-auto inline-flex min-h-11 w-fit items-center gap-2 rounded-sm text-sm font-medium underline-offset-4 hover:underline"
      >
        View case study <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
