# ANIMATION_SYSTEM.md

Every animation mechanism in this codebase, verified by reading each file directly. Two motion systems coexist: **JS-driven** (Framer Motion, via the primitives in `src/components/motion/`) and **CSS-only** (keyframes in `src/app/globals.css`, applied via utility classes). Both respect `prefers-reduced-motion`.

---

## Reusable motion primitives

All live in `src/components/motion/` and are `"use client"` (Framer Motion requires it). Every one calls `useReducedMotion()` from `framer-motion` and renders a plain, motion-free element when it's true — this is the single reduced-motion mechanism for JS-driven animation (see [Reduced motion](#reduced-motion-handling) below).

### `Reveal.tsx`

**Purpose:** scroll-triggered entrance — the site's default "this section fades/slides into view" wrapper.
**Used by:** nearly every page section (Home, About, Contact, Experience, Tech, project pages).
**Props:** `children`, `variants` (default: `fadeUp` from `lib/motion/variants.ts`), `className`, `delay` (seconds), `amount` (fraction visible before triggering — default `0.3`).
**Mechanism:** `motion.div` with `initial="hidden"` `whileInView="visible"` `viewport={{ once: true, amount }}`.
**Timing/easing:** whatever the `variants` object specifies — `fadeUp`'s default is `duration.slow` (0.7s) with `ease.entrance`.
**Safe to modify:** yes, but it's the most widely reused primitive in the site — verify visually across multiple pages after any change.

### `ClipReveal.tsx`

**Purpose:** cinematic "reveal from behind a mask" — content translates up (or down) from behind an `overflow-hidden` boundary, rather than a plain fade. Reserved for headline moments (Hero title, `SectionHeading size="display"`, trailer scene statements).
**Props:** `children`, `className`, `delay`, `amount` (view-trigger only), `direction: "up" | "down"`, `trigger: "view" | "mount"`.
**Mechanism:** two nested `motion.div`s — an untransformed outer wrapper (the actual IntersectionObserver target) and an inner element carrying the `translateY`. **This split is load-bearing**: the in-file comment explains that putting `whileInView` directly on the transformed element is "a classic Framer Motion trap" — the element's own transform shifts it out of its natural bounding box, so the observer never reports it as visible and the reveal never fires.
**`trigger="mount"`** skips the IntersectionObserver entirely and animates immediately on mount — used by the Trailer, where the parent already controls timing via `setTimeout`.
**Timing/easing:** `duration.cinematic` (1.0s), `ease.emphasis`.
**Safe to modify:** yes, but preserve the two-div structure.

### `DrawLine.tsx`

**Purpose:** a hairline that draws itself once (`scaleX`/`scaleY` from 0→1) — the site's recurring divider/underline motif, made literal.
**Used by:** `SectionHeading` (display size), `TechMap` category headers, `SeasonBlock`'s vertical timeline rail, project-detail section breaks (alongside `Divider`).
**Props:** `className`, `delay`, `amount` (default `0.6`), `axis: "horizontal" | "vertical"`, `trigger: "view" | "mount"`.
**Mechanism:** same two-wrapper split as `ClipReveal`, for the same reason (a `scale` of 0 collapses the target's bounding box to zero area, which IntersectionObserver can't reliably report a ratio for).
**Timing/easing:** `duration.slow` (0.7s), `ease.entrance`.
**Used sparingly by convention** — "never as a page-wide decoration," per in-file comment.

### `Stagger.tsx` / `StaggerItem`

**Purpose:** container/child pair for staggering a list's entrance — timed via Framer Motion's variant propagation, no manual per-item delay math at call sites.
**Used by:** About ("What I Build"/"How I Work"), Experience entries, Projects index rows, `ArchitectureView` (pipeline steps/module groups/metrics), `SeasonBlock`, Trailer scene text, Header's mobile nav.
**`Stagger` props:** `children`, `className`, `staggerDelay` (default 0.1s), `delay`, `amount` (default 0.25), `trigger: "view" | "mount"`.
**`StaggerItem` props:** `children`, `className`, `variants` (default: `fadeUp`).
**Mechanism:** `Stagger` sets `variants={staggerChildren(staggerDelay, delay)}` (from `lib/motion/variants.ts`) on `initial="hidden"`/`whileInView="visible"` (or `animate="visible"` for `trigger="mount"`); each `StaggerItem` inherits `hidden`/`visible` via Framer's automatic variant propagation to `motion.div` children.

### `Parallax.tsx`

**Purpose:** extremely subtle scroll-linked drift, decorative elements only (never primary text).
**Used by:** Hero's background layer (`GridBackdrop` + `OrbitalField`) only.
**Props:** `children`, `className`, `range` (max px of vertical travel, default 16 — kept small by convention, 5–20px).
**Mechanism:** `useScroll({ target: ref, offset: ["start end", "end start"] })` → `useTransform(scrollYProgress, [0,1], [-range, range])`, applied as a Motion Value directly to `style={{ y }}` — this means scrolling does **not** trigger React re-renders here, only a direct DOM transform update.

