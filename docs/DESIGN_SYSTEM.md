# DESIGN_SYSTEM.md

All tokens below are read directly from [src/app/globals.css](../src/app/globals.css) (the single source of truth) and [src/app/layout.tsx](../src/app/layout.tsx) (font loading). This is a **single-theme, dark-only** design system by deliberate product decision — the file's own header comment states: _"Single-theme (dark) product by deliberate product decision — see plan's 'Open Items' note. No light-mode branch: tokens are defined once here."_ There is no `@media (prefers-color-scheme: light)` branch and no light-mode token set anywhere in the codebase.

---

## Color tokens

Defined as CSS custom properties on `:root` in `globals.css`, then mapped into Tailwind utilities via the `@theme inline` block (so `bg-bg`, `text-text-secondary`, `border-accent-500`, etc. all work as Tailwind classes).

### Surfaces (layered near-black)

| Token                   | Value     | Tailwind utility                  |
| ----------------------- | --------- | --------------------------------- |
| `--color-bg`            | `#060509` | `bg-bg` / `text-bg` / `border-bg` |
| `--color-bg-elevated`   | `#0d0c14` | `bg-bg-elevated`                  |
| `--color-bg-overlay`    | `#15131f` | `bg-bg-overlay`                   |
| `--color-border`        | `#221f2e` | `border-border`                   |
| `--color-border-strong` | `#332e47` | `border-border-strong`            |

### Text

| Token                    | Value     | Notes                                                                                                        |
| ------------------------ | --------- | ------------------------------------------------------------------------------------------------------------ |
| `--color-text-primary`   | `#f6f5fa` | Main body/heading text                                                                                       |
| `--color-text-secondary` | `#a9a6bf` | Secondary copy                                                                                               |
| `--color-text-muted`     | `#7a7893` | Muted/metadata text — **explicitly annotated in-file as "4.78:1 on `--color-bg` — WCAG AA for normal text"** |

### Accent (violet)

