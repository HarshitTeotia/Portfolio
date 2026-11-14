import type { TrailerScene } from "@/content/types";

/** Scene-based progress avoids a continuous React timer and noisy announcements. */
export function TrailerHud({
  scenes,
  activeIndex,
  totalMs,
}: {
  scenes: TrailerScene[];
  activeIndex: number;
  totalMs: number;
}) {
  return (
    <div className="max-w-xs min-w-0 flex-1">
      <p className="text-accent-300 text-sm">{scenes[activeIndex].hudLabel}</p>
      <p className="text-text-secondary mt-1 text-xs">
        Scene {activeIndex + 1} of {scenes.length} · {totalMs / 1000}s intro
      </p>
      <progress
        aria-label="Intro scene progress"
        value={activeIndex + 1}
        max={scenes.length}
        className="mt-3 block h-1 w-full"
      />
    </div>
  );
}
