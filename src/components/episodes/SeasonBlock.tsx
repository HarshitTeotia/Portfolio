import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { DrawLine } from "@/components/motion/DrawLine";
import type { Project, Season } from "@/content/types";

interface SeasonBlockProps {
  season: Season;
  projectEpisodes?: Project[];
}

export function SeasonBlock({ season, projectEpisodes = [] }: SeasonBlockProps) {
  return (
    <div className="border-border border-t py-16 first:border-t-0 first:pt-0">
      <div className="grid gap-8 md:grid-cols-[auto_1fr]">
        <Stagger staggerDelay={0.1} amount={0.4}>
          <StaggerItem>
            <p className="text-text-muted font-mono text-xs tracking-[0.2em] uppercase">
              Season
            </p>
            <p className="font-display text-accent-500/70 text-7xl leading-none">
              {season.code}
            </p>
          </StaggerItem>
        </Stagger>

        <div className="relative md:pl-10">
          <DrawLine
            axis="vertical"
            amount={0.3}
            className="absolute top-0 left-0 hidden md:block"
          />

          <Stagger staggerDelay={0.1} delay={0.1} amount={0.3}>
            <StaggerItem>
              <p className="text-text-muted font-mono text-xs tracking-[0.2em] uppercase">
                {season.dateRange}
              </p>
              <h2 className="font-display text-text-primary mt-2 text-3xl sm:text-4xl">
                {season.title}
              </h2>
              <p className="text-accent-300 mt-1 text-sm">
                {season.roleOrDegree} — {season.institutionOrCompany}
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className="text-text-secondary mt-4 max-w-2xl">{season.story}</p>
            </StaggerItem>

            {projectEpisodes.length > 0 && (
              <StaggerItem className="mt-8 grid gap-4 sm:grid-cols-2">
                {projectEpisodes.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="group"
                  >
                    <Card className="h-full">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          tone="accent"
                          className="group-hover:border-accent-400 group-hover:bg-accent-600/20"
                        >
                          {project.episodeLabel}
                        </Badge>
                        {project.role.toLowerCase().includes("freelance") && (
                          <Badge>Freelance</Badge>
                        )}
                      </div>
                      <p className="font-display text-text-primary duration-base ease-standard mt-3 text-lg transition-colors group-hover:text-white">
                        {project.episodeTitle}
                      </p>
                      <p className="text-text-secondary mt-1 text-sm">{project.title}</p>
                    </Card>
                  </Link>
                ))}
              </StaggerItem>
            )}
          </Stagger>
        </div>
      </div>
    </div>
  );
}