| Token                                    | Source                                                                                                                                              |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-accent-100/300/400/500/600/700` | Aliased directly to Tailwind v4's built-in `violet` OKLCH scale (`var(--color-violet-*)`) — chosen "for perceptual uniformity," per in-file comment |
| `--color-accent-glow`                    | `color-mix(in srgb, var(--color-accent-500) 35%, transparent)` — used for the soft glow under hovered cards/rows and the trailer's ambient glow     |

**To change the accent hue entirely:** either point these aliases at a different Tailwind built-in color scale, or replace the `var(--color-violet-*)` references with literal color values. There is only one accent scale for the whole site — no secondary/tertiary brand colors exist.

---

## Typography

### Font families (loaded in `src/app/layout.tsx` via `next/font/google`)

| Role      | Font           | CSS variable            | Tailwind mapping |
| --------- | -------------- | ----------------------- | ---------------- |
| Display   | Space Grotesk  | `--font-space-grotesk`  | `font-display`   |
| Body/sans | Inter          | `--font-inter`          | `font-sans`      |
| Mono      | JetBrains Mono | `--font-jetbrains-mono` | `font-mono`      |

`font-display` is used for headings/titles/hero text; `font-sans` (the Tailwind default, since `body` uses `font-sans` per `layout.tsx`) for body copy; `font-mono` for the recurring technical accents — episode numbers, tech tags, kickers, uppercase tracked labels (e.g. `text-accent-400 font-mono text-xs tracking-[0.2em] uppercase` appears as a "kicker" pattern dozens of times across pages).

### Fluid type scale (overrides Tailwind defaults, `@theme inline` block)

| Utility    | `clamp()` value                             | Line height |
| ---------- | ------------------------------------------- | ----------- |
| `text-2xl` | `clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem)` | 1.25        |
| `text-3xl` | `clamp(1.875rem, 1.6rem + 1.4vw, 2.5rem)`   | 1.2         |
| `text-4xl` | `clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem)`   | 1.1         |
| `text-5xl` | `clamp(3rem, 2.15rem + 4vw, 5rem)`          | 1.05        |
| `text-6xl` | `clamp(3.75rem, 2.5rem + 6vw, 7.5rem)`      | 1           |
| `text-7xl` | `clamp(2.75rem, 1rem + 8vw, 10rem)`         | 0.95        |

`text-7xl` is called out in-file as the **"Architectural display scale — reserved for one headline per page (Hero, page-index titles). Not for routine section headings."** Its minimum bound is deliberately sized "for an 8–9 letter word (e.g. 'DEVELOPER') to fit a 320px viewport without horizontal overflow." Interior section headings use the plain (`size="default"`) `SectionHeading`, which renders at `text-3xl`.

### Weight

No custom font-weight tokens — headings typically use Tailwind's `font-semibold`/`font-medium` utilities directly at the call site (e.g. `Hero.tsx`'s title: `font-semibold`).

---

## Spacing, borders, radius

No custom spacing scale — the codebase uses Tailwind's default spacing scale throughout (`px-6`, `py-24`, `gap-4`, `mt-20`, etc., chosen per component).

| Token         | Value      |
| ------------- | ---------- |
| `--radius-sm` | `0.375rem` |
| `--radius-md` | `0.625rem` |
| `--radius-lg` | `1rem`     |
| `--radius-xl` | `1.5rem`   |

No custom shadow tokens exist — shadows are authored as arbitrary Tailwind values referencing `--color-accent-glow` directly at the call site, e.g. `Card.tsx`: `hover:shadow-[0_20px_40px_-24px_var(--color-accent-glow)]`, and `projects/page.tsx`'s row hover: `group-hover:shadow-[0_24px_48px_-28px_var(--color-accent-glow)]`. This is the site's one recurring "glow" language — always the accent color, always soft/diffuse, always appearing only on hover.

---

## Containers & breakpoints

**No custom breakpoints are defined.** The codebase relies entirely on Tailwind v4's default breakpoint scale (`sm`/`md`/`lg`/`xl`/`2xl`). If custom breakpoints are ever needed, they would be added as `--breakpoint-*` entries in `globals.css`'s `@theme inline` block — none exist today.

**No shared container-width token exists either.** Each page picks its own max-width utility ad hoc:

| Page                        | Max width                                                  |
| --------------------------- | ---------------------------------------------------------- |
| Home sections               | `max-w-7xl` (Hero), `max-w-5xl` (FeaturedWork, TechTeaser) |
| `/about`                    | `max-w-4xl`                                                |
| `/contact`                  | `max-w-3xl`                                                |
| `/experience`               | `max-w-3xl`                                                |
| `/episodes`                 | `max-w-4xl`                                                |
| `/projects` (index)         | `max-w-6xl`                                                |
| `/projects/[slug]` (detail) | `max-w-3xl`                                                |
| `/tech`                     | `max-w-5xl`                                                |
| Header/Footer inner row     | `max-w-6xl`                                                |

This is a real inconsistency worth knowing before adding a new page — pick the closest matching page type's width rather than inventing a new one. See [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md).

---

## Z-index

No centralized z-index scale/token exists — values are literal Tailwind utilities chosen per component:

| Element                             | z-index                                   |
| ----------------------------------- | ----------------------------------------- |
| `Header` (sticky)                   | `z-40`                                    |
| `Trailer` overlay                   | `z-50` (highest in the site)              |
| Hero's `Parallax`/background layers | `-z-10`, `-z-20`                          |
| `TrailerStage` backdrop             | `-z-10` (relative to the trailer overlay) |

---

## Motion tokens (design-system side — see [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md) for usage)

Defined twice, by hand, and must be kept in sync (explicit in-file comments in both places):

**CSS** (`globals.css`):

```
--duration-micro: 150ms;   --duration-fast: 150ms;   --duration-base: 300ms;
--duration-normal: 400ms;  --duration-slow: 700ms;   --duration-cinematic: 1000ms;
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-entrance: cubic-bezier(0.16, 1, 0.3, 1);
--ease-exit: cubic-bezier(0.7, 0, 0.84, 0);
--ease-emphasis: cubic-bezier(0.19, 1, 0.22, 1);
```

**JS** (`src/lib/motion/tokens.ts`), same values as numeric seconds / bezier arrays for Framer Motion:

```
duration = { micro: 0.15, fast: 0.15, base: 0.3, normal: 0.4, slow: 0.7, cinematic: 1.0 }
ease = { standard: [0.4,0,0.2,1], entrance: [0.16,1,0.3,1], exit: [0.7,0,0.84,0], emphasis: [0.19,1,0.22,1] }
```

Semantic usage (per in-file comments): `micro`/`fast` — buttons, nav hover/press; `base` — general transitions; `normal` — standard content reveals (clip/line/stagger default); `slow` — deliberate cinematic reveals (Hero/section entrances, trailer beats); `cinematic` — the strongest moments only (hero title, trailer payoff).

---

## Hover language

One consistent hover vocabulary is reused everywhere rather than being reinvented per component:

- **Badges/tags** (`Badge.tsx`): border and text step toward the accent color, background gains a faint accent tint. Identical whether or not the badge sits inside a link.
- **Cards** (`Card.tsx`): a small upward lift (`-translate-y-1`), border steps toward `accent-500/40`, and a soft accent-colored glow appears underneath. Explicitly "restrained on purpose... no scale, no shadow you'd notice before you'd notice the content" (in-file comment).
- **Project index rows** (`app/projects/page.tsx`): the whole row lifts (`-translate-y-1`) with an absolutely-positioned hover panel behind it (border + glow), content nudges right (`translate-x-1`), and an underline draws in under the "View case study" CTA.
- **Links with an arrow affordance** ("View case study →", "See how each technology connects →"): the arrow glyph translates right on hover (`group-hover:translate-x-1`); color steps to `accent-300`.
- **`CornerBrackets`**: corner marks step from `border-strong` to `accent-400/70` only when an ancestor with the `group` class is hovered (used on the About page photo).

All hover transitions use `duration-base`/`ease-standard` (300ms, standard cubic-bezier) by convention.

---

## Button styles (`src/components/ui/Button.tsx`)

| Variant             | Style                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| `primary` (default) | Solid `bg-accent-600`, white text, `hover:bg-accent-500`, `active:bg-accent-700`                           |
| `ghost`             | Bordered (`border-border-strong`), transparent background, `hover:border-accent-400 hover:text-accent-300` |
| `link`              | No border/background — `text-accent-300`, underline on hover                                               |

All variants share: `rounded-md`, `active:scale-[0.98]` press feedback, `disabled:pointer-events-none disabled:opacity-50`. `Button` is polymorphic — renders as `<button>`, an internal `<Link>`, or an external `<a target="_blank">` depending on whether `href`/`external` props are passed.

---

## Badge/capsule styles (`src/components/ui/Badge.tsx`)

`rounded-full`, bordered, `font-mono text-xs tracking-wide uppercase`. Two tones: `default` (`border-border-strong`, `text-secondary`) and `accent` (`border-accent-600`, `bg-accent-600/10`, `text-accent-300`) — `accent` is used for "current"/highlighted states (e.g. the "Current" badge on the active experience entry, "EP 0X" episode badges).

---

## Card styles (`src/components/ui/Card.tsx`)

`border-border bg-bg-elevated border p-6`, with the hover treatment described above. Reused by `FeaturedWork` (home project teasers), `SeasonBlock` (episode project cards), and the `/dev/design-system` QA page.

---

## Decorative visual language

Consistent, deliberately abstract "systems/architecture" motifs — no logos, no literal tech iconography:

- **Grid** (`GridBackdrop`, and `TrailerStage`'s background tier): a faint `bg-grid-technical` hairline grid (56px cells, defined in `globals.css`'s utilities layer), always masked by a radial gradient so it fades toward the edges.
- **Orbital rings** (`OrbitalField`, `TrailerStage`'s midground tier): concentric circles with small pulsing "node" marks, rotating very slowly via pure CSS keyframes (`orbit-spin`).
- **Corner brackets** (`CornerBrackets`): a technical-drawing detail borrowed sparingly — metadata panels (`StatusPill`), the contact page block, and the About photo frame.

---

## Single-page QA sandbox

[src/app/dev/design-system/page.tsx](../src/app/dev/design-system/page.tsx) renders live examples of colors, typography, buttons, and badges — useful as a visual reference when changing any token above, but it is `noindex` and not linked from navigation (internal tool only).
