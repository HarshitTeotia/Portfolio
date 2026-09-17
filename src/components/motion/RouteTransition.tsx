"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { duration, ease } from "@/lib/motion/tokens";

/**
 * Subtle fade-up on every route change. No exit animation / AnimatePresence
 * wait — Next.js swaps content instantly on navigation, and blocking that
 * behind an exit transition would work against "content must never be
 * blocked behind a transition" (see the animation-system brief).
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.base, ease: ease.standard }}
    >
      {children}
    </motion.div>
  );
}
