import { Reveal } from "@/components/motion/Reveal";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Button } from "@/components/ui";
import { OrbitalField, GridBackdrop } from "@/components/decorative";
import { site } from "@/content/site";
import { WatchTrailerButton } from "./WatchTrailerButton";
import { StatusPill } from "./StatusPill";

export function Hero() {
  // "Harshit Teotia" → the dominant title, stored naturally cased — the
  // uppercase treatment lives in the display classes below, not the data.
  const [titleLine1, ...rest] = site.name.split(" ");
  const titleLine2 = rest.join(" ");

  return (
    <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden">
      {/* Full-viewport background layer — a direct child of the unconstrained
          section, not the max-w content wrapper below, so it spans the whole
          width at any viewport size instead of stopping at the reading
          column's edge (see the background-blending fix notes). */}
      <Parallax range={14} className="pointer-events-none absolute inset-0 -z-20">
        <div aria-hidden="true" className="absolute inset-0">
          <GridBackdrop />
          <OrbitalField
            className="absolute inset-0 h-full w-full opacity-40"
            align="right"
          />
        </div>
      </Parallax>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-accent-600/10 animate-glow-drift absolute top-1/3 right-0 h-[520px] w-[720px] translate-x-1/3 -translate-y-1/2 rounded-full blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-28">
        {/* Page-load sequence: metadata ~100ms, name ~250ms, title ~400ms,
            role metadata ~600ms, CTA ~750ms — see the motion-pass brief. */}
        <Reveal delay={0.1}>
          <p className="text-accent-400 font-mono text-xs tracking-[0.35em] uppercase">
            {site.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={0.25} className="mt-4">
          <p className="text-text-secondary block font-mono text-sm tracking-[0.2em] uppercase sm:text-base">
            {site.descriptor}
          </p>
        </Reveal>

        <h1 className="mt-1">
          <ClipReveal delay={0.4}>
            <span className="font-display text-text-primary block text-7xl leading-[0.95] font-semibold tracking-tight uppercase">
              {titleLine1}
            </span>
          </ClipReveal>
          <ClipReveal delay={0.48}>
            <span className="font-display text-text-primary block text-7xl leading-[0.95] font-semibold tracking-tight uppercase">
              {titleLine2}
            </span>
          </ClipReveal>
        </h1>

        <div className="mt-12 grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal delay={0.6}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                {site.identityRoles.map((tag, index) => (
                  <span key={tag} className="flex items-center gap-3">
                    <span className="text-text-muted font-mono text-sm uppercase">
                      {tag}
                    </span>
                    {index < site.identityRoles.length - 1 && (
                      <span className="text-border-strong" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>

              <p className="text-text-secondary mt-5 max-w-xl text-lg">{site.tagline}</p>
            </Reveal>

            <Reveal delay={0.75} className="mt-8 flex flex-wrap gap-4">
              <WatchTrailerButton />
              <Button href="/projects" variant="ghost">
                Explore Work
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.75} className="lg:col-span-4 lg:col-start-9">
            <StatusPill />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
