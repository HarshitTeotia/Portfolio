"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/motion/variants";

interface RevealProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  /** Delay in seconds before this element's entrance starts. */
  delay?: number;
  /** Fraction of the element that must be visible before it reveals. */
  amount?: number;
}

/**
 * Scroll-reveal wrapper used across Home/Episodes/Projects/Tech instead of
 * duplicating Intersection Observer + reduced-motion logic per section.
 * Reduced-motion users get an instant, motion-free appearance with the same
 * end state — never a chunk of content that fails to appear at all.
 */
export function Reveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  amount = 0.3,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
