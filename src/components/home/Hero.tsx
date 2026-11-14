import { Button, Badge } from "@/components/ui";
import { OrbitalField, GridBackdrop } from "@/components/decorative";
import { getSocialLink } from "@/content/social";
import { site } from "@/content/site";
import { WatchTrailerButton } from "./WatchTrailerButton";
import { StatusPill } from "./StatusPill";

export function Hero() {
  const resume = getSocialLink("resume");
  return (
    <section className="border-border relative isolate overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
      >
        <GridBackdrop />
        <OrbitalField
          className="absolute inset-y-0 right-0 hidden h-full w-1/2 opacity-40 md:block"
          align="right"
        />
      </div>
      <div
        aria-hidden="true"
        className="bg-accent-600/10 pointer-events-none absolute top-0 right-0 -z-10 h-72 w-72 rounded-full blur-[90px] sm:h-96 sm:w-96"
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-center lg:gap-16 lg:py-24">
        <div className="min-w-0">
          <p className="text-accent-300 font-mono text-xs tracking-[0.2em] uppercase">
            {site.descriptor} / Engineering portfolio
          </p>
          <p className="font-display mt-5 text-[clamp(2.75rem,6.5vw,6.25rem)] leading-none font-semibold tracking-tight uppercase">
            {site.name}
          </p>
          <h1 className="font-display text-text-primary mt-6 max-w-3xl text-[clamp(1.65rem,3vw,2.5rem)] leading-tight font-medium text-balance">
            {site.headline}
          </h1>
          <p className="text-text-secondary mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
            {site.summary}
          </p>
          <div aria-label="Core technologies" className="mt-6 flex flex-wrap gap-2">
            {["FastAPI", "PostgreSQL", "RAG", "Google ADK"].map((name) => (
              <Badge key={name}>{name}</Badge>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 min-[390px]:flex-row min-[390px]:flex-wrap">
            <Button href="/projects">
              Explore Projects <span aria-hidden="true">→</span>
            </Button>
            {resume?.url && (
              <Button href={resume.url} variant="ghost">
                View Resume
              </Button>
            )}
            <Button href="/contact" variant="ghost">
              Contact Me
            </Button>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <WatchTrailerButton />
            <span className="text-text-muted text-xs">Optional · 19 seconds</span>
          </div>
        </div>
        <StatusPill />
      </div>
    </section>
  );
}
