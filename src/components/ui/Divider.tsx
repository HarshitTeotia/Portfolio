"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion/tokens";

/**
 * A hairline that draws itself left→right once, when it scrolls into view —
 * one of the recurring "line" motifs from the motion-pass brief. Used
 * sparingly (project detail's section breaks), not as a page-wide device.
 *
 * The outer wrapper (untransformed, carries the layout className) is the
 * IntersectionObserver target; the `<hr>` itself carries the scaleX. `<hr>`
 * is a void element and can't have children, so the usual "container tracks,
 * child animates" split has to happen one level up instead of nesting inside it.
 */
export function Divider({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <hr className={cn("border-border", className)} />;
  }

  const containerVariants: Variants = { hidden: {}, visible: {} };
  const lineVariants: Variants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: duration.slow, ease: ease.entrance },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={containerVariants}
    >
      <motion.hr className="border-border origin-left" variants={lineVariants} />
    </motion.div>
  );
}
