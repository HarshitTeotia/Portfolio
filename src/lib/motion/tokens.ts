/**
 * JS-side mirror of the motion tokens in src/app/globals.css.
 * Framer Motion needs numeric seconds and cubic-bezier arrays, not CSS
 * strings, so these are kept in sync by hand — if you change one, change both.
 */

export const duration = {
  /** Buttons, nav hover/press — the smallest perceptible response. */
  micro: 0.15,
  fast: 0.15,
  base: 0.3,
  /** Standard content reveals (clip/line/stagger primitives' default). */
  normal: 0.4,
  /** Deliberate, cinematic reveals — Hero/section entrances, trailer beats. */
  slow: 0.7,
  /** The strongest moments only — hero title, trailer payoff. */
  cinematic: 1.0,
} as const;

export const ease = {
  standard: [0.4, 0, 0.2, 1],
  entrance: [0.16, 1, 0.3, 1],
  exit: [0.7, 0, 0.84, 0],
  emphasis: [0.19, 1, 0.22, 1],
} as const;
