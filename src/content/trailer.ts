import type { TrailerScene } from "./types";

/**
 * ~19s cinematic opening sequence — a system coming online, not a slideshow.
 * Deliberately scoped to four beats and nothing else: Origin (the system
 * starting), Building (the real career timeline), Real World (the shape of
 * what gets built, generically — no named projects), and Identity (the
 * payoff). Durations follow each scene's own minimum-viable length for its
 * content (boot 4s / timeline 5s / stack 5s / identity 5s = 19s).
 *
 * Only scene-specific narrative copy lives here. The career timeline
 * (scene "timeline") and the closing identity (scene "identity") are read
 * live from seasons.ts / site.ts inside Trailer.tsx — nothing about career
 * history or identity is duplicated here. Nothing in this sequence names a
 * specific project — the trailer is a portrait of the arc (origin → built →
 * shipped → identity), not a project showcase.
 */
export const trailerScenes: TrailerScene[] = [
  {
    id: "boot",
    order: 0,
    hudLabel: "Origin",
    lines: ["Every system starts somewhere."],
    holdMs: 4000,
  },
  {
    id: "timeline",
    order: 1,
    hudLabel: "Building",
    lines: [],
    holdMs: 5000,
  },
  {
    id: "stack",
    order: 2,
    hudLabel: "Real World",
    lines: ["The shape of what gets built."],
    holdMs: 5000,
  },
  {
    id: "identity",
    order: 3,
    hudLabel: "Identity",
    lines: [],
    holdMs: 5000,
  },
];
