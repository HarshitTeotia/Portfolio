import { cn } from "@/lib/cn";

/**
 * Structural grid layer, faded via mask so it never reaches full opacity —
 * a technical canvas cue, not a dashboard background. Combine with
 * OrbitalField for the hero; use alone for lighter sections.
 */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-grid-technical pointer-events-none absolute inset-0 opacity-[0.35]",
        className
      )}
      style={{
        maskImage:
          "radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)",
      }}
    />
  );
}
