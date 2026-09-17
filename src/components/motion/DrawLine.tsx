"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion/tokens";

interface DrawLineProps {
  className?: string;
  delay?: number;
  amount?: number;
  /** "horizontal" draws left→right (scaleX); "vertical" draws top→bottom (scaleY). */
  axis?: "horizontal" | "vertical";
  /** "view" (default) draws on scroll-into-view. "mount" draws as soon as it mounts (orchestrated sequences). */
  trigger?: "view" | "mount";
}

/**
 * A hairline that draws itself once — the site's recurring divider/underline
 * motif, made literal. Used sparingly (section titles, architecture spines),
 * never as a page-wide decoration.
 *
 * For `trigger="view"`, the IntersectionObserver target is a plain,
 * untransformed wrapper carrying all layout/positioning classes — never the
 * scaled element itself. A `scaleX`/`scaleY` of 0 collapses the target's own
 * bounding box to zero area, which IntersectionObserver can't reliably
 * report a ratio for, so `whileInView` would never fire if placed there.
 */
export function DrawLine({
  className,
  delay = 0,
  amount = 0.6,
  axis = "horizontal",
  trigger = "view",
}: DrawLineProps) {
  const prefersReducedMotion = useReducedMotion();
  const sizeClasses = axis === "horizontal" ? "h-px w-full" : "h-full w-px";

  if (prefersReducedMotion) {
    return <div className={cn("bg-border-strong", sizeClasses, className)} />;
  }

  const target = axis === "horizontal" ? { scaleX: 1 } : { scaleY: 1 };
  const transition = { duration: duration.slow, ease: ease.entrance, delay };
  const originClass = axis === "horizontal" ? "origin-left" : "origin-top";

  if (trigger === "mount") {
    const initial = axis === "horizontal" ? { scaleX: 0 } : { scaleY: 0 };
    return (
      <motion.div
        className={cn("bg-border-strong", sizeClasses, originClass, className)}
        initial={initial}
        animate={target}
        transition={transition}
      />
    );
  }

  const variants: Variants = { hidden: {}, visible: {} };
  const innerVariants: Variants = {
    hidden: axis === "horizontal" ? { scaleX: 0 } : { scaleY: 0 },
    visible: { ...target, transition },
  };

  return (
    <motion.div
      className={cn(sizeClasses, className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      <motion.div
        className={cn("bg-border-strong", sizeClasses, originClass)}
        variants={innerVariants}
      />
    </motion.div>
  );
}
