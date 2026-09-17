"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface TrailerStageProps {
  /** Scenes 5–6 pull focus inward — background arcs/grid recede rather than disappear outright. */
  converged: boolean;
  reducedMotion: boolean;
  /** Scene 2 (the career timeline) needs its own foreground content to read
   * clearly without the backdrop's large orbital rings competing for
   * attention — this dims and shrinks the midground tier further than
   * `converged` does, and drops the outermost ring entirely, without
   * touching how any other scene renders. */
  minimal?: boolean;
}

/**
 * The trailer's persistent backdrop — grid, orbital arcs, and a barely-there
 * "camera" drift — rendered once behind every scene instead of being part of
 * each scene's own markup. This is what makes the sequence read as one
 * continuous shot rather than six slides: the canvas never resets.
 *
 * Two depth tiers (grid vs. arcs) animate at slightly different scales so
 * the drift reads as parallax rather than a single flat layer moving. The
 * whole backdrop also fades in from nothing on mount — scene 1 opens on an
 * almost-black frame, with the grid emerging rather than being present
 * immediately.
 */
export function TrailerStage({
  converged,
  reducedMotion,
  minimal = false,
}: TrailerStageProps) {
  const cameraClass = reducedMotion ? "" : "animate-trailer-camera";
  const cameraClassSlow = reducedMotion ? "" : "animate-trailer-camera-slow";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0.3 : 1.6 }}
    >
      {/* Background tier — grid, barely moves */}
      <div
        className={cn(
          "bg-grid-technical absolute inset-0 origin-center transition-opacity duration-[1200ms]",
          cameraClassSlow,
          minimal ? "opacity-[0.06]" : converged ? "opacity-[0.08]" : "opacity-[0.22]"
        )}
        style={{
          maskImage:
            "radial-gradient(ellipse 65% 55% at 50% 42%, black 0%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 55% at 50% 42%, black 0%, transparent 78%)",
        }}
      />

      {/* Midground tier — orbital arcs, slightly more drift than the grid */}
      <svg
        viewBox="0 0 960 720"
        preserveAspectRatio="xMidYMid slice"
        className={cn(
          "absolute inset-0 h-full w-full origin-center transition-opacity duration-[1200ms]",
          cameraClass,
          minimal ? "opacity-[0.10]" : converged ? "opacity-[0.18]" : "opacity-45"
        )}
      >
        <g
          className={reducedMotion ? "" : "animate-orbit-slow"}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle
            cx="480"
            cy="360"
            r="180"
            fill="none"
            stroke="var(--color-border-strong)"
            strokeWidth="1"
          />
          <circle
            cx="480"
            cy="360"
            r="180"
            fill="none"
            stroke="var(--color-accent-500)"
            strokeWidth="1.5"
            strokeDasharray="2 12"
            opacity="0.5"
          />
        </g>
        {!minimal && (
          <g
            className={reducedMotion ? "" : "animate-orbit-slow-reverse"}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle
              cx="480"
              cy="360"
              r="300"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="1"
            />
          </g>
        )}
        <circle
          cx="480"
          cy="360"
          r="80"
          fill="none"
          stroke="var(--color-border-strong)"
          strokeWidth="1"
        />
      </svg>

      {/* Foreground glow — the one warm accent, drifts slowest of all */}
      <div
        className={cn(
          "bg-accent-600/10 absolute top-1/2 left-1/2 h-[560px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] transition-opacity duration-[1200ms]",
          reducedMotion ? "" : "animate-glow-drift",
          minimal ? "opacity-40" : converged ? "opacity-60" : "opacity-100"
        )}
      />
    </motion.div>
  );
}
