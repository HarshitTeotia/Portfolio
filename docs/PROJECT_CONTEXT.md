# Project Context

> This is a copy of the root [`/PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md), kept here so it's discoverable from within `/docs` as well. If the two ever diverge, the root file is canonical — update both together.

Master entry point for any developer or AI agent working on this repository. This document describes the repository **as it actually exists after the final cleanup pass** — every path, command, and fact below was verified directly against the current source. If anything here ever disagrees with the code, trust the code and update this file.

---

## 1. Project Overview

This is a personal developer portfolio: a single Next.js (App Router) application with no backend, no CMS, and no database. All content is authored as TypeScript data in `src/content/` and rendered by static/statically-generated pages. The design concept is a cinematic, "web-series" framing of a career — a career told as "seasons" and project "episodes," including a skippable animated intro sequence (the "Trailer") on the homepage.

The app builds as a **fully static export** (`output: "export"` in `next.config.ts`) and deploys to **GitHub Pages** via `.github/workflows/deploy.yml` — there is no Node server anywhere in production.

---

## 2. Current Identity

**Harshit Teotia**

- Python Developer
- Backend Engineer
- AI / Systems

(Source: `src/content/site.ts` — `name` and `identityRoles`.)

---

## 3. Design Direction

- Dark, cinematic
- Black / near-black background
- White typography
- Restrained purple (violet) accent
- Technical / editorial visual language
- Responsive (desktop-first, clean mobile experience)
- Premium / minimal — sophisticated rather than flashy

This is a deliberate **single dark theme** — there is no light mode anywhere in the codebase (see `src/app/globals.css`'s header comment).

---

## 4. Technology Stack

Only what is actually declared in `package.json` and actually used:

| Layer       | Technology                               | Version              |
| ----------- | ---------------------------------------- | -------------------- |
| Framework   | Next.js (App Router, Turbopack)          | `16.3.5`             |
| UI library  | React / React DOM                        | `19.2.8`             |
| Language    | TypeScript (strict mode)                 | `^5`                 |
| Styling     | Tailwind CSS v4 (`@tailwindcss/postcss`) | `^4`                 |
| Animation   | Framer Motion                            | `^13.3.0`            |
| Testing     | Vitest + React Testing Library + jsdom   | `^5.0.1` / `^16.3.3` |
| Linting     | ESLint + `eslint-config-next`            | `^9` / `16.3.5`      |
| Formatting  | Prettier + `prettier-plugin-tailwindcss` | `^3.9.6`             |
| Git hooks   | Husky + lint-staged                      | `^9.1.7` / `^17.5.1` |
| Node engine | —                                        | `>=20.9.0`           |

No CMS, no database, no API layer, no auth, no analytics package, no UI component library, no icon library, no state-management library, and no end-to-end testing framework are present. The dependency set has been audited and every runtime and development dependency listed in `package.json` is genuinely used — nothing is dead weight.

**Deployment target: GitHub Pages (static export).** `output: "export"` means `npm run build` writes a fully static site to `./out` — no Node server, no API routes, no server actions exist or are supported. See Section 16 for commands and the [Deployment](#deployment) section below for the full picture.

---

## 5. Repository Structure

```
.
├── .github/workflows/ci.yml     CI: install → typecheck → lint → test → build
├── .husky/pre-commit             Runs lint-staged
├── docs/                         Detailed documentation (see Section links below)
├── public/
│   └── resume/                   Empty — no resume file has been added yet
├── src/
│   ├── app/                      Routes (Next.js App Router)
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── dev/design-system/page.tsx   (internal QA page, not in nav, noindex)
│   │   ├── episodes/page.tsx
│   │   ├── experience/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── projects/[slug]/page.tsx
│   │   ├── tech/page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css           All design tokens + Tailwind entry
│   │   ├── layout.tsx            Root layout (fonts, metadata, Header/Footer)
│   │   ├── not-found.tsx         Global 404
│   │   ├── page.tsx              Home
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── decorative/           CornerBrackets, GridBackdrop, OrbitalField
│   │   ├── episodes/              SeasonBlock
│   │   ├── home/                  Hero, FeaturedWork, StatusPill, TechTeaser, WatchTrailerButton
│   │   ├── layout/                 Header, Footer, nav-items.ts
│   │   ├── motion/                 Reveal, ClipReveal, DrawLine, Stagger, Parallax, RouteTransition
│   │   ├── projects/               ArchitectureHint, ArchitectureView, ProjectLinksRow
│   │   ├── seo/                    PersonJsonLd
│   │   ├── tech/                   TechMap
│   │   ├── trailer/                Trailer, TrailerGate, TrailerStage, visuals/
│   │   └── ui/                     Button, Badge, Card, Divider, SectionHeading
│   ├── content/                   All portfolio copy/data (the single source of truth)
│   │   ├── about.ts, categories.ts, education.ts, experience.ts,
│   │   │   projects.ts, seasons.ts, site.ts, social.ts, technologies.ts,
│   │   │   trailer.ts, types.ts, content.test.ts
│   └── lib/                       cn(), content helper, site-url, motion/tokens.ts, motion/variants.ts
├── AGENTS.md                     Generic AI-agent guidance, generated by Next.js's own dev server
├── PROJECT_CONTEXT.md            The root copy of this file
├── README.md
├── package.json / package-lock.json
├── tsconfig.json, eslint.config.mjs, .prettierrc.json, postcss.config.mjs,
│   vitest.config.mts, vitest.setup.ts, next.config.ts
└── .env.example
```

There is no `.claude/` directory, no `CLAUDE.md`, and no other AI-tool-specific configuration in this repository — see Section 20.

---

## 6. Route Map

| Route                | Purpose                                                      | Source file                          | Important components                                |
| -------------------- | ------------------------------------------------------------ | ------------------------------------ | --------------------------------------------------- |
| `/`                  | Home                                                         | `src/app/page.tsx`                   | `TrailerGate`, `Hero`, `FeaturedWork`, `TechTeaser` |
| `/episodes`          | Career timeline by "season"                                  | `src/app/episodes/page.tsx`          | `SeasonBlock`                                       |
| `/projects`          | Project index                                                | `src/app/projects/page.tsx`          | `ArchitectureHint`, `Badge`, `Stagger`              |
| `/projects/[slug]`   | Project case study (statically generated for all 4 projects) | `src/app/projects/[slug]/page.tsx`   | `ArchitectureView`, `ProjectLinksRow`               |
| `/tech`              | Interactive tech ↔ project relationship map                  | `src/app/tech/page.tsx`              | `TechMap`                                           |
| `/experience`        | Work history                                                 | `src/app/experience/page.tsx`        | `Badge`, `Stagger`                                  |
| `/about`             | Bio, education, "currently building"                         | `src/app/about/page.tsx`             | `SectionHeading`, `CornerBrackets`                  |
| `/contact`           | Social/contact links                                         | `src/app/contact/page.tsx`           | `CornerBrackets`                                    |
| `/dev/design-system` | Internal visual QA sandbox — `noindex`, not in nav           | `src/app/dev/design-system/page.tsx` | `Button`, `Badge`, `Card`                           |
| `/robots.txt`        | Generated robots file                                        | `src/app/robots.ts`                  | —                                                   |
| `/sitemap.xml`       | Generated sitemap                                            | `src/app/sitemap.ts`                 | —                                                   |
| 404                  | Any unmatched route / `notFound()` calls                     | `src/app/not-found.tsx`              | `Button`, `SectionHeading`                          |

Every route is a Server Component (no `page.tsx`/`layout.tsx` has `"use client"`). Interactivity lives in leaf/mid-level Client Components. Full detail: [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 7. Component Architecture

| Group             | Directory                    | Components                                                                                                   |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Layout            | `src/components/layout/`     | `Header`, `Footer`, `nav-items.ts`                                                                           |
| Home              | `src/components/home/`       | `Hero`, `FeaturedWork`, `StatusPill`, `TechTeaser`, `WatchTrailerButton`                                     |
| Trailer           | `src/components/trailer/`    | `TrailerGate`, `Trailer`, `TrailerStage`, `visuals/CodeFragments`, `visuals/NodeChain`, `visuals/SystemBoot` |
| Motion primitives | `src/components/motion/`     | `Reveal`, `ClipReveal`, `DrawLine`, `Stagger`/`StaggerItem`, `Parallax`, `RouteTransition`                   |
| Decorative        | `src/components/decorative/` | `CornerBrackets`, `GridBackdrop`, `OrbitalField`                                                             |
| UI primitives     | `src/components/ui/`         | `Button`, `Badge`, `Card`, `SectionHeading`, `Divider`                                                       |
| Projects          | `src/components/projects/`   | `ArchitectureHint`, `ArchitectureView`, `ProjectLinksRow`                                                    |
| Tech              | `src/components/tech/`       | `TechMap`                                                                                                    |
| Episodes          | `src/components/episodes/`   | `SeasonBlock`                                                                                                |
| SEO               | `src/components/seo/`        | `PersonJsonLd`                                                                                               |

Full per-component detail (props, state, consumers, risk level): [FILE_MAP.md](FILE_MAP.md). Client/Server boundary audit: [ARCHITECTURE.md](ARCHITECTURE.md#client-server-boundary).

---

## 8. Data Sources

| Content                                  | Source of truth                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| Projects                                 | `src/content/projects.ts`                                                   |
| Experience                               | `src/content/experience.ts`                                                 |
| Tech stack                               | `src/content/technologies.ts` (+ `src/content/categories.ts` for grouping)  |
| Navigation                               | `src/components/layout/nav-items.ts`                                        |
| Trailer                                  | `src/content/trailer.ts`                                                    |
| About                                    | `src/content/about.ts` (+ `src/content/education.ts` for education entries) |
| Contact                                  | `src/content/social.ts`                                                     |
| Site identity (name/tagline/roles)       | `src/content/site.ts`                                                       |
| Seasons (career-era copy on `/episodes`) | `src/content/seasons.ts`                                                    |

All content is typed by `src/content/types.ts`. Every page/component imports directly from the specific content file it needs (e.g. `@/content/projects`) — **there is no barrel re-export file** for content. Full data-flow map: [ARCHITECTURE.md](ARCHITECTURE.md#data-architecture).

---

## 9. Project Architecture

| Name                         | Slug                         | Display order | Description source        | Technology source                                                                                 | Phase source                                                                                                                | Detail route                           |
| ---------------------------- | ---------------------------- | ------------- | ------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Vrozart Finance              | `vrozart-finance`            | 1st           | `src/content/projects.ts` | `technologies[]` field on the project object, cross-checked against `src/content/technologies.ts` | `getProjectPhase()` in `src/content/experience.ts` → Phase 03 "Real World"                                                  | `/projects/vrozart-finance`            |
| HAUT                         | `haut`                       | 2nd           | `src/content/projects.ts` | same                                                                                              | Phase 03 "Real World"                                                                                                       | `/projects/haut`                       |
| Van Sales & Distribution ERP | `van-sales-distribution-erp` | 3rd           | `src/content/projects.ts` | same                                                                                              | **None** — not listed in any `experience.ts` entry's `relatedProjectIds`; renders as "Independent Project" (freelance work) | `/projects/van-sales-distribution-erp` |
| Viblets                      | `viblets`                    | 4th           | `src/content/projects.ts` | same                                                                                              | Phase 03 "Real World"                                                                                                       | `/projects/viblets`                    |

Display order is the literal order of objects in the `projects` array in `projects.ts` — it is independent of each project's `episodeNumber`/`episodeLabel` (a separate narrative sequence used only on `/episodes`). All 4 project detail routes are statically generated (`generateStaticParams`). No project currently has a public GitHub link, a demo link, or a confirmed `outcome` — see Section 21.

---

## 10. Trailer Architecture

**Entry point:** `TrailerGate` (`src/components/trailer/TrailerGate.tsx`) wraps Home's content in `src/app/page.tsx`. It shows the Trailer either (a) automatically on a visitor's first visit this browser session (tracked via `sessionStorage["trailer-seen"]`), or (b) on demand when `WatchTrailerButton` (in the Hero) calls the `useTrailerReplay()` context function.

**Scene system:** 4 scenes defined in `src/content/trailer.ts` (`trailerScenes[]`: `boot`, `timeline`, `stack`, `identity`), each with an `hudLabel` (HUD display name), `lines` (bespoke narrative copy, where the scene needs any beyond what it reads live from other content), and `holdMs`. `src/components/trailer/Trailer.tsx` switches on `scene.id` to render each scene's visual. Deliberately scoped to these four beats and nothing else — the trailer never names a specific project; `stack` shows a generic backend shape (real tech names, no project name):

| Scene      | HUD label  | Visual                                                                                                                                                                                   | Content source                                                         |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `boot`     | Origin     | `SystemBoot` — a small linear Input → Process → System diagram (thin connecting lines, not a ring); a signal travels node to node and triggers a word-by-word headline reveal on arrival | Closing line from `trailer.ts`                                         |
| `timeline` | Building   | `CareerTimeline` — one continuous line, a signal travels it once, each year/milestone illuminates on arrival                                                                             | Live from `src/content/seasons.ts`                                     |
| `stack`    | Real World | `NodeChain` (6 nodes: Client → REST API → FastAPI → Auth/RBAC → Business Logic → PostgreSQL) + `CodeFragments` texture                                                                   | Generic backend shape, real tech names; closing line from `trailer.ts` |
| `identity` | Identity   | Violet signal sweep, then name/roles/tagline                                                                                                                                             | Live from `src/content/site.ts`                                        |

**Duration:** the sum of every scene's `holdMs` — 4000+5000+5000+5000 = 19,000ms (~19s) — or a flat `REDUCED_MOTION_HOLD_MS` (2500ms) per scene under reduced motion (~10s total).

**HUD:** `TrailerHud.tsx` — a metadata/control layer, not the main visual. Shows a "TRAILER // 01" label, one continuous progress bar (`scaleX` animated over the whole run, or a stepped bar under reduced motion) with the elapsed/total timer, a "CURRENT SEQUENCE" + active scene's `hudLabel` readout, and (desktop only) the 4-item scene list with a violet dot marking the active one — mobile shows a compact "0X / 04" counter instead (both counts are derived from `scenes.length`, not hardcoded). It owns its own `setInterval(200ms)` elapsed-time state, isolated so its tick doesn't re-render the rest of the Trailer.

**Animation:** `TrailerStage` renders a persistent backdrop (grid + orbital rings + glow) behind every scene, fading in from nothing on mount, so the sequence reads as one continuous shot; each scene has its own enter/exit character (a small scale/slide/fade variation looked up per `scene.id` in `Trailer.tsx`'s `SCENE_MOTION` table) rather than one fade repeated four times. `TrailerStage` also takes a `minimal` prop — set for `boot` and `timeline` only — that dims the grid/arcs further and drops the outermost ring, so those two scenes' own small diagrams read clearly against a much subtler backdrop; `stack` and `identity` keep the normal (or `converged`, for `identity`) backdrop unchanged. **Important:** the scene `AnimatePresence` deliberately does **not** use `mode="wait"` — with it, the animated content never becomes visible in this exact setup (verified; see [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md#technical-debt) and the code comment in `Trailer.tsx`).

**Open/close logic:** scene-advance is driven by a `useEffect` that calls `setTimeout(..., scene.holdMs)` and increments `sceneIndex`; reaching the end of `trailerScenes` calls `finish()`. `finish()` (guarded by a `finishedRef` so it only runs once) clears any pending timer, writes `sessionStorage["trailer-seen"] = "1"`, and calls the `onComplete` prop, which tells `TrailerGate` to unmount the Trailer.

**Cleanup:** every `useEffect` in `Trailer.tsx` (scene-advance timer, keyboard listener) and in `TrailerHud` (interval) returns a cleanup function; unmounting the Trailer component (a fresh mount every time it reopens) tears everything down automatically.

**Responsive behavior:** `useIsCompactViewport()` (a `matchMedia("(max-width: 640px)")` listener) reduces the `stack` scene's chain to 4 nodes.

**Reduced motion:** `useReducedMotion()` gives every scene a flat 2500ms hold (long enough to actually read the content, not a rushed flash), removes scale/slide transform offsets, and renders each visual sub-component's static (non-animated) branch.

Full step-by-step lifecycle trace: [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md#trailer-lifecycle).

---

## 11. Animation System

| Primitive                 | File                                        | Purpose                                                            |
| ------------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| `Reveal`                  | `src/components/motion/Reveal.tsx`          | Default scroll-triggered fade/slide-up (uses the `fadeUp` variant) |
| `ClipReveal`              | `src/components/motion/ClipReveal.tsx`      | "Reveal from behind a mask" for headline moments                   |
| `DrawLine`                | `src/components/motion/DrawLine.tsx`        | Self-drawing hairline divider                                      |
| `Stagger` / `StaggerItem` | `src/components/motion/Stagger.tsx`         | Staggered list entrance                                            |
| `Parallax`                | `src/components/motion/Parallax.tsx`        | Subtle scroll-linked drift (Hero background only)                  |
| `RouteTransition`         | `src/components/motion/RouteTransition.tsx` | Fade-up on route change (wraps `<main>` in root layout)            |

Shared tokens: `src/lib/motion/tokens.ts` (`duration`, `ease` — hand-synced with the CSS custom properties in `globals.css`). Shared variants: `src/lib/motion/variants.ts` (`fadeUp`, `staggerChildren()` — this is the complete current set; unused `fadeIn`/`scaleIn` variants were removed during cleanup). CSS-only keyframe animations (`orbit-spin`, `glow-drift`, `node-pulse`, `trailer-camera(-slow)`) live in `src/app/globals.css`. Every motion primitive and the Trailer respect `prefers-reduced-motion`. Full detail: [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md).

---

## 12. Design System

- **Colors:** CSS custom properties in `src/app/globals.css` (`--color-bg`, `--color-bg-elevated`, `--color-bg-overlay`, `--color-border`, `--color-border-strong`, `--color-text-primary/secondary/muted`, `--color-accent-100…700` aliased to Tailwind's built-in `violet` scale, `--color-accent-glow`).
- **Fonts:** Space Grotesk (`font-display`), Inter (`font-sans`), JetBrains Mono (`font-mono`) — loaded via `next/font/google` in `src/app/layout.tsx`.
- **Spacing:** Tailwind's default spacing scale (no custom overrides).
- **Borders/Radius:** `--radius-sm/md/lg/xl` in `globals.css`.
- **Breakpoints:** Tailwind v4 defaults (`sm`/`md`/`lg`/`xl`/`2xl`) — no custom breakpoints defined.
- **Motion tokens:** `--duration-*`/`--ease-*` in `globals.css`, mirrored by hand in `src/lib/motion/tokens.ts`.

Full detail (type scale, hover language, button/badge/card styles): [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

---

## 13. Experience

**Python Developer — Vrozart Group — May 2025 – Present**

This is the sole entry in `src/content/experience.ts` and is the actual, current content of the live site (verified directly in the source — not aspirational or placeholder). It drives: the `/experience` page, the Home page's "Currently building" status pill, the `Person` JSON-LD structured data, and the "Phase 03 — Real World" label shown on the 3 projects associated with this role (Vrozart Finance, HAUT, Viblets — Van Sales & Distribution ERP is freelance work outside this role).

---

## 14. About

Bio copy (`heroStatement`, `summary`, `whatIBuild[]`, `howIWork[]`, `engineeringFocus[]`) is controlled entirely by `src/content/about.ts`, rendered by `src/app/about/page.tsx`. The About photo is controlled by the same file's `photoSrc` field — currently `null`, which renders a placeholder box instead of an image (no photo has been supplied yet).

---

## 15. Environment Variables

| Variable               | Purpose                                                                                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Production domain, used for `metadataBase`, Open Graph tags, `sitemap.xml`, `robots.txt`, and JSON-LD absolute URLs. Falls back to `http://localhost:3000` if unset. |

This is the **only** environment variable consumed by application code. No secrets exist in this project — confirmed by a full-repository search. `.env.example` documents this variable with an empty default; real environment files (`.env`, `.env.local`, etc.) are git-ignored and none exist in this repository. In CI, it's set from an optional `SITE_URL` repository variable (see [Deployment](#deployment)).

Two more variables affect only `next.config.ts` at build time (never read by application code): `GITHUB_REPOSITORY` (auto-provided by every GitHub Actions run, drives the auto-detected `basePath`) and `BASE_PATH` (manual override).

---

## 16. Important Commands

Actual scripts from `package.json` — nothing else exists:

```bash
npm run dev            # start dev server (Turbopack)
npm run build           # static export build — writes ./out
npm run start            # serve ./out locally via `npx serve` (no Node server — next start does not work with a static export)
npm run lint              # eslint
npm run typecheck      # next typegen && tsc --noEmit
npm run test              # vitest run
npm run test:watch  # vitest watch mode
npm run format           # prettier --write .
npm run format:check  # prettier --check .
```

`npm run prepare` also exists (`husky`, used only during `npm install` to register git hooks).

**`typecheck` runs `next typegen` first, not just `tsc --noEmit`.** This Next.js version generates ambient route-prop types (`LayoutProps`, `PageProps`) into `.next/types/*.d.ts`, which `next-env.d.ts` imports unconditionally; on a genuinely clean checkout (no prior `dev`/`build`), plain `tsc --noEmit` fails with `Cannot find name 'LayoutProps'`. `next typegen` generates just those types without a full build, making `npm run typecheck` self-sufficient anywhere.

---

## 17. Source-of-Truth Map

| What I want to change | Edit this file                                                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage hero copy    | `src/content/site.ts` (layout: `src/components/home/Hero.tsx`)                                                                                                                |
| Project order         | `src/content/projects.ts` — the array's literal order                                                                                                                         |
| Project description   | `src/content/projects.ts`                                                                                                                                                     |
| Project technologies  | `src/content/technologies.ts` (`usedIn[]`) **and** the matching project's `technologies[]` in `src/content/projects.ts` (must stay symmetric — enforced by `content.test.ts`) |
| Trailer duration      | `src/content/trailer.ts` — each scene's `holdMs`                                                                                                                              |
| Trailer timer         | `TrailerHud.tsx` (reads the computed `totalMs`, no separate config)                                                                                                           |
| Trailer scenes        | `src/content/trailer.ts` (`trailerScenes[]`, incl. `hudLabel`) — and `Trailer.tsx`'s `SCENE_MOTION` table + `SceneContent()` switch if scene count/order changes              |
| Tech stack            | `src/content/technologies.ts` (+ `src/content/categories.ts` for grouping)                                                                                                    |
| Experience            | `src/content/experience.ts`                                                                                                                                                   |
| About                 | `src/content/about.ts` (+ `src/content/education.ts`)                                                                                                                         |
| Navigation            | `src/components/layout/nav-items.ts`                                                                                                                                          |
| Global colors         | `src/app/globals.css` (`:root` custom properties)                                                                                                                             |
| Typography            | `src/app/globals.css` (`@theme inline` type-scale block) + `src/app/layout.tsx` (font loaders)                                                                                |
| Background            | `src/app/globals.css` (`--color-bg*`)                                                                                                                                         |
| Motion timing         | `src/lib/motion/tokens.ts` **and** `src/app/globals.css` (hand-synced — change both)                                                                                          |

Full "if X then edit Y" table with every field: [CHANGE_GUIDE.md](CHANGE_GUIDE.md).

---

## 18. High-Impact Files

Changing these ripples across many pages — always check consumers first (see [FILE_MAP.md](FILE_MAP.md) and [CHANGE_GUIDE.md](CHANGE_GUIDE.md#change-impact-map)):

- **`src/content/projects.ts`** — feeds `/projects`, `/projects/[slug]` (×4), Home, `/about`, `/experience`, `/episodes`, `/tech`, `sitemap.ts`, and `content.test.ts`.
- **`src/content/technologies.ts`** — feeds `/tech`, Home, `/projects`, `/projects/[slug]`; must stay symmetric with `projects.ts`.
- **`src/content/experience.ts`** — feeds `/experience`, Home's status pill, JSON-LD, and every "Phase 0X" label site-wide.
- **`src/components/layout/nav-items.ts`** — the single source for both `Header` and `Footer` navigation.
- **`src/lib/motion/tokens.ts` + `src/app/globals.css` motion vars** — used by every motion primitive and the Trailer; must be changed together.
- **`src/app/globals.css` color tokens** — consumed by every component via Tailwind utility classes.
- **`src/components/ui/*`** (`Badge`, `Button`, `Card`, `SectionHeading`, `Divider`) — reused across nearly every page.

---

## 19. Common Change Workflow

1. **Identify the source-of-truth file** using Section 17 above.
2. **Read the actual current file** before editing — don't assume its shape from this document alone.
3. **Search for all consumers** (`grep`/`Grep` for the export name or import path) — see [FILE_MAP.md](FILE_MAP.md) for a starting list per file.
4. **Make the smallest change** that accomplishes the goal — don't refactor unrelated code.
5. **For content changes** (projects, experience, tech, about): edit the relevant `src/content/*.ts` file directly; run `npm run test` to catch integrity violations (duplicate ids, dangling references, missing required fields) via `content.test.ts`.
6. **For the Hero or navigation:** edit `src/content/site.ts` / `src/components/layout/nav-items.ts`; both have exactly one consumer path each (Hero; Header+Footer).
7. **For the Trailer:** edit `src/content/trailer.ts` for copy/timing/`hudLabel`; edit `src/components/trailer/Trailer.tsx` (`SCENE_MOTION` + `SceneContent()`) only for new scene visuals or if scene count changes.
8. **For animations:** reuse an existing primitive in `src/components/motion/` before writing a new one; change timing in **both** `src/lib/motion/tokens.ts` and `globals.css`.
9. **For design tokens:** edit `src/app/globals.css`; because tokens are global, check the site broadly after any change (there is no page that doesn't consume them).
10. **Validate:** `npm run typecheck && npm run lint && npm run test && npm run build`.

Full recipes (add/remove a project, change tech stack, add a page, etc.): [CHANGE_GUIDE.md](CHANGE_GUIDE.md#common-change-recipes).

---

## 20. AI Maintenance Rules

Future AI agents (of any kind — this repository is not tied to any specific AI tool) working on this codebase should:

- **Read this file first.**
- **Inspect the actual source code** before editing — this document describes the repository as of its last update; the code may have moved on.
- **Identify the source of truth** (Section 17) before changing anything.
- **Search for all consumers** of whatever is being changed.
- **Make minimal changes** — the smallest edit that accomplishes the goal.
- **Avoid unnecessary dependencies** — this project's dependency set is intentionally small and fully audited; don't add a package for something achievable with Next.js/React/Tailwind/Framer Motion.
- **Avoid duplicate components** — check `src/components/ui/` and `src/components/motion/` before creating something new.
- **Preserve accessibility** — `aria-current`, `aria-expanded`, `aria-hidden`, `role="dialog"`/`aria-modal` on the Trailer, the skip-to-content link, and focus-visible outlines are all intentional.
- **Preserve reduced-motion support** — every motion primitive and the Trailer have a `prefers-reduced-motion` branch; new animations should too.
- **Preserve responsive behavior** — check mobile nav, the Trailer's compact-viewport logic, and touch interactions before shipping a change.
- **Validate after every non-trivial change:** `npm run typecheck && npm run lint && npm run test && npm run build`.
- **Never invent content** — no fabricated metrics, client names, URLs, or technologies. This codebase uses `null` for "not supplied yet" (see `ProjectLink.url`, `SocialLink.url`, `about.photoSrc`) — preserve that convention.
- **This repository has no AI-tool-specific configuration and should stay that way** — do not add a `.claude/`, `.cursor/`, or similar tool-specific directory. `AGENTS.md` at the repo root is the one exception: it is generated by Next.js's own dev server (not by any AI tool) and is safe to leave in place.
- **Preserve the static export** — do not add anything requiring a Node server at runtime (API routes, server actions, middleware, `cookies()`/`headers()`, dynamic route segments without `generateStaticParams()`). GitHub Pages cannot run any of these. Any new metadata route (`robots.ts`/`sitemap.ts`-style) needs `export const dynamic = "force-static";` or the build fails.

---

## 21. Known Limitations

Only real, verified gaps — nothing invented:

- No project currently has a public GitHub link, a demo link, or a confirmed `outcome` (all are `null`/unset in `src/content/projects.ts`).
- No GitHub, LinkedIn, or resume link is set in `src/content/social.ts` (all `url: null`) — these render as disabled "coming soon" states in the Header, Footer, and `/contact`.
- No About-page photo has been supplied (`about.photoSrc: null`) — `/about` shows a placeholder box.
- Playwright / end-to-end testing is **not configured** — only Vitest unit/schema tests exist (16 tests total).
- Lighthouse / performance auditing is **not configured**.
- `NEXT_PUBLIC_SITE_URL` is unset by default (falls back to `localhost:3000`) — must be set before production deploy.
- No prev/next navigation between projects on `/projects/[slug]`.
- `TechMap`'s hover-driven highlight has no explicit touch/tap fallback (keyboard focus works; touch does not reliably trigger it).
- No explicit body-scroll lock while the Trailer overlay is open (not visually noticeable since the overlay is opaque and full-viewport, but technically nothing prevents background scroll).
- **Verified-harmless static-export quirk:** the browser console shows 404s for a per-route React Server Components prefetch payload (this Next.js version's static export writes it under a different path than its own client router requests). Next.js's router catches this and falls back automatically — every route was confirmed to render correctly regardless. See [ARCHITECTURE.md](ARCHITECTURE.md#static-export--github-pages).

Full detail: [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md).

---

## 22. Technical Debt

Only genuine, currently-outstanding debt (several previously-identified items — including the Trailer's old hand-synced `CHAPTER_LABELS` array, now replaced by `hudLabel` directly on each scene, and the old `systems`/`converge` scenes' `ArchitectureMorph`/`Convergence` components, removed entirely when the trailer was scoped down to Origin/Building/Real World/Identity — were resolved during earlier cleanup/redesign passes, and the RSC-prefetch 404 above is a framework quirk rather than something fixable in this codebase, so none of those are listed here as outstanding debt):

1. **Motion timing/easing constants are duplicated by hand** across `src/lib/motion/tokens.ts` (JS) and `src/app/globals.css` (CSS) — must be changed together, enforced only by comments.
2. **Site identity strings are duplicated** — `src/app/layout.tsx`'s root `<title>`/description are hardcoded literals, independent of `src/content/site.ts`. Editing `site.ts` will not update the `<title>` tag.
3. **No centralized z-index scale or container-width token** — values are chosen ad hoc per component/page.
4. **`TechMap`'s highlight interaction lacks a touch/tap fallback** (see Known Limitations).
5. **`Button.tsx`'s discriminated-union prop handling** is functionally correct but unusually verbose (explicit prop-stripping to satisfy TypeScript) — cosmetic only.
6. **`SystemBoot`'s and `CareerTimeline`'s signal-arrival delays are hand-computed constants**, each kept in sync by comment rather than a shared export (e.g. `Trailer.tsx`'s `TEXT_START` for the boot scene's headline must match `SystemBoot.tsx`'s own `SIGNAL_DELAY`/`SEGMENT_DURATION` by hand) — low severity, same category as item 1, but worth re-checking if either file's timing constants change.

Full detail and suggested fixes: [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md#technical-debt).

---

## Deployment

**Target: GitHub Pages, via GitHub Actions.** Workflow: [`../.github/workflows/deploy.yml`](../.github/workflows/deploy.yml). Full technical detail (exact `next.config.ts` settings, why each is needed, and everything verified): [ARCHITECTURE.md § Static export / GitHub Pages](ARCHITECTURE.md#11-static-export--github-pages).

**One-time setup on a new repo/fork:**

1. Settings → Pages → Source → **GitHub Actions**.
2. (Recommended) Settings → Secrets and variables → Actions → Variables → add `SITE_URL` = the site's real published URL. Without it, deployed metadata/sitemap/OG tags fall back to `localhost:3000`.
3. Push to `main`, or run the workflow manually from the Actions tab.

**What happens automatically, and needs no manual editing:**

- The GitHub Pages base path (`/` for a `<owner>.github.io` repo, `/<repo-name>/` for any other repo name) is derived from `GITHUB_REPOSITORY` inside `next.config.ts`.
- Typecheck, lint, and test all run before the build; a failing one blocks deployment.
- A `.nojekyll` marker is added to the build output so GitHub Pages doesn't apply Jekyll processing (which would otherwise ignore the `_next/` assets directory).

## Detailed documents

| Document                                     | Covers                                                                                                                           |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [ARCHITECTURE.md](ARCHITECTURE.md)           | Full route map, component architecture, data architecture, client/server boundary audit, config, dependencies, env vars, testing |
| [FILE_MAP.md](FILE_MAP.md)                   | Every source file: role, used-by, depends-on, modification risk                                                                  |
| [CHANGE_GUIDE.md](CHANGE_GUIDE.md)           | "If you want to change X, edit Y" table, change-impact map, safe-editing rules, common change recipes                            |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)         | Colors, typography, spacing, radius, breakpoints, motion tokens, component visual language                                       |
| [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md)   | Every motion primitive, the full Trailer lifecycle, reduced-motion handling                                                      |
| [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) | Real, code-verified limitations and technical debt                                                                               |
