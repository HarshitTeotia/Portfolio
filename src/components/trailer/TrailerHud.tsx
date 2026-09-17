"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { TrailerScene } from "@/content/types";

function formatClock(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const mm = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = (totalSeconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

/**
 * The trailer's metadata/control layer — a production-slate readout, not
 * the main attraction. Everything here is small and muted except the
 * currently active scene, which is the one place this layer is allowed to
 * use the accent color and a larger type size.
 *
 * Isolated in its own component (like the old `TrailerTimer`) so its
 * ~5×/sec tick only re-renders this corner, not the rest of the trailer.
 * Mounts fresh every time the trailer opens, so it starts at 00:00 on every
 * play and replay with no extra reset logic.
 */
export function TrailerHud({
  scenes,
  activeIndex,
  totalMs,
  reducedMotion,
}: {
  scenes: TrailerScene[];
  activeIndex: number;
  totalMs: number;
  reducedMotion: boolean;
}) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Math.min(totalMs, Date.now() - startedAt));
    }, 200);
    return () => clearInterval(interval);
  }, [totalMs]);

  const activeScene = scenes[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-text-muted font-mono text-[9px] tracking-[0.2em] uppercase">
            Trailer // 01
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-text-secondary font-mono text-[11px] tabular-nums">
            {formatClock(elapsedMs)}
          </span>
          <div className="bg-border-strong h-px w-16 overflow-hidden sm:w-24">
            {reducedMotion ? (
              // Steps with scene changes instead of animating continuously —
              // still shows real progress without a running transform.
              <div
                className="bg-accent-400 h-full"
                style={{ width: `${((activeIndex + 1) / scenes.length) * 100}%` }}
              />
            ) : (
              <motion.div
                className="bg-accent-400 h-full origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: totalMs / 1000, ease: "linear" }}
              />
            )}
          </div>
          <span className="text-text-muted font-mono text-[11px] tabular-nums">
            {formatClock(totalMs)}
          </span>
        </div>
      </div>

      <div>
        <p className="text-text-muted mb-1 font-mono text-[9px] tracking-[0.2em] uppercase">
          Current sequence
        </p>
        <p className="text-accent-300 font-display text-base tracking-wide uppercase sm:text-lg">
          {activeScene.hudLabel}
        </p>
      </div>

      <ul className="hidden flex-col gap-1 sm:flex">
        {scenes.map((scene, index) => {
          const active = index === activeIndex;
          return (
            <li
              key={scene.id}
              className={cn(
                "flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] uppercase",
                "duration-fast ease-standard transition-colors",
                active ? "text-accent-300" : "text-text-muted"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "bg-accent-400 h-1 w-1 rounded-full transition-opacity",
                  active ? "opacity-100" : "opacity-0"
                )}
              />
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{scene.hudLabel}</span>
            </li>
          );
        })}
      </ul>

      {/* Compact counter, mobile only — the scene list above is desktop metadata. */}
      <p className="text-text-muted font-mono text-[10px] tracking-[0.2em] uppercase sm:hidden">
        {String(activeIndex + 1).padStart(2, "0")} /{" "}
        {String(scenes.length).padStart(2, "0")}
      </p>
    </div>
  );
}
