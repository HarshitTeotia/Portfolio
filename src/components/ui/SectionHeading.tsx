import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { DrawLine } from "@/components/motion/DrawLine";

interface SectionHeadingProps {
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Use "h1" when this is a page's top-level heading — default "h2" for in-page sections. */
  level?: "h1" | "h2";
  /**
   * "display" renders the architectural, oversized treatment reserved for a
   * page's single top-of-viewport headline (Projects, Episodes, Tech) — and
   * self-animates (line draws, then the heading clips into view, then
   * metadata fades in) as the site's recurring section-title motion
   * language. Interior section headings (Problem, Solution, ...) stay
   * "default": a plain, unanimated heading — callers wrap those in `Reveal`
   * themselves if they need an entrance.
   */
  size?: "default" | "display";
}

/** Kicker + title pattern reused across season/episode/section headers. */
export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  className,
  level = "h2",
  size = "default",
}: SectionHeadingProps) {
  const Heading = level;

  if (size === "default") {
    return (
      <div className={cn(align === "center" && "text-center", className)}>
        {kicker && (
          <p className="text-accent-400 mb-3 font-mono text-xs tracking-[0.2em] uppercase">
            {kicker}
          </p>
        )}
        <Heading className="font-display text-text-primary text-3xl leading-tight font-semibold text-balance">
          {title}
        </Heading>
        {description && (
          <p className="text-text-secondary mt-4 max-w-2xl">{description}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {kicker && (
        <Reveal>
          <p className="text-accent-400 mb-4 font-mono text-xs tracking-[0.2em] uppercase">
            {kicker}
          </p>
        </Reveal>
      )}
      <DrawLine
        delay={0.05}
        amount={0.7}
        className={cn("mb-5 max-w-24", align === "center" && "mx-auto")}
      />
      <ClipReveal delay={0.15} amount={0.6}>
        <Heading className="font-display text-text-primary text-7xl leading-[0.95] font-semibold tracking-tight text-balance uppercase">
          {title}
        </Heading>
      </ClipReveal>
      {description && (
        <Reveal delay={0.35} amount={0.6}>
          <p
            className={cn(
              "text-text-secondary mt-6 max-w-2xl text-lg",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
