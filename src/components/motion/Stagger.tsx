"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, staggerChildren } from "@/lib/motion/variants";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Seconds between each child's entrance. */
  staggerDelay?: number;
  /** Seconds before the first child starts. */
  delay?: number;
  /** Fraction of the container that must be visible before it triggers — only used when `trigger="view"`. */
  amount?: number;
  /** "view" (default) triggers on scroll-into-view. "mount" triggers immediately (orchestrated sequences, e.g. the trailer). */
  trigger?: "view" | "mount";
}

/**
 * Container half of the stagger pair — times each `StaggerItem` child's
 * entrance via Framer's variant propagation (no manual per-item delay math
 * at call sites).
 */
export function Stagger({
  children,
  className,
  staggerDelay = 0.1,
  delay = 0,
  amount = 0.25,
  trigger = "view",
}: StaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = staggerChildren(staggerDelay, delay);

  if (trigger === "mount") {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

/** One entrance beat within a `Stagger` container. Default motion matches `Reveal`'s fadeUp. */
export function StaggerItem({
  children,
  className,
  variants = fadeUp,
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