### `RouteTransition.tsx`

**Purpose:** subtle fade-up (`opacity`/`y: 8→0`) on every client-side route change.
**Used by:** root `layout.tsx`, wrapping `{children}` inside `<main>`.
**Mechanism:** `motion.div` keyed by `pathname`, `initial`/`animate` only — **no exit animation and no `AnimatePresence`**. The in-file comment explains why: Next.js swaps page content instantly on navigation, and blocking that behind an exit transition would violate the project's "content must never be blocked behind a transition" rule.
**Timing/easing:** `duration.base` (0.3s), `ease.standard`.

### `Divider.tsx` (in `src/components/ui/`, not `motion/`, but animation-bearing)

**Purpose:** a hairline that draws left→right once on scroll-into-view — used at project-detail section breaks.
**Mechanism:** same "untransformed wrapper is the IntersectionObserver target, inner `<hr>` carries the `scaleX`" pattern as `DrawLine`, necessitated because `<hr>` is a void element and can't have children — the container/animated-child split has to happen one level up.

---

## CSS-only animations (`src/app/globals.css`, `@layer utilities`)

These require no JavaScript and are automatically covered by the global `prefers-reduced-motion` kill-switch (see below) rather than needing individual reduced-motion checks:

| Class                                                      | Keyframe                                                | Duration                                               | Used by                                                                                                                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.animate-orbit-slow`                                      | `orbit-spin` (0°→360°)                                  | 140s linear infinite                                   | `OrbitalField`, `TrailerStage` (background tier)                                                                                                                         |
| `.animate-orbit-slow-reverse`                              | `orbit-spin` reverse                                    | 100s linear infinite                                   | `OrbitalField`, `TrailerStage` (background tier)                                                                                                                         |
| `.animate-glow-drift`                                      | `glow-drift` (translate+scale+opacity)                  | 18s ease-in-out infinite                               | Hero's ambient glow, `TrailerStage`'s foreground glow                                                                                                                    |
| `.animate-node-pulse`                                      | `node-pulse` (opacity 0.45↔1)                           | 5s ease-in-out infinite                                | `OrbitalField`'s node marks                                                                                                                                              |
| `.animate-trailer-camera` / `.animate-trailer-camera-slow` | `trailer-camera(-slow)` (`scale(1)→scale(1.08)`/`1.04`) | 19s cubic-bezier, **`forwards`, plays once (no loop)** | `TrailerStage`'s midground/background tiers — the trailer's entire "camera push-in" over its ~19s runtime (kept in sync by hand with `trailerScenes[]`'s total `holdMs`) |

`OrbitalField` and `GridBackdrop` are pure Server Components precisely because their animation is 100% CSS — no client JS is needed to drive or clean them up.

---

## Reduced motion handling

Two independent layers, both real:

1. **Global CSS kill-switch** (`globals.css`, `@layer base`):

   ```css
   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```

   This alone neutralizes every CSS keyframe animation and CSS transition site-wide (orbit rings, glow drift, node pulse, trailer camera, all `duration-*`/`transition-*` utility classes).

2. **Per-component JS branch** (`useReducedMotion()` from `framer-motion`): every motion primitive listed above, plus the Trailer and its visual sub-components (`SystemBoot`, `NodeChain`, `CodeFragments`), explicitly check this and render a static/instant equivalent rather than relying on the CSS kill-switch alone (important because Framer Motion drives many animations via inline styles / the Web Animations API, which the CSS media query above does not touch).

**End states always match.** The explicit design intent (per `Reveal.tsx`'s comment) is that reduced-motion users get "an instant, motion-free appearance with the same end state — never a chunk of content that fails to appear at all."

---

## Trailer lifecycle

The most complex animation system in the codebase — a ~19s, four-scene cinematic sequence ("an engineering system coming online"), not a slideshow. Deliberately scoped to exactly four beats — Origin, Building, Real World, Identity — and nothing else; no scene names a specific project. Files involved: `TrailerGate.tsx` (gate/context), `Trailer.tsx` (orchestration + scene shell), `TrailerHud.tsx` (metadata/control layer), `TrailerStage.tsx` (persistent backdrop), `visuals/SystemBoot.tsx`, `visuals/NodeChain.tsx`, `visuals/CodeFragments.tsx`, `visuals/CareerTimeline.tsx` (per-scene visuals), `src/content/trailer.ts` (scene order/timing/narrative copy).

### Entry points

There are exactly two ways the Trailer can appear:

1. **First-time-this-session visit to Home.** `TrailerGate` wraps Home's content (`app/page.tsx`). On mount, it reads `sessionStorage.getItem("trailer-seen")` via `useSyncExternalStore` — if not `"1"`, the trailer shows automatically.
2. **Explicit replay.** `WatchTrailerButton` (in `Hero.tsx`) calls `useTrailerReplay()`, a function provided by `TrailerGate`'s React Context, which sets `replaying = true`.

### Step-by-step lifecycle

```
USER CLICKS "WATCH TRAILER" (or: first-ever page load this session)
  ↓
