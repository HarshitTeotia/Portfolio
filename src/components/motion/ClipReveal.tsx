"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { duration, ease } from "@/lib/motion/tokens";

interface ClipRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before this element's entrance starts. */
  delay?: number;
  /** Fraction of the element that must be visible before it reveals — only used when `trigger="view"`. */
  amount?: number;
  /** Edge the content slides in from behind. */
  direction?: "up" | "down";
  /**
   * "view" (default) reveals on scroll-into-view, once — for page content.
   * "mount" reveals as soon as the component mounts — for orchestrated
   * sequences (e.g. the trailer) where the parent already controls timing.
   */
  trigger?: "view" | "mount";
}

/**
 * Cinematic "reveal from behind a boundary" — an overflow-hidden mask with
 * the content translating into place, rather than a plain fade. Reserved
 * for the headline moments called out in the brief (Hero title, display-size
 * section headings, trailer statements) — most content should still use the
 * plainer `Reveal`. Transform-only, so it's GPU-cheap.
 *
 * The IntersectionObserver target (the outer div, for `trigger="view"`) is
 * kept untransformed — it never moves. Only the inner element, which
 * inherits "hidden"/"visible" via variant propagation, carries the
 * translateY mask. Putting `whileInView` directly on the transformed element
 * is a classic Framer Motion trap: its own transform shifts it out of its
 * natural bounding box, so the observer never reports it as sufficiently
 * visible and the reveal never fires.
 */
export function ClipReveal({
  children,
  className,
  delay = 0,
  amount = 0.4,
  direction = "up",
  trigger = "view",
}: ClipRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = direction === "up" ? "110%" : "-110%";
  const transition = { duration: duration.cinematic, ease: ease.emphasis, delay };

  if (trigger === "mount") {
    return (
      <div className="overflow-hidden">
        <motion.div
          className={className}
          initial={{ y: offset }}
          animate={{ y: "0%" }}
          transition={transition}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  const variants: Variants = {
    hidden: {},
    visible: {},
  };
  const innerVariants: Variants = {
    hidden: { y: offset },
    visible: { y: "0%", transition },
  };

  return (
    <motion.div
      className="overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      <motion.div className={className} variants={innerVariants}>
        {children}
      </motion.div>
    </motion.div>
  );
}
