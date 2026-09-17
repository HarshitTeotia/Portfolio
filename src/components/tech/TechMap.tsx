"use client";

import Link from "next/link";
import { useState } from "react";
import { technologies } from "@/content/technologies";
import { categoryLabels, categoryOrder } from "@/content/categories";
import { projects } from "@/content/projects";
import { DrawLine } from "@/components/motion/DrawLine";
import { cn } from "@/lib/cn";

/**
 * An engineering capability map, not a tag cloud — technologies grouped by
 * concern (backend / database / AI / security / infrastructure / quality),
 * each group introduced by a thin drawn line rather than a bigger pill.
 * Hover or focus a technology and the projects that actually use it light up
 * in the side panel — the relationship is the point, not the badge.
 */
export function TechMap() {
  const [active, setActive] = useState<{ type: "tech" | "project"; id: string } | null>(
    null
  );

  const activeTechIds = new Set<string>();
  const activeProjectIds = new Set<string>();

  if (active?.type === "tech") {
    activeTechIds.add(active.id);
    const tech = technologies.find((t) => t.id === active.id);
    tech?.usedIn.forEach((id) => activeProjectIds.add(id));
  } else if (active?.type === "project") {
    activeProjectIds.add(active.id);
    const project = projects.find((p) => p.id === active.id);
    project?.technologies.forEach((id) => activeTechIds.add(id));
  }

  return (
    <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-10">
        {categoryOrder.map((category) => {
          const items = technologies.filter((tech) => tech.category === category);
          if (items.length === 0) return null;
          return (
            <div key={category}>
              <div className="flex items-center gap-4">
                <h2 className="text-accent-400 shrink-0 font-mono text-xs tracking-[0.2em] uppercase">
                  {categoryLabels[category]}
                </h2>
                <DrawLine amount={0.6} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((tech) => {
                  const isDimmed = active !== null && !activeTechIds.has(tech.id);
                  const isActive = activeTechIds.has(tech.id);
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onMouseEnter={() => setActive({ type: "tech", id: tech.id })}
                      onFocus={() => setActive({ type: "tech", id: tech.id })}
                      onMouseLeave={() => setActive(null)}
                      onBlur={() => setActive(null)}
                      className={cn(
                        "duration-base ease-standard inline-flex items-center rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-wide uppercase transition-[opacity,color,border-color,background-color]",
                        isActive
                          ? "border-accent-400 bg-accent-600/15 text-accent-200"
                          : "border-border-strong text-text-secondary hover:border-accent-500/50 hover:text-text-primary",
                        isDimmed && "opacity-30"
                      )}
                    >
                      {tech.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-border-strong h-fit border p-6 lg:sticky lg:top-24">
        <p className="text-text-muted font-mono text-xs tracking-[0.2em] uppercase">
          Projects
        </p>
        <div className="mt-4 flex flex-col gap-1">
          {projects.map((project) => {
            const isDimmed = active !== null && !activeProjectIds.has(project.id);
            const isActive = activeProjectIds.has(project.id);
            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                onMouseEnter={() => setActive({ type: "project", id: project.id })}
                onFocus={() => setActive({ type: "project", id: project.id })}
                onMouseLeave={() => setActive(null)}
                onBlur={() => setActive(null)}
                className={cn(
                  "duration-base ease-standard border-border border-b py-3 text-sm transition-[opacity,color] last:border-b-0",
                  isDimmed && "opacity-30",
                  isActive ? "text-accent-300" : "text-text-secondary"
                )}
              >
                {project.title}
              </Link>
            );
          })}
        </div>
        <p className="text-text-muted mt-4 border-t border-dashed pt-4 text-xs">
          Hover or focus a technology to trace which projects use it.
        </p>
      </div>
    </div>
  );
}
