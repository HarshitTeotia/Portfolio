import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Variants } from "framer-motion";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { CornerBrackets } from "@/components/decorative";
import { duration, ease } from "@/lib/motion/tokens";
import { about } from "@/content/about";
import { education } from "@/content/education";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/**
 * About is the site's human counterpoint to the systems/technical pages —
 * the brief asks for the motion to slow down here. A gentler scale-in for
 * the photo (0.98→1, cinematic duration) instead of the site's usual
 * fadeUp/slide.
 */
const photoReveal: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.cinematic, ease: ease.emphasis },
  },
};

export const metadata: Metadata = {
  title: "About — THE DEVELOPER",
  description:
    "Harshit Teotia — backend-focused developer building APIs, AI-powered systems, and data-driven products.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeading level="h1" size="display" kicker="About" title={site.name} />

      <Reveal delay={0.5} className="mt-6 max-w-2xl">
        <p className="font-display text-text-primary text-2xl leading-snug sm:text-3xl">
          {about.heroStatement}
        </p>
        <p className="text-text-secondary mt-4 text-lg leading-relaxed">
          {about.summary}
        </p>
      </Reveal>

      <div className="mt-16 grid gap-12 sm:grid-cols-[220px_1fr]">
        <Reveal variants={photoReveal}>
          {about.photoSrc ? (
            <div className="group relative overflow-hidden">
              <CornerBrackets className="scale-105" />
              <Image
                src={about.photoSrc}
                alt={about.photoAlt}
                width={220}
                height={220}
                className="border-border duration-cinematic ease-standard object-cover transition-transform group-hover:scale-[1.02]"
              />
            </div>
          ) : (
            <div className="group relative">
              <CornerBrackets className="scale-105" />
              <div
                className="border-border-strong bg-bg-elevated duration-base ease-standard group-hover:border-accent-500/40 flex aspect-square w-full max-w-[220px] items-center justify-center border border-dashed transition-colors"
                role="img"
                aria-label="Photo placeholder"
              >
                <span className="text-text-muted font-mono text-xs">Photo</span>
              </div>
            </div>
          )}
        </Reveal>

        <div>
          <h2 className="text-accent-400 font-mono text-xs tracking-[0.2em] uppercase">
            What I Build
          </h2>
          <Stagger staggerDelay={0.1} delay={0.1} className="mt-4 flex flex-col">
            {about.whatIBuild.map((item) => (
              <StaggerItem key={item.title}>
                <div className="group border-border hover:border-accent-500/50 hover:bg-bg-elevated/60 duration-base ease-standard relative border-l-2 py-3 pl-4 transition-[border-color,background-color,transform] hover:-translate-y-0.5">
                  <p className="text-text-primary font-medium">{item.title}</p>
                  <p className="text-text-secondary mt-1 text-sm">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      <Reveal delay={0.1} className="mt-20">
        <h2 className="text-accent-400 font-mono text-xs tracking-[0.2em] uppercase">
          How I Work
        </h2>
        <Stagger
          staggerDelay={0.08}
          delay={0.1}
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          {about.howIWork.map((step, index) => (
            <StaggerItem key={step.title}>
              <div className="group border-border-strong hover:border-accent-500/50 hover:bg-bg-elevated/40 duration-base ease-standard flex h-full gap-4 border p-5 transition-[border-color,background-color,transform] hover:-translate-y-0.5">
                <span className="text-accent-400 font-mono text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-text-primary">{step.title}</p>
                  <p className="text-text-secondary mt-1 text-sm">{step.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Reveal>

      <Reveal delay={0.1} className="mt-20">
        <h2 className="text-accent-400 font-mono text-xs tracking-[0.2em] uppercase">
          Engineering Focus
        </h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {about.engineeringFocus.map((skill) => (
            <span
              key={skill}
              className="border-border-strong text-text-secondary hover:border-accent-500/50 hover:bg-bg-elevated hover:text-text-primary duration-base ease-standard inline-flex items-center rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-wide uppercase transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-20">
        <h2 className="text-accent-400 font-mono text-xs tracking-[0.2em] uppercase">
          Currently Building Across
        </h2>
        <div className="mt-5 flex flex-col">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group border-border hover:border-accent-500/40 duration-base ease-standard flex items-center justify-between gap-4 border-t py-4 transition-colors last:border-b"
            >
              <div>
                <p className="text-text-primary duration-base ease-standard transition-colors group-hover:text-white">
                  {project.title}
                </p>
                <p className="text-text-muted mt-0.5 text-sm">{project.positioning}</p>
              </div>
              <span
                aria-hidden="true"
                className="text-text-secondary duration-base ease-standard group-hover:text-accent-300 shrink-0 transition-[color,transform] group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-20">
        <h2 className="text-accent-400 font-mono text-xs tracking-[0.2em] uppercase">
          Education
        </h2>
        <div className="mt-6 flex flex-col">
          {education.map((entry, index) => (
            <div
              key={entry.id}
              className="group border-border relative border-t py-6 pl-8 first:border-t-0 first:pt-0"
            >
              <span
                aria-hidden="true"
                className="border-accent-400 bg-bg duration-base ease-standard absolute top-6 left-0 h-2.5 w-2.5 rounded-full border transition-transform group-hover:scale-125"
              />
              <p className="text-text-muted font-mono text-xs tracking-wide uppercase">
                {String(index + 1).padStart(2, "0")} — {entry.dateRange}
              </p>
              <p className="text-text-primary duration-base ease-standard mt-1 text-lg transition-colors group-hover:text-white">
                {entry.degree}
              </p>
              <p className="text-text-secondary text-sm">{entry.institution}</p>
              <p className="text-text-muted mt-1 text-sm">{entry.blurb}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-12">
        <Link href="/episodes" className="text-accent-300 hover:text-accent-400 text-sm">
          See the full timeline →
        </Link>
      </Reveal>
    </div>
  );
}
