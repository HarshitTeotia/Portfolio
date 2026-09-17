import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { SeasonBlock } from "@/components/episodes/SeasonBlock";
import { seasons } from "@/content/seasons";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Episodes — THE DEVELOPER",
  description:
    "The career timeline, told season by season — from first principles to production systems.",
};

export default function EpisodesPage() {
  // All four project episodes fall within S03 (the real-world / working era).
  const s03ProjectEpisodes = projects;

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeading
        level="h1"
        size="display"
        kicker="Episodes"
        title="The career timeline"
        description="Three seasons, plus the special episodes built along the way."
      />

      <div className="mt-16">
        {seasons.map((season) => (
          <SeasonBlock
            key={season.id}
            season={season}
            projectEpisodes={season.id === "s03" ? s03ProjectEpisodes : []}
          />
        ))}
      </div>
    </div>
  );
}
