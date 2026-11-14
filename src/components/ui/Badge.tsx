import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  tone?: "default" | "accent";
}

/** Static tag. Interactive affordances belong to the enclosing link, if any. */
export function Badge({ children, className, tone = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs tracking-wide [overflow-wrap:anywhere] uppercase",
        "duration-base ease-standard transition-colors",
        tone === "accent"
          ? "border-accent-600 bg-accent-600/10 text-accent-300"
          : "border-border-strong text-text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}
