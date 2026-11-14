"use client";

import Link from "@/components/ui/SiteLink";
import { useState } from "react";
import { technologies } from "@/content/technologies";
import { categoryLabels, categoryOrder } from "@/content/categories";
import { projects } from "@/content/projects";
import { cn } from "@/lib/cn";

export function TechMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const active = preview ?? selected;
  const technology = technologies.find((tech) => tech.id === active);
  const related = technology
    ? projects.filter((project) => technology.usedIn.includes(project.id))
    : projects;
  const chosen = technologies.find((tech) => tech.id === selected);

  return (
    <section
      className="mt-10"
      aria-label="Technology explorer"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setSelected(null);
          setPreview(null);
        }
      }}
    >
      <div className="border-border-strong mb-8 flex min-h-16 flex-wrap items-center justify-between gap-3 border-y py-3">
        <p role="status" className="text-text-secondary text-sm">
          {chosen
            ? chosen.name + " · " + chosen.usedIn.length + " related projects"
            : "Select a technology to explore its project connections."}
        </p>
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            setPreview(null);
          }}
          disabled={!selected && !preview}
          className="text-accent-300 disabled:text-text-muted min-h-11 rounded-md px-3 text-sm"
        >
          Reset selection
        </button>
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-8">
          {categoryOrder.map((category) => {
            const items = technologies.filter((tech) => tech.category === category);
            if (!items.length) return null;
            return (
              <div key={category}>
                <h2 className="text-accent-300 text-sm font-medium">
                  {categoryLabels[category]}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {items.map((tech) => (
                    <button
                      key={tech.id}
                      type="button"
                      aria-pressed={selected === tech.id}
                      aria-controls="tech-projects"
                      onClick={() => {
                        setSelected(selected === tech.id ? null : tech.id);
                        setPreview(null);
                      }}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") setPreview(tech.id);
                      }}
                      onPointerLeave={() => setPreview(null)}
                      onFocus={() => setPreview(tech.id)}
                      onBlur={() => setPreview(null)}
                      className={cn(
                        "min-h-11 max-w-full rounded-md border px-3 py-2 text-left text-sm transition-colors",
                        active === tech.id
                          ? "border-accent-400 bg-accent-600/15 text-accent-100"
                          : "border-border-strong text-text-secondary hover:border-accent-400 hover:text-text-primary"
                      )}
                    >
                      {tech.name}
                      {selected === tech.id && (
                        <span aria-hidden="true" className="ml-2">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <aside
          id="tech-projects"
          aria-label="Related projects"
          className="border-border-strong bg-bg-elevated rounded-lg border p-5 lg:sticky lg:top-24"
        >
          <h2 className="text-accent-300 font-mono text-xs tracking-widest uppercase">
            {technology ? technology.name + " / Projects" : "Project connections"}
          </h2>
          <ul className="divide-border mt-3 divide-y">
            {related.map((project) => (
              <li key={project.id}>
                <Link
                  href={"/projects/" + project.slug}
                  className="text-text-primary hover:text-accent-300 block rounded-sm py-4 text-sm leading-relaxed"
                >
                  {project.title}
                  <span aria-hidden="true" className="text-accent-300 ml-2">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-text-muted mt-4 text-xs leading-relaxed">
            Tap, click, or use Enter to keep a selection. Select it again or press Escape
            to clear. Hover and keyboard focus preview a connection.
          </p>
        </aside>
      </div>
    </section>
  );
}
