import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  tone?: "default" | "accent";
}

/** Small tag used for tech names, episode numbers, and status labels. Every
 * capsule in the site shares this hover language — border and text step
 * toward the accent, background gains a faint tint — whether or not the
 * badge sits inside a link. */
export function Badge({ children, className, tone = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs tracking-wide uppercase",
        "duration-base ease-standard transition-colors",
        tone === "accent"
          ? "border-accent-600 bg-accent-600/10 text-accent-300 hover:border-accent-400 hover:bg-accent-600/20 hover:text-accent-200"
          : "border-border-strong text-text-secondary hover:border-accent-500/50 hover:bg-bg-elevated hover:text-text-primary",
        className
      )}
    >
      {children}
    </span>
  );
}
