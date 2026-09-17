"use client";

import { motion } from "framer-motion";
import { duration } from "@/lib/motion/tokens";

const FRAGMENTS = [
  { text: "POST /api", top: "18%", left: "12%", delay: 0.1 },
  { text: "async def", top: "68%", left: "8%", delay: 0.35 },
  { text: "GET /projects", top: "22%", left: "70%", delay: 0.2 },
  { text: "SELECT *", top: "72%", left: "66%", delay: 0.5 },
  { text: "200 OK", top: "46%", left: "84%", delay: 0.65 },
] as const;

/**
 * Loose visual texture, not a functional terminal — fragments of the kind of
 * text a backend developer's day is made of, scattered and half-legible in
 * the frame's corners so the diagram stays the focal point.
 */
export function CodeFragments({
  reducedMotion,
  className,
}: {
  reducedMotion: boolean;
  className?: string;
}) {
  const visible = reducedMotion ? FRAGMENTS.slice(0, 2) : FRAGMENTS;

  return (
    <div aria-hidden="true" className={className}>
      {visible.map((fragment) =>
        reducedMotion ? (
          <span
            key={fragment.text}
            className="text-text-muted absolute font-mono text-[11px] tracking-wide opacity-40"
            style={{ top: fragment.top, left: fragment.left }}
          >
            {fragment.text}
          </span>
        ) : (
          <motion.span
            key={fragment.text}
            className="text-text-muted absolute font-mono text-[11px] tracking-wide"
            style={{ top: fragment.top, left: fragment.left }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.5, 0] }}
            transition={{
              duration: duration.cinematic + 0.6,
              times: [0, 0.25, 0.75, 1],
              delay: fragment.delay,
            }}
          >
            {fragment.text}
          </motion.span>
        )
      )}
    </div>
  );
}
