"use client";

import { motion } from "framer-motion";
import { seasons } from "@/content/seasons";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { DrawLine } from "@/components/motion/DrawLine";
import { duration, ease } from "@/lib/motion/tokens";

/** "2020–2023" / "May 2025 – Present" → the first 4-digit year — the point
 * label the timeline actually shows, derived live from seasons.ts rather
 * than duplicating a hand-picked year per point. */
function pointYear(dateRange: string): string {
  return dateRange.match(/\d{4}/)?.[0] ?? dateRange;
}

/** "BCA — Computer Science" → "BCA"; "The Real World" → "REAL WORLD" — a
 * short caption per season, derived from whichever real field reads best
 * compact (the degree short-form for school seasons, the season title for
 * the current, non-degree one). */
function pointCaption(season: (typeof seasons)[number]): string {
  if (season.id === "s03") return season.title.replace(/^The /i, "").toUpperCase();
  return season.roleOrDegree.split("—")[0].trim().toUpperCase();
}

const LINE_DELAY = 0.2;
const LINE_DURATION = duration.slow;
const SIGNAL_DELAY = LINE_DELAY + LINE_DURATION;
const SIGNAL_DURATION = 2.2;
/** How much longer the signal keeps travelling once it passes the final
 * point — it doesn't stop at 2025, it keeps going and fades out past the
 * edge of the timeline, reading as "continuing forward" into whatever comes
 * next rather than simply arriving and stopping. */
const CONTINUE_DURATION = 0.9;
const SIGNAL_TOTAL_DURATION = SIGNAL_DURATION + CONTINUE_DURATION;
const MAIN_TRAVEL_FRACTION = SIGNAL_DURATION / SIGNAL_TOTAL_DURATION;

function arrivalDelay(index: number, count: number): number {
  return SIGNAL_DELAY + index * (SIGNAL_DURATION / (count - 1));
}

/**
 * Scene 2's visual: one continuous horizontal timeline (not three static
 * cards) built from the real career seasons in seasons.ts. The line draws
 * once, then a signal travels its length; each point's year/milestone
 * resolves and briefly illuminates exactly when the signal reaches it, and
 * the signal keeps travelling past the last point rather than stopping —
 * the visual handoff into the next scene. A faint local grid stands in for
 * the trailer's usual (much larger) backdrop rings, which are dimmed for
 * this scene alone via TrailerStage's `minimal` prop.
 */
export function CareerTimeline({
  reducedMotion,
  className,
}: {
  reducedMotion: boolean;
  className?: string;
}) {
  const points = seasons;
  const step = 100 / (points.length - 1);

  if (reducedMotion) {
    return (
      <div className={className}>
        <div className="mb-4 flex justify-between">
          {points.map((s) => (
            <span
              key={s.id}
              className="text-accent-300 font-mono text-2xl tracking-[0.08em] sm:text-4xl"
            >
              {pointYear(s.dateRange)}
            </span>
          ))}
        </div>
        <div className="relative h-px">
          <div className="bg-border-strong absolute inset-0" />
          {points.map((s, i) => (
            <span
              key={s.id}
              className="border-accent-400 bg-bg absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{ left: `${i * step}%` }}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          {points.map((s) => (
            <span
              key={s.id}
              className="text-text-secondary font-mono text-xs tracking-[0.12em] sm:text-base"
            >
              {pointCaption(s)}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative">
        {/* Faint local depth layer, drifting slower than the foreground —
            the subtle "technical grid" standing in for this scene's dimmed
            backdrop rings, and the source of its slight parallax. */}
        <motion.div
          aria-hidden="true"
          className="bg-grid-technical pointer-events-none absolute -inset-x-6 -inset-y-16 -z-10 opacity-[0.08] sm:-inset-x-12"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="mb-6 flex justify-between sm:mb-8">
          {points.map((s, i) => {
            const delay = arrivalDelay(i, points.length);
            return (
              <ClipReveal key={s.id} trigger="mount" delay={delay}>
                <motion.span
                  className="text-accent-300 font-mono text-2xl font-medium tracking-[0.05em] sm:text-4xl"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, ease: ease.emphasis, delay }}
                >
                  {pointYear(s.dateRange)}
                </motion.span>
              </ClipReveal>
            );
          })}
        </div>

        <div className="relative h-px">
          <DrawLine trigger="mount" delay={LINE_DELAY} className="absolute inset-0" />

          {points.map((s, i) => {
            const delay = arrivalDelay(i, points.length);
            return (
              <span
                key={s.id}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${i * step}%` }}
              >
                {/* Brief illumination burst on arrival, settling to a low ambient glow. */}
                <motion.span
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
                  style={{
                    background:
                      "radial-gradient(circle, var(--color-accent-500) 0%, transparent 70%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.55, 0.15] }}
                  transition={{ duration: 1.4, times: [0, 0.2, 1], delay }}
                />
                <motion.span
                  className="border-accent-400 bg-bg relative block h-3 w-3 rounded-full border"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.7, 1], opacity: [0, 1, 1] }}
                  transition={{
                    duration: 0.55,
                    times: [0, 0.5, 1],
                    ease: ease.emphasis,
                    delay,
                  }}
                />
              </span>
            );
          })}

          <motion.span
            aria-hidden="true"
            className="bg-accent-400 absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
            style={{ left: 0, boxShadow: "0 0 8px var(--color-accent-500)" }}
            initial={{ opacity: 0, left: "0%" }}
            animate={{ opacity: [0, 1, 1, 0], left: ["0%", "100%", "140%"] }}
            transition={{
              opacity: {
                duration: SIGNAL_TOTAL_DURATION,
                times: [0, 0.02, MAIN_TRAVEL_FRACTION, 1],
                delay: SIGNAL_DELAY,
              },
              left: {
                duration: SIGNAL_TOTAL_DURATION,
                times: [0, MAIN_TRAVEL_FRACTION, 1],
                ease: "easeInOut",
                delay: SIGNAL_DELAY,
              },
            }}
          />
        </div>

        <div className="mt-6 flex justify-between sm:mt-8">
          {points.map((s, i) => (
            <ClipReveal
              key={s.id}
              trigger="mount"
              delay={arrivalDelay(i, points.length) + 0.12}
            >
              <span className="text-text-secondary font-mono text-sm tracking-[0.1em] sm:text-lg">
                {pointCaption(s)}
              </span>
            </ClipReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
