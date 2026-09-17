"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { trailerScenes } from "@/content/trailer";
import { site } from "@/content/site";
import { duration, ease } from "@/lib/motion/tokens";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { TrailerStage } from "./TrailerStage";
import { TrailerHud } from "./TrailerHud";
import { SystemBoot } from "./visuals/SystemBoot";
import { NodeChain } from "./visuals/NodeChain";
import { CodeFragments } from "./visuals/CodeFragments";
import { CareerTimeline } from "./visuals/CareerTimeline";
import type { TrailerScene, TrailerSceneId } from "@/content/types";

interface TrailerProps {
  onComplete: () => void;
}

/** Flat per-scene hold under reduced motion — long enough to actually read
 * each beat (a static architecture list, a name), unlike a rushed flash.
 * "Reduce motion" means fewer transforms, not less time to read. */
const REDUCED_MOTION_HOLD_MS = 2500;

/** Narrow viewport → fewer nodes per diagram, same story. Trailer only ever
 * mounts client-side (see TrailerGate), so reading `window` in the lazy
 * initializer is safe — this component never runs during SSR. */
function useIsCompactViewport() {
  const [compact, setCompact] = useState(
    () => window.matchMedia("(max-width: 640px)").matches
  );
  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const onChange = () => setCompact(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return compact;
}

/** Each scene gets its own entrance/exit character instead of one fade
 * repeated six times — a small system materializing, a step forward in
 * time, a push into the stack, a plain crossfade for the two scenes whose
 * own internal visuals already carry the motion (systems, converge), and a
 * slower emphasis-eased settle for the payoff. */
interface SceneMotionSpec {
  initial: { opacity: number; scale?: number; y?: number };
  exit: { opacity: number; scale?: number; y?: number };
  duration: number;
  ease: readonly [number, number, number, number];
}

const SCENE_MOTION: Record<TrailerSceneId, SceneMotionSpec> = {
  boot: {
    initial: { opacity: 0, scale: 0.96 },
    exit: { opacity: 0, scale: 1.02 },
    duration: duration.slow,
    ease: ease.entrance,
  },
  timeline: {
    initial: { opacity: 0, y: 24 },
    exit: { opacity: 0, y: -24 },
    duration: duration.slow,
    ease: ease.entrance,
  },
  stack: {
    initial: { opacity: 0, scale: 0.94 },
    exit: { opacity: 0, scale: 1.04 },
    duration: duration.slow,
    ease: ease.entrance,
  },
  identity: {
    initial: { opacity: 0, scale: 0.92 },
    exit: { opacity: 0 },
    duration: duration.cinematic,
    ease: ease.emphasis,
  },
};

/**
 * Full-screen cinematic opening sequence. Renders as an overlay on top of
 * the (already server-rendered) Home content — see TrailerGate — so there
 * is nothing to lay out or shift once this unmounts.
 *
 * One persistent `TrailerStage` sits behind every scene (see that file) so
 * the sequence reads as one continuous shot moving through a system, not
 * six unrelated slides — each scene only swaps its own midground diagram
 * and text in front of that unbroken backdrop. The HUD (`TrailerHud`) is a
 * metadata layer in the corner; the center of the screen carries the
 * cinematic visual for every scene.
 */
export function Trailer({ onComplete }: TrailerProps) {
  const reducedMotion = Boolean(useReducedMotion());
  const compact = useIsCompactViewport();
  const [sceneIndex, setSceneIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try {
      window.sessionStorage.setItem("trailer-seen", "1");
    } catch {
      // sessionStorage unavailable (private mode etc.) — trailer just replays next time.
    }
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (sceneIndex >= trailerScenes.length) {
      finish();
      return;
    }
    const scene = trailerScenes[sceneIndex];
    const hold = reducedMotion ? REDUCED_MOTION_HOLD_MS : scene.holdMs;
    timeoutRef.current = setTimeout(() => setSceneIndex((i) => i + 1), hold);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [sceneIndex, reducedMotion, finish]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        finish();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finish]);

  const clampedIndex = Math.min(sceneIndex, trailerScenes.length - 1);
  const scene = trailerScenes[clampedIndex];
  const converged = scene.id === "identity";
  const totalMs = reducedMotion
    ? trailerScenes.length * REDUCED_MOTION_HOLD_MS
    : trailerScenes.reduce((sum, s) => sum + s.holdMs, 0);

  const motionSpec = SCENE_MOTION[scene.id];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${site.name} intro`}
      aria-live="polite"
      onClick={finish}
      className="bg-bg fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <TrailerStage
        converged={converged}
        reducedMotion={reducedMotion}
        minimal={scene.id === "boot" || scene.id === "timeline"}
      />

      <div className="absolute top-6 left-6">
        <TrailerHud
          scenes={trailerScenes}
          activeIndex={clampedIndex}
          totalMs={totalMs}
          reducedMotion={reducedMotion}
        />
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          finish();
        }}
        className="border-border-strong text-text-secondary duration-fast ease-standard hover:text-text-primary absolute top-6 right-6 rounded-md border px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors"
      >
        Skip intro
      </button>

      {/* Deliberately no `mode="wait"` here: with it, this specific
          AnimatePresence + single-keyed-child setup never reaches its
          `animate` target — Framer Motion writes the `initial` inline style
          once and never updates it (verified: the element sits at its
          `initial` opacity/transform for the scene's entire duration,
          confirmed via computed styles). Plain (default/"sync") mode
          animates correctly and lets consecutive scenes briefly cross-fade,
          which also reads better as "one continuous sequence" than a hard
          wait-then-cut. See the same fix applied inside ArchitectureMorph. */}
      <AnimatePresence>
        <motion.div
          key={scene.id}
          initial={reducedMotion ? { opacity: 0 } : motionSpec.initial}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : motionSpec.exit}
          transition={{
            duration: reducedMotion ? duration.fast : motionSpec.duration,
            ease: reducedMotion ? ease.standard : motionSpec.ease,
          }}
          className="flex flex-col items-center"
        >
          <SceneContent scene={scene} reducedMotion={reducedMotion} compact={compact} />
        </motion.div>
      </AnimatePresence>

      <p className="text-text-muted absolute bottom-8 font-mono text-xs">
        Click, press Enter, or Skip intro to continue
      </p>
    </div>,
    document.body
  );
}

/** Per-scene choreography — a visual system first, text second, on the
 * shared `TrailerStage` backdrop. */
function SceneContent({
  scene,
  reducedMotion,
  compact,
}: {
  scene: TrailerScene;
  reducedMotion: boolean;
  compact: boolean;
}) {
  switch (scene.id) {
    case "boot": {
      const words = scene.lines[0].split(" ");
      // Starts once SystemBoot's signal reaches its last ("System") node —
      // see the matching SIGNAL_DELAY/SEGMENT_DURATION constants there
      // (0.85s + 2 * 0.65s = 2.15s), plus a brief pause before text answers.
      const TEXT_START = 2.35;
      const WORD_STAGGER = 0.14;
      return (
        <div className="flex flex-col items-center">
          <SystemBoot
            reducedMotion={reducedMotion}
            labels={["Input", "Process", "System"]}
            className="mx-auto h-16 w-full max-w-[15rem] sm:h-20 sm:max-w-xs"
          />
          <div className="mt-10 flex max-w-xs flex-wrap justify-center gap-x-3 gap-y-2 sm:mt-14 sm:max-w-md">
            {words.map((word, i) => (
              <ClipReveal
                key={word + i}
                trigger="mount"
                delay={reducedMotion ? 0 : TEXT_START + i * WORD_STAGGER}
              >
                <span className="font-display text-text-primary text-xl sm:text-3xl">
                  {word}
                </span>
              </ClipReveal>
            ))}
          </div>
        </div>
      );
    }

    case "timeline":
      return (
        <CareerTimeline
          reducedMotion={reducedMotion}
          // Viewport-relative rather than `w-full`: this scene's flex
          // wrapper (shared by every scene, see the AnimatePresence child
          // below) has no width of its own, so a `w-full` child here would
          // just shrink-wrap to its own content — collapsing the year row's
          // `justify-between` gaps to zero regardless of font size. `vw`
          // sidesteps that by resolving against the viewport directly.
          className="w-[min(calc(100vw-3rem),48rem)]"
        />
      );

    case "stack": {
      const chainNodes = compact
        ? ["Client", "FastAPI", "Auth / RBAC", "PostgreSQL"]
        : [
            "Client",
            "REST API",
            "FastAPI",
            "Auth / RBAC",
            "Business Logic",
            "PostgreSQL",
          ];
      return (
        <div className="relative flex flex-col items-center">
          <CodeFragments
            reducedMotion={reducedMotion}
            className="pointer-events-none absolute -inset-x-20 -top-16 -bottom-16 hidden sm:block"
          />
          <NodeChain
            nodes={chainNodes}
            axis="vertical"
            delay={reducedMotion ? 0 : 0.2}
            reducedMotion={reducedMotion}
            className="mb-6"
          />
          <ClipReveal trigger="mount" delay={reducedMotion ? 0 : 2.7}>
            <p className="font-display text-text-primary text-xl sm:text-3xl">
              {scene.lines[0]}
            </p>
          </ClipReveal>
        </div>
      );
    }

    case "identity":
    default: {
      const [firstName, ...rest] = site.name.split(" ");
      const lastName = rest.join(" ");
      return (
        <div className="relative flex flex-col items-center">
          <div
            aria-hidden="true"
            className="bg-accent-500/25 absolute top-1/2 left-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
          />
          {!reducedMotion && (
            <motion.span
              aria-hidden="true"
              className="bg-accent-400/70 absolute top-1/2 left-0 h-px w-full"
              style={{ boxShadow: "0 0 12px var(--color-accent-500)" }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 1.1, times: [0, 0.5, 1], ease: "easeInOut" }}
            />
          )}
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: reducedMotion ? duration.fast : duration.cinematic,
              ease: ease.emphasis,
              delay: reducedMotion ? 0 : 1.0,
            }}
          >
            <p className="font-display text-text-primary text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
              {firstName}
            </p>
            <p className="font-display text-accent-300 text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
              {lastName}
            </p>
          </motion.div>
          <motion.p
            className="text-text-secondary mt-5 font-mono text-xs tracking-[0.3em] uppercase sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.slow, delay: reducedMotion ? 0.1 : 1.9 }}
          >
            {site.identityRoles.join(" · ")}
          </motion.p>
          <motion.p
            className="text-text-muted mt-6 max-w-xs font-mono text-[11px] tracking-wide sm:max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.slow, delay: reducedMotion ? 0.2 : 2.6 }}
          >
            {site.tagline}
          </motion.p>
        </div>
      );
    }
  }
}
