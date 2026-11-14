import { pageMetadata } from "@/lib/page-metadata";
import { SectionHeading } from "@/components/ui";
import { SeasonBlock } from "@/components/episodes/SeasonBlock";
import { seasons } from "@/content/seasons";
import Link from "@/components/ui/SiteLink";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";

export const metadata = pageMetadata(
  "/episodes/",
  "Career Timeline — Harshit Teotia",
  "BCA (2020–2023), MCA in AI & ML (2023–2025), and Python Developer at Vrozart Group (May 2025–September 2026)."
);

export default function EpisodesPage() {
  // Only confirmed employer-associated projects belong in the employment season.
  const s03ProjectEpisodes = projects.filter((project) =>
    experience.some((entry) => entry.relatedProjectIds.includes(project.id))
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeading
        level="h1"
        size="display"
        kicker="Episodes"
        title="The career timeline"
        description="Three seasons, plus the special episodes built along the way."
      />

      <nav aria-label="Career seasons" className="mt-8 flex flex-wrap gap-3">
        {seasons.map((season) => (
          <a
            key={season.id}
            href={"#" + season.id}
            className="border-border-strong text-accent-300 inline-flex min-h-11 items-center rounded-md border px-4 text-sm"
          >
            {season.code} · {season.title}
          </a>
        ))}
      </nav>
      <div className="mt-12">
        {seasons.map((season) => (
          <SeasonBlock
            key={season.id}
            season={season}
            projectEpisodes={season.id === "s03" ? s03ProjectEpisodes : []}
          />
        ))}
      </div>
      <p className="text-text-secondary mt-10">
        Additional case study:{" "}
        <Link
          className="text-accent-300 inline-flex min-h-11 items-center"
          href="/projects/van-sales-distribution-erp"
        >
          Van Sales &amp; Distribution ERP
        </Link>
        .
      </p>
    </div>
  );
}