TrailerGate.showTrailer = replaying || (!seenBefore && !dismissedThisVisit)  →  becomes true
  ↓
TrailerGate mounts <Trailer onComplete={handleComplete} /> (fresh mount — all state starts at zero)
  ↓
Trailer's initial state: sceneIndex=0, timeoutRef=null, finishedRef=false
  useIsCompactViewport() reads window.matchMedia("(max-width: 640px)") — safe because
  Trailer only ever renders client-side (TrailerGate gates it after hydration)
  ↓
createPortal(...) renders the full-screen overlay into document.body:
  - role="dialog" aria-modal="true" aria-label="{site.name} intro" aria-live="polite"
  - onClick={finish} on the root (click anywhere to skip)
  - <TrailerStage> — persistent backdrop, rendered once, never remounted per-scene;
    fades in from nothing on mount (opacity 0→1 over ~1.6s) so scene 1 opens on an
    almost-black frame
  - <TrailerHud> — metadata layer: "TRAILER // 01" label, a single continuous
    progress bar (0→100% over the whole run), elapsed/total timer, "CURRENT
    SEQUENCE" + active scene's `hudLabel`, and (desktop only) the 4-item scene
    list with a violet dot marking the active one (list length and mobile
    counter are both derived from `scenes.length`, not hardcoded)
  - "Skip intro" button (stopPropagation, then calls finish() directly)
  - <AnimatePresence><motion.div key={scene.id}>...<SceneContent /></motion.div></AnimatePresence>
    — deliberately no `mode="wait"` (see the code comment above it and the note below)
  ↓
EFFECT (runs on mount and every sceneIndex change):
  if sceneIndex >= trailerScenes.length → finish(); return
  else: hold = reducedMotion ? REDUCED_MOTION_HOLD_MS (2500) : scene.holdMs
        timeoutRef.current = setTimeout(() => setSceneIndex(i => i+1), hold)
        cleanup: clearTimeout(timeoutRef.current)
  ↓
