import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Base elevated-surface shell reused by project cards, episode cards, etc.
 * Hover is restrained on purpose: a small lift, the border stepping toward
 * the accent, and a soft violet glow underneath — no scale, no shadow you'd
 * notice before you'd notice the content.
 */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "border-border bg-bg-elevated border p-6",
        "duration-base ease-standard transition-[transform,border-color,box-shadow]",
        "hover:border-accent-500/40 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_var(--color-accent-glow)]",
        className
      )}
    >
      {children}
    </div>
  );
}
