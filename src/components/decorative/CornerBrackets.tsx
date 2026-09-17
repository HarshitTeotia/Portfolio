import { cn } from "@/lib/cn";

/**
 * Four small L-shaped corner marks, absolutely positioned over a relative
 * parent. A technical-drawing detail borrowed sparingly — metadata panels
 * and the contact/final-frame block, not every card on the page.
 *
 * `group-hover:border-accent-400/70` is always present but only ever
 * activates where an ancestor literally has the `group` class and is
 * hovered (e.g. the About photo) — everywhere else it's simply inert.
 */
export function CornerBrackets({ className }: { className?: string }) {
  const arm =
    "absolute h-3 w-3 border-border-strong transition-colors duration-base ease-standard group-hover:border-accent-400/70";
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <span className={cn(arm, "top-0 left-0 border-t border-l")} />
      <span className={cn(arm, "top-0 right-0 border-t border-r")} />
      <span className={cn(arm, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(arm, "right-0 bottom-0 border-r border-b")} />
    </div>
  );
}