SCENES ADVANCE IN ORDER (content/trailer.ts, order 0→3, total 19,000ms):
  "boot" (HUD label "Origin", 4000ms)
    → SystemBoot: a small linear Input → Process → System diagram (thin
      connecting lines, not a ring) — lines draw in, then a violet signal
      travels node to node, illuminating each on arrival; once it reaches the
      last node ("System"), the headline "Every system starts somewhere."
      reveals word by word (see SystemBoot.tsx's SIGNAL_DELAY/SEGMENT_DURATION
      and Trailer.tsx's matching TEXT_START constant)
    → "timeline" (HUD label "Building", 5000ms)
    → CareerTimeline: one continuous horizontal line built live from
      src/content/seasons.ts (2020/2023/2025), a signal travels it once,
      each point illuminates and its year + short caption resolves as the
      signal reaches it, then the signal continues past the last point and
      fades rather than simply stopping. Renders inside a viewport-relative
      width (`w-[min(calc(100vw-3rem),48rem)]`) passed from Trailer.tsx — see
      the note on scene-wrapper width below.
    → "stack" (HUD label "Real World", 5000ms)
    → NodeChain (vertical, 6 nodes: Client → REST API → FastAPI → Auth/RBAC →
      Business Logic → PostgreSQL) over a faint CodeFragments texture, then
      "The shape of what gets built." — a generic backend shape, no project
      name.
    → "identity" (HUD label "Identity", 5000ms)
    → a violet horizontal signal sweeps once, then site.name (split into two
      lines, matching Hero's own treatment), site.identityRoles, and
      site.tagline reveal in sequence, held for the rest of the scene
  Each scene's entrance/exit character is looked up per scene.id in Trailer.tsx's
  SCENE_MOTION table (a small scale/slide/fade variation per scene — not one
  fade repeated four times) — duration.slow/base/cinematic depending on the
  scene, duration.fast under reduced motion. TrailerStage's backdrop also gets
  a `minimal` prop for "boot" and "timeline" only, dimming the grid/arcs
  further and dropping the outermost ring so those scenes' own small diagrams
  read clearly.
  ↓
KEYBOARD LISTENER (attached once on mount): Escape / Enter / Space → finish()
  ↓
finish() [guarded by finishedRef — runs its body at most once per Trailer mount]:
  - clearTimeout(timeoutRef.current) if pending
  - try { sessionStorage.setItem("trailer-seen", "1") } catch {} (private-mode-safe)
  - calls onComplete() [= TrailerGate.handleComplete]
  ↓
TrailerGate.handleComplete(): setDismissedThisVisit(true); setReplaying(false)
  ↓
showTrailer recomputes to false → <Trailer> unmounts
  ↓
UNMOUNT CLEANUP: the scene-advance effect's cleanup clears any pending setTimeout;
  TrailerHud unmounts as a child, so its own effect cleanup clears its setInterval;
  the keydown listener's effect cleanup removes it via window.removeEventListener
  ↓
NEXT FULL PAGE LOAD: TrailerGate re-reads sessionStorage — "trailer-seen"="1" means
  seenBefore=true, so the trailer does NOT auto-show again this session.
  The "Watch Trailer" button still works regardless (sets replaying=true directly).
```

### Notes on specific mechanisms

- **Why there's no `mode="wait"` on the scene AnimatePresence.** This was a real bug, not a stylistic choice: with `mode="wait"`, the outer scene wrapper's Framer Motion `animate` target never applies — it verifiably sits at its `initial` opacity/transform for the entire scene (confirmed via computed styles and `onAnimationComplete` never firing), making every scene's content invisible. Removing `mode="wait"` (plain/default `AnimatePresence`) fixes it and lets consecutive scenes briefly cross-fade, which also reads better as "one continuous sequence." Don't reintroduce `mode="wait"` without re-verifying — the code comment above the `AnimatePresence` in `Trailer.tsx` explains this.
- **`TrailerHud`** isolates its ~5×/second timer tick (`setInterval(200ms)`) in its own component so it only re-renders that corner, not the rest of the Trailer. It starts its own `Date.now()` baseline on mount, so it always reads `00:00` at the start of every play/replay with no manual reset logic — a fresh mount is a fresh timer by construction. Its progress bar is one continuous `scaleX` animation over the whole run (or a stepped, non-animated bar under reduced motion) rather than the old per-scene segmented bars.
- **A scene's own visual needs a real width from its caller, not `w-full`.** `Trailer.tsx`'s scene wrapper (`className="flex flex-col items-center"`) is a shrink-to-fit flex item with no width of its own — a child's `w-full` resolves against it and collapses to the child's own content width instead of the viewport. This was a real, confirmed bug in `CareerTimeline` (its year row rendered with zero gap between years, reading as one fused number, regardless of font size — `getBoundingClientRect()` showed the container's width and its children's combined width matching exactly). Fixed by giving `CareerTimeline`'s call site a viewport-relative width (`w-[min(calc(100vw-3rem),48rem)]`) instead of `w-full`. Any future scene visual that needs to actually fill available space should do the same.
- **Body scroll locking:** no `document.body.style.overflow` toggle (or equivalent) exists anywhere in `TrailerGate.tsx`/`Trailer.tsx`. The overlay is a full-viewport, opaque, `fixed inset-0` element, so this is not visually noticeable, but there is genuinely no explicit scroll-lock mechanism — see Known Limitations.
- **Responsive behavior:** `useIsCompactViewport()` (a `matchMedia` listener for `max-width: 640px`) reduces the "stack" scene's chain to 4 nodes (from 6). `TrailerHud`'s 4-item scene list is hidden on mobile in favor of a compact "0X / 04" counter (both derived from `scenes.length`).
- **Reduced motion inside the Trailer:** every scene hold becomes a flat 2500ms (`REDUCED_MOTION_HOLD_MS`) — long enough to actually read the content, not a rushed flash; `AnimatePresence` cross-fades become plain opacity fades (no scale/`y`/`x` transform); `SystemBoot`/`NodeChain`/`CodeFragments`/`CareerTimeline` all render pre-settled static SVG/markup instead of animating in.

---

## Which animations are reusable vs. page-specific vs. CSS-only vs. JS-required

| Category                                | Examples                                                                                                                                                                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reusable across pages**               | `Reveal`, `ClipReveal`, `DrawLine`, `Stagger`/`StaggerItem`, `Divider`, `SectionHeading`'s display-mode choreography                                                                                                            |
| **Page/feature-specific**               | `Parallax` (Hero only), `RouteTransition` (root layout only), everything in `src/components/trailer/` (Home only), `TechMap`'s highlight interaction (`/tech` only), `ArchitectureView`'s `FlowConnector` (project detail only) |
| **CSS-only (no JS, Server Components)** | `OrbitalField`, `GridBackdrop`, `TrailerStage`'s camera-push keyframes                                                                                                                                                          |
| **Requires JavaScript (Framer Motion)** | Everything in `src/components/motion/`, the Trailer and its visuals, `Header`'s active-nav-dot and mobile menu, `ArchitectureView`, `Divider`                                                                                   |
