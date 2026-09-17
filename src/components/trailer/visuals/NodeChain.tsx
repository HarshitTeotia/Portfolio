"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion/tokens";

interface NodeChainProps {
  /** Node labels, in order — the chain reads start to end. */
  nodes: string[];
  axis?: "horizontal" | "vertical";
  /** Smaller chips for scene 4's several-pipelines-at-once composition. */
  compact?: boolean;
  delay?: number;
  reducedMotion: boolean;
  className?: string;
}

const CHIP_SIZES = {
  regular: { main: 108, cross: 34 },
  compact: { main: 84, cross: 26 },
} as const;
const GAP = 22;
const STAGGER = 0.14;

/**
 * A small system diagram — nodes connected by lines a purple "signal"
 * travels once, top-to-bottom or left-to-right. This is the trailer's
 * recurring visual grammar: every scene's architecture is one of these,
 * not bespoke art per scene.
 *
 * Every animated value is `transform`/`opacity` — node spacing is fixed
 * (not measured from the DOM), so the signal's travel distance is known
 * up front and can be expressed as literal pixel `translateX`/`Y` keyframes
 * instead of `left`/`top`.
 */
export function NodeChain({
  nodes,
  axis = "vertical",
  compact = false,
  delay = 0,
  reducedMotion,
  className,
}: NodeChainProps) {
  const isHorizontal = axis === "horizontal";
  const { main, cross } = CHIP_SIZES[compact ? "compact" : "regular"];
  // The chain's stacking dimension is `main` for a horizontal row (chip
  // width) but `cross` for a vertical column (chip height) — using the
  // wrong one here would space nodes by their *width* while stacking them
  // vertically, badly under/over-shooting the real gap between chips.
  const stackSize = isHorizontal ? main : cross;
  const step = stackSize + GAP;
  const positions = nodes.map((_, i) => i * step + stackSize / 2);

  const chipStyle = { width: main, height: cross };

  if (reducedMotion) {
    return (
      <div
        className={cn(
          "flex items-center",
          isHorizontal ? "flex-row" : "flex-col",
          className
        )}
      >
        {nodes.map((label, i) => (
          <div key={label} className="contents">
            <div
              style={chipStyle}
              className="border-border-strong bg-bg-elevated/70 text-text-secondary flex shrink-0 items-center justify-center border px-1 text-center font-mono text-[10px] tracking-wide uppercase"
            >
              {label}
            </div>
            {i < nodes.length - 1 && (
              <div
                className={cn(
                  "bg-border-strong shrink-0",
                  isHorizontal ? "h-px" : "w-px"
                )}
                style={isHorizontal ? { width: GAP } : { height: GAP }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center",
        isHorizontal ? "flex-row" : "flex-col",
        className
      )}
    >
      {nodes.map((label, i) => (
        <div key={label} className="contents">
          <motion.div
            style={chipStyle}
            className="border-border-strong bg-bg-elevated/70 text-text-secondary flex shrink-0 items-center justify-center border px-1 text-center font-mono text-[10px] tracking-wide uppercase"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: duration.normal,
              ease: ease.entrance,
              delay: delay + i * STAGGER,
            }}
          >
            {label}
          </motion.div>
          {i < nodes.length - 1 && (
            <motion.div
              className={cn(
                "bg-border-strong shrink-0",
                isHorizontal ? "h-px origin-left" : "w-px origin-top"
              )}
              style={isHorizontal ? { width: GAP } : { height: GAP }}
              initial={isHorizontal ? { scaleX: 0 } : { scaleY: 0 }}
              animate={isHorizontal ? { scaleX: 1 } : { scaleY: 1 }}
              transition={{
                duration: duration.fast,
                ease: ease.standard,
                delay: delay + i * STAGGER + duration.normal * 0.6,
              }}
            />
          )}
        </div>
      ))}

      {/* The signal — a small violet pulse tracing the chain once. */}
      {nodes.length > 1 && (
        <motion.span
          aria-hidden="true"
          className="bg-accent-400 absolute top-0 left-0 h-1.5 w-1.5 rounded-full"
          style={{
            boxShadow: "0 0 8px var(--color-accent-500)",
            ...(isHorizontal ? { top: cross / 2 - 3 } : { left: "50%", marginLeft: -3 }),
          }}
          initial={{
            opacity: 0,
            x: isHorizontal ? positions[0] - 3 : 0,
            y: isHorizontal ? 0 : positions[0] - 3,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: isHorizontal ? positions.map((p) => p - 3) : 0,
            y: isHorizontal ? 0 : positions.map((p) => p - 3),
          }}
          transition={{
            opacity: {
              duration: duration.slow + (nodes.length - 1) * 0.3,
              times: [0, 0.15, 0.85, 1],
              delay: delay + STAGGER,
            },
            x: {
              duration: duration.slow + (nodes.length - 1) * 0.3,
              ease: "easeInOut",
              delay: delay + STAGGER,
            },
            y: {
              duration: duration.slow + (nodes.length - 1) * 0.3,
              ease: "easeInOut",
              delay: delay + STAGGER,
            },
          }}
        />
      )}
    </div>
  );
}
