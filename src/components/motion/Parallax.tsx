"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Max px of vertical travel across the element's scroll range — keep small (5–20px); this is atmosphere, not layout. */
  range?: number;
}

/**
 * Extremely subtle scroll-linked drift for decorative elements only
 * (backgrounds, ghost numerals) — never primary text. Driven by Framer
 * Motion values rather than React state, so scrolling doesn't trigger
 * re-renders here.
 */
export function Parallax({ children, className, range = 16 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
