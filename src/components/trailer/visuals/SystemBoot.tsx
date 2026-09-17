"use client";

import { motion } from "framer-motion";
import { duration, ease } from "@/lib/motion/tokens";

const VIEW_WIDTH = 360;
const VIEW_HEIGHT = 100;
const NODE_Y = 46;
const NODE_MARGIN = 36;

const LINE_DELAY = 0.15;
const LINE_DURATION = duration.slow;
const SIGNAL_DELAY = LINE_DELAY + LINE_DURATION;
const SEGMENT_DURATION = 0.65;

/**
 * Scene 1's "the system boots" visual: a small, linear Input → Process →
 * System diagram (not a ring) — thin connecting lines draw in once, then a
 * single violet signal travels the line through each node in turn. Each
 * node briefly illuminates as the signal arrives, and the signal reaching
 * the last node is the cue the boot scene's headline waits on (see
 * `TEXT_START` in Trailer.tsx's "boot" case, kept in sync with the constants
 * below by hand).
 */
export function SystemBoot({
  reducedMotion,
  labels = [],
  className,
}: {
  reducedMotion: boolean;
  labels?: readonly string[];
  className?: string;
}) {
  const count = labels.length;
  const step = count > 1 ? (VIEW_WIDTH - NODE_MARGIN * 2) / (count - 1) : 0;
  const points = labels.map((_, i) => ({ x: NODE_MARGIN + i * step, y: NODE_Y }));
  const totalSignalDuration = SEGMENT_DURATION * Math.max(count - 1, 1);

  if (reducedMotion) {
    return (
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className={className}
        aria-hidden="true"
      >
        {points.slice(0, -1).map((p, i) => (
          <line
            key={i}
            x1={p.x}
            y1={p.y}
            x2={points[i + 1].x}
            y2={points[i + 1].y}
            stroke="var(--color-border-strong)"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="var(--color-accent-400)" />
            <text
              x={p.x}
              y={p.y + 22}
              textAnchor="middle"
              fill="var(--color-text-muted)"
              fontSize="11"
              fontFamily="var(--font-mono)"
              letterSpacing="0.1em"
            >
              {labels[i].toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className={className}
      aria-hidden="true"
    >
      {points.slice(0, -1).map((p, i) => (
        <motion.line
          key={i}
          x1={p.x}
          y1={p.y}
          x2={points[i + 1].x}
          y2={points[i + 1].y}
          stroke="var(--color-border-strong)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: LINE_DURATION, ease: ease.standard, delay: LINE_DELAY }}
        />
      ))}

      {points.map((p, i) => {
        const arrival = SIGNAL_DELAY + i * SEGMENT_DURATION;
        return (
          <g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="13"
              fill="var(--color-accent-500)"
              style={{ filter: "blur(5px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.12] }}
              transition={{ duration: 1.1, times: [0, 0.25, 1], delay: arrival }}
            />
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="var(--color-accent-400)"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.6, 1], opacity: 1 }}
              transition={{
                duration: 0.45,
                times: [0, 0.5, 1],
                ease: ease.emphasis,
                delay: arrival,
              }}
            />
            <motion.text
              x={p.x}
              y={p.y + 22}
              textAnchor="middle"
              fill="var(--color-text-muted)"
              fontSize="11"
              fontFamily="var(--font-mono)"
              letterSpacing="0.1em"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration.base, delay: arrival + 0.05 }}
            >
              {labels[i].toUpperCase()}
            </motion.text>
          </g>
        );
      })}

      <motion.circle
        r="3"
        fill="var(--color-accent-400)"
        style={{ filter: "drop-shadow(0 0 4px var(--color-accent-500))" }}
        initial={{ opacity: 0, cx: points[0]?.x, cy: points[0]?.y }}
        animate={{
          opacity: [0, 1, 1, 0],
          cx: points.map((p) => p.x),
          cy: points.map((p) => p.y),
        }}
        transition={{
          opacity: {
            duration: totalSignalDuration,
            times: [0, 0.05, 0.9, 1],
            delay: SIGNAL_DELAY,
          },
          cx: { duration: totalSignalDuration, ease: "easeInOut", delay: SIGNAL_DELAY },
          cy: { duration: totalSignalDuration, ease: "easeInOut", delay: SIGNAL_DELAY },
        }}
      />
    </svg>
  );
}
