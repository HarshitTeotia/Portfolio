# ARCHITECTURE.md

Everything in this document is derived from reading the actual source in this repository. Where something common in Next.js projects does _not_ exist here (a CMS, an API layer, a database, Playwright, dark/light theming), that is stated explicitly rather than assumed.

---

## 1. Overall architecture

This is a **fully static, content-driven Next.js App Router site**. There is:

- No database, no CMS, no external data fetching at runtime.
- No API routes (`src/app/api/` does not exist).
- No server actions found in the codebase.
- All "data" is TypeScript literals in `src/content/*.ts`, imported at build/render time.
- All 4 project detail pages are pre-rendered at build time via `generateStaticParams` (confirmed by `npm run build` output: `● /projects/vrozart-finance`, `haut`, `van-sales-distribution-erp`, `viblets` — all SSG).
- Every other route is fully static (`○` in the build output).

The rendering model is **Server Components by default, Client Components only where interactivity/browser APIs are required** — see [Client/Server boundary](#client-server-boundary) below.

---

## 2. Route map

Confirmed against `npm run build` output (17 routes generated) and each `page.tsx`'s actual contents.

### `/` — Home

**File:** `src/app/page.tsx`
Server Component. Renders `<TrailerGate>` (client) wrapping `<Hero />`, `<FeaturedWork />`, `<TechTeaser />` (all Server Components).

- **Data sources:** `src/content/site.ts` (Hero), `src/content/projects.ts` + `technologies.ts` + `experience.ts` (FeaturedWork), `src/content/technologies.ts` (TechTeaser), `src/content/experience.ts` (StatusPill, inside Hero).
- **Client components used:** `TrailerGate`, `WatchTrailerButton` (inside Hero), the `Reveal`/`ClipReveal`/`Parallax` motion primitives, `Trailer` (mounted conditionally by `TrailerGate`).
- **Animation:** page-load stagger sequence in Hero (`Reveal` with hand-tuned delays 0.1s→0.75s), full cinematic trailer overlay on first visit.
- **Links:** to every project (`/projects/[slug]`), `/projects`, `/tech`.

### `/episodes`

**File:** `src/app/episodes/page.tsx`
Server Component. Renders `SeasonBlock` for each entry in `src/content/seasons.ts`; the `s03` (current, "The Real World") season is given all 4 projects as `projectEpisodes` — **all four projects are hardcoded to season `s03`** in this page (`const s03ProjectEpisodes = projects`), not derived from any per-project season field.

- **Data sources:** `src/content/seasons.ts`, `src/content/projects.ts`.
- **Client components used:** none directly in the page; `SeasonBlock` composes `Stagger`/`StaggerItem`/`DrawLine` (client) with `Card`/`Badge` (server).

### `/projects`

**File:** `src/app/projects/page.tsx`
Server Component. Full project index — alternating left/right rows (`index % 2 === 1` reverses flex direction), each row showing project number, positioning, title, theme, an `ArchitectureHint` one-liner, career phase, first 5 technologies, and a "View case study" CTA.

- **Data sources:** `src/content/projects.ts`, `getTechnology()` from `technologies.ts`, `getProjectPhase()` from `experience.ts`.
- **Client components used:** `Stagger`/`StaggerItem` (row entrance choreography), `ArchitectureHint` is itself a plain Server Component.

### `/projects/[slug]` — dynamic route

**File:** `src/app/projects/[slug]/page.tsx`
Server Component (`async function`, awaits `props.params`).

- **Slug resolution:** `getProjectBySlug(slug)` (`src/content/projects.ts`) — a plain `Array.find` by `project.slug`.
- **Static generation:** `generateStaticParams()` returns `{ slug }` for all 4 projects — Next.js pre-renders all of them at build time.
- **Invalid slug handling:** if `getProjectBySlug` returns `undefined`, the page calls `notFound()` from `next/navigation`, which renders `src/app/not-found.tsx`.
- **Metadata:** `generateMetadata()` builds a per-project `<title>`/description from `project.title`/`positioning`/`theme`; returns `{}` (no override) for an unknown slug.
- **Navigation between projects:** there is **no "next/previous project" navigation** on this page — only a "← All projects" link back to `/projects`. (See Known Limitations.)
- **Sections rendered, in order:** back-link → header (project number, episode title, title, positioning, role, phase) → Problem → Solution → Architecture (`ArchitectureView`) → Technology badges → Highlights → Challenges (conditional on non-empty array) → Outcome (conditional on `project.outcome` being set — currently `undefined` for all 4 projects) → `ProjectLinksRow`.

### `/tech`

**File:** `src/app/tech/page.tsx`
Server Component wrapping the client `<TechMap />` in a `<Reveal>`.

- **Data sources:** `src/content/technologies.ts`, `src/content/categories.ts`, `src/content/projects.ts`.
- **Interaction:** hover/focus a technology → highlights the projects using it (and vice versa) via local `useState` in `TechMap` — no routing involved in the highlight itself, only the final click-through links to `/projects/[slug]`.

### `/experience`

**File:** `src/app/experience/page.tsx`
Server Component. Iterates `src/content/experience.ts` (currently one entry), rendering date → company/role → summary → responsibilities → related projects (as `Badge` links) per entry, each with its own `Stagger` choreography and a hover-responsive left timeline rail.

### `/about`

**File:** `src/app/about/page.tsx`
Server Component. Renders `about.ts` (hero statement, summary, "What I Build", "How I Work", "Engineering Focus" tag cloud), a photo slot (placeholder box if `about.photoSrc` is `null`, which it currently is), the live `projects` list ("Currently Building Across"), and `education.ts` entries. Ends with a link to `/episodes`.

### `/contact`

**File:** `src/app/contact/page.tsx`
Server Component. Renders a 2-column grid of `socialLinks` (`src/content/social.ts`) — each with a real `url` renders as a link; each with `url: null` renders a disabled "Coming soon" tile.

### `/dev/design-system`

**File:** `src/app/dev/design-system/page.tsx`
Server Component. Internal-only visual QA page for design tokens/primitives (colors, typography, buttons, badges, card). `export const metadata = { robots: { index: false, follow: false } }`. **Not present in `nav-items.ts`** — reachable only by direct URL. `robots.ts` also explicitly disallows `/dev/` for crawlers.

### `/robots.txt`, `/sitemap.xml`

**Files:** `src/app/robots.ts`, `src/app/sitemap.ts`
`robots.ts`: allows `/`, disallows `/dev/`, points to `${siteUrl}/sitemap.xml`.
`sitemap.ts`: static routes list (`""`, `/episodes`, `/projects`, `/tech`, `/experience`, `/about`, `/contact` — **note: `/dev/design-system` and `/contact` are both in the sitemap; `/dev/design-system` is not, consistent with robots.ts**) plus one entry per project slug. `lastModified` is `new Date()` (build time), not tracked per-content-change.

### 404 — `not-found.tsx`

**File:** `src/app/not-found.tsx`
Server Component. Shown for any unmatched route and for `notFound()` calls (e.g. an invalid project slug). "Episode not found" copy fits the web-series theme; CTAs to `/` and `/projects`.

### Root layout

**File:** `src/app/layout.tsx`
Wraps every route: loads 3 Google fonts (`Space_Grotesk`, `Inter`, `JetBrains_Mono`) via `next/font/google`, defines root `<Metadata>` (title/description — **hardcoded strings, not sourced from `content/site.ts`**, see Known Limitations), renders `<PersonJsonLd />`, a skip-to-content link, `<Header />`, `<main>` (wrapped in `<RouteTransition>`), and `<Footer />`.

---

## 3. Component architecture

Grouped exactly as they exist in `src/components/`:

| Group                        | Directory                    | Components                                                                                                   |
| ---------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Layout                       | `src/components/layout/`     | `Header`, `Footer`, `nav-items.ts` (data, not a component)                                                   |
| Home                         | `src/components/home/`       | `Hero`, `FeaturedWork`, `StatusPill`, `TechTeaser`, `WatchTrailerButton`                                     |
| Trailer                      | `src/components/trailer/`    | `TrailerGate`, `Trailer`, `TrailerStage`, `visuals/CodeFragments`, `visuals/NodeChain`, `visuals/SystemBoot` |
| Motion (reusable primitives) | `src/components/motion/`     | `Reveal`, `ClipReveal`, `DrawLine`, `Stagger`/`StaggerItem`, `Parallax`, `RouteTransition`                   |
| Decorative                   | `src/components/decorative/` | `CornerBrackets`, `GridBackdrop`, `OrbitalField`                                                             |
| UI primitives                | `src/components/ui/`         | `Button`, `Badge`, `Card`, `SectionHeading`, `Divider`                                                       |
| Projects                     | `src/components/projects/`   | `ArchitectureHint`, `ArchitectureView`, `ProjectLinksRow`                                                    |
| Tech                         | `src/components/tech/`       | `TechMap`                                                                                                    |
| Episodes                     | `src/components/episodes/`   | `SeasonBlock`                                                                                                |
| SEO                          | `src/components/seo/`        | `PersonJsonLd`                                                                                               |

There is no "Hero" _directory_ — Hero is a single file in `home/`. There is no separate "Navigation" component beyond `Header`/`Footer` themselves. Detailed per-component notes (props, state, safe-to-modify) are in [FILE_MAP.md](FILE_MAP.md).

---

## 4. Data architecture

### Content type system

`src/content/types.ts` defines every content shape (`Project`, `ExperienceEntry`, `Technology`, `Season`, `EducationEntry`, `SocialLink`, `TrailerScene`, and the `ProjectArchitecture` union: `pipeline | modules | evidence`). This file contains **no copy**, only shapes — a documented convention ("PLACEHOLDER CONVENTION": unset facts are typed `string | null` and rendered as an absence, never a fabricated value).

### Single-source-of-truth map

```
src/content/projects.ts (projects[])
  ├─→ /projects (index)
  ├─→ /projects/[slug] (detail, via getProjectBySlug)
  ├─→ Home → FeaturedWork (all 4, as teaser cards)
  ├─→ /about → "Currently Building Across" list
  ├─→ /experience → relatedProjects per entry
  ├─→ /episodes → SeasonBlock (s03 only, hardcoded in episodes/page.tsx)
  ├─→ /tech → TechMap (project panel + tech↔project graph)
  ├─→ sitemap.ts → one sitemap entry per project slug
  └─→ content.test.ts → schema/integrity tests

src/content/technologies.ts (technologies[]) + categories.ts (grouping)
  ├─→ /tech → TechMap (grouped by category)
  ├─→ Home → TechTeaser (all techs) + FeaturedWork (first 4 per project)
  ├─→ /projects, /projects/[slug] → tech badges (via getTechnology())
  └─→ content.test.ts → symmetry check against projects.ts (usedIn ⇄ technologies arrays must agree both ways)

src/content/experience.ts (experience[] + getProjectPhase())
  ├─→ /experience (main timeline)
  ├─→ Home → StatusPill (finds the entry with current: true)
  ├─→ PersonJsonLd → jobTitle / worksFor
  └─→ /projects, /projects/[slug], Home→FeaturedWork → "PHASE 0X — LABEL" badge via getProjectPhase(project.id)

src/content/about.ts (about{}) ──→ /about only
src/content/education.ts (education[]) ──→ /about only (loosely cross-referenced to seasons.ts via seasonId, but not rendered together)
src/content/seasons.ts (seasons[]) ──→ /episodes only
src/content/trailer.ts (trailerScenes[]) ──→ Trailer.tsx only (switched on scene.id)
src/content/social.ts (socialLinks[]) ──→ Footer, /contact, Header (resume link only)
src/content/site.ts (site{}) ──→ Hero, Header, Footer, /about, Trailer (title scene + aria-label), PersonJsonLd
                                    NOTE: does NOT feed the root <title>/description in layout.tsx (see Known Limitations)
src/components/layout/nav-items.ts (navItems[]) ──→ Header + Footer (the only two consumers)
```

There is **no barrel re-export file** for content — every consumer imports directly from the specific submodule it needs (e.g. `@/content/projects`, `@/content/technologies`). An earlier `src/content/index.ts` barrel that re-exported everything was removed during cleanup because nothing imported from it; if you add a new content file, import it directly by path rather than reintroducing a barrel.

### Project architecture (Phase 5 detail)

| Project                      | `id` / `slug`                                  | Array order | `episodeNumber` / label | `architecture.kind`                                                                       | Career phase source                                                                                                                                                             |
| ---------------------------- | ---------------------------------------------- | ----------- | ----------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vrozart Finance              | `vrozart-finance` / `vrozart-finance`          | 1st         | 6 / `EP 06`             | `pipeline` (7 steps: intake→OCR→chunking→embeddings→vector storage→similarity search→RAG) | Phase 03 "Real World" (via `experience.ts` → `relatedProjectIds`)                                                                                                               |
| HAUT                         | `haut` / `haut`                                | 2nd         | 5 / `EP 05`             | `modules` (6 groups + a 4-step `requestFlow`)                                             | Phase 03 "Real World"                                                                                                                                                           |
| Van Sales & Distribution ERP | `van-sales-erp` / `van-sales-distribution-erp` | 3rd         | 7 / `EP 07`             | `evidence` (5 metrics + a 5-step `requestFlow`)                                           | **`null`** — not in any `experience.ts` entry's `relatedProjectIds`; renders as "Independent Project" (this is a freelance project per `role: "Backend Developer (freelance)"`) |
| Viblets                      | `viblets` / `viblets`                          | 4th         | 4 / `EP 04`             | `pipeline` (7 steps)                                                                      | Phase 03 "Real World"                                                                                                                                                           |

**Display order vs. episode order:** the `projects` array order (1st–4th above) drives every "Project 01/02/03/04" label in the UI (`/projects`, `/projects/[slug]` header, `/about`). `episodeNumber`/`episodeLabel` (`EP 04`–`EP 07`) is a _separate_, intentionally non-renumbered narrative sequence used only on `/episodes` and each project's `episodeTitle`/`episodeLabel` display. **Changing one does not change the other** — see [CHANGE_GUIDE.md](CHANGE_GUIDE.md).

Every project's `links.github` is `{ url: null, isPrivate: true }` — no project currently has a public repo link or a `links.demo` entry at all.

---

## 5. Client/Server boundary

**Every `page.tsx` and `layout.tsx` is a Server Component.** No page-level file contains `"use client"`.

### Client Component audit

| Component                                                                                                          | Reason it's a Client Component                                                                                         | Key dependencies                   | Could become Server?                                                                                                                                                                           | Risk if changed                            |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `Header.tsx`                                                                                                       | `usePathname`, `useState` (scroll/menu), `useEffect` (scroll listener), `useReducedMotion`, `AnimatePresence`/`motion` | `next/navigation`, `framer-motion` | No — active-route highlighting and the mobile menu need client state                                                                                                                           | High — used on every page                  |
| `WatchTrailerButton.tsx`                                                                                           | Consumes `useTrailerReplay()` context, `onClick`                                                                       | React context                      | No                                                                                                                                                                                             | Low — single call site (Hero)              |
| `TrailerGate.tsx`                                                                                                  | `useState`, `useSyncExternalStore` (reads `sessionStorage`), provides React Context                                    | React internals                    | No — must run client-side to read session state                                                                                                                                                | High — gates the entire trailer feature    |
| `Trailer.tsx`                                                                                                      | `useState`/`useEffect`/`useRef`, `createPortal`, timers, keyboard listener, Framer Motion                              | `react-dom`, `framer-motion`       | No                                                                                                                                                                                             | High — the whole intro sequence            |
| `TrailerStage.tsx`                                                                                                 | Marked `"use client"` but contains **no hooks, state, or browser APIs** — pure JSX + `cn()`                            | `cn()` only                        | **Yes, technically** — but it's only ever rendered from within the already-client `Trailer.tsx`, so removing the directive changes nothing observable. Flagged per instructions, not modified. | Low                                        |
| `CodeFragments.tsx`, `NodeChain.tsx`, `SystemBoot.tsx`                                                             | Use Framer Motion (`motion.span`/`motion.div`/`motion.circle`) in their non-reduced-motion branch                      | `framer-motion`                    | No                                                                                                                                                                                             | Low–Medium — trailer visuals only          |
| `Reveal.tsx`, `ClipReveal.tsx`, `DrawLine.tsx`, `Stagger.tsx`/`StaggerItem`, `Divider.tsx`, `ArchitectureView.tsx` | `useReducedMotion` + Framer Motion `whileInView`/`animate`                                                             | `framer-motion`                    | No                                                                                                                                                                                             | **High** — reused across nearly every page |
| `Parallax.tsx`                                                                                                     | `useScroll`/`useTransform`/`useRef` (scroll-linked motion values)                                                      | `framer-motion`                    | No                                                                                                                                                                                             | Medium — Hero background only              |
| `RouteTransition.tsx`                                                                                              | `usePathname`, Framer Motion                                                                                           | `next/navigation`, `framer-motion` | No                                                                                                                                                                                             | High — wraps `{children}` in root layout   |
| `TechMap.tsx`                                                                                                      | `useState` (hover/focus highlight), mouse/focus event handlers                                                         | React state                        | No                                                                                                                                                                                             | Medium — `/tech` page only                 |

**Everything else is a Server Component**, including: `Footer`, `Hero`, `FeaturedWork`, `StatusPill`, `TechTeaser`, `CornerBrackets`, `GridBackdrop`, `OrbitalField` (pure CSS animation, no JS needed), `Badge`, `Button`, `Card`, `SectionHeading`, `ArchitectureHint`, `ProjectLinksRow`, `SeasonBlock`, `PersonJsonLd`, and every `page.tsx`/`layout.tsx`.

No unnecessary Client Components were found beyond the `TrailerStage` note above.

---

## 6. Testing architecture

| File                                    | Tests                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Run with       |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `src/content/content.test.ts`           | Schema/integrity tests: unique project ids/slugs/episode numbers; every project's `technologies` reference a real `Technology`; required narrative fields non-empty; no project has both a GitHub URL and `isPrivate: true`; every technology traces to ≥1 real project (no orphan buzzwords); the tech↔project graph is symmetric both directions; season ids/codes unique with non-empty story; experience `relatedProjectIds` reference real projects; at most one `current: true` experience entry; education `seasonId` references a real season; email social link is a real `mailto:`; all other social links are `null` or a real non-empty string | `npm run test` |
| `src/components/layout/Header.test.tsx` | Renders every nav item; marks the current route via `aria-current="page"`; mobile menu toggle starts closed (`aria-expanded="false"`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `npm run test` |

Total: **2 test files, 16 tests** (verified: `npm run test` → "Test Files 2 passed (2)", "Tests 16 passed (16)").

**Playwright / end-to-end testing: NOT CONFIGURED.** No `playwright.config.ts`, no e2e directory exists.
**Lighthouse / performance auditing: NOT CONFIGURED.** No Lighthouse config or CI step exists.

Other validation commands:

```bash
npm run typecheck   # next typegen && tsc --noEmit — verified clean
npm run lint        # eslint — verified clean
npm run build       # next build — verified: 17 routes generated successfully, exported to ./out
```

---

## 7. Configuration

| File                           | Purpose                                     | Notable settings                                                                                                                                                                   | What breaks if changed carelessly                                                                               |
| ------------------------------ | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `package.json`                 | Scripts, dependencies, `lint-staged` config | `engines.node >= 20.9.0`; `lint-staged` runs ESLint+Prettier on `.ts/.tsx`, Prettier only on `.js/.jsx/.mjs/.json/.css/.md`                                                        | Removing a script breaks CI (`ci.yml` calls `typecheck`/`lint`/`test`/`build` by name)                          |
| `next.config.ts`               | Next.js config                              | `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`, and an auto-detected `basePath` — see [Static export / GitHub Pages](#11-static-export--github-pages) below | Removing `output: "export"` would make `next build` produce a server build again, which GitHub Pages cannot run |
| `tsconfig.json`                | TypeScript compiler config                  | `strict: true`; path alias `@/* → ./src/*`; `moduleResolution: "bundler"`; includes `.next/types/**`                                                                               | Breaking the `@/*` alias breaks nearly every import in the codebase                                             |
| `eslint.config.mjs`            | Lint rules                                  | Extends `eslint-config-next` (`core-web-vitals` + `typescript`); ignores `.next/`, `out/`, `build/`, `next-env.d.ts`                                                               | Loosening this could let Next.js/React rule violations (e.g. missing `key`, `<img>` vs `<Image>`) slip into CI  |
| `.prettierrc.json`             | Formatting                                  | `printWidth: 90`, double quotes, semicolons, `es5` trailing commas, `prettier-plugin-tailwindcss` (auto-sorts Tailwind classes)                                                    | Removing the Tailwind plugin will stop auto-sorting class order on format (cosmetic only)                       |
| `postcss.config.mjs`           | PostCSS pipeline                            | Single plugin: `@tailwindcss/postcss` (Tailwind v4's PostCSS integration)                                                                                                          | Removing this plugin breaks all Tailwind compilation                                                            |
| `vitest.config.mts`            | Test runner config                          | `environment: "jsdom"`, `globals: true`, `setupFiles: ["./vitest.setup.ts"]`, same `@/*` alias as tsconfig, `@vitejs/plugin-react`                                                 | Misaligning the alias here vs. `tsconfig.json` breaks test imports                                              |
| `vitest.setup.ts`              | Test setup                                  | Imports `@testing-library/jest-dom/vitest` (adds DOM matchers like `toHaveAttribute`)                                                                                              | Removing it breaks `Header.test.tsx`'s `toHaveAttribute` assertion                                              |
| `.husky/pre-commit`            | Git hook                                    | Runs `npx lint-staged`                                                                                                                                                             | Bypassing/removing lets unformatted/unlinted code get committed                                                 |
| `.github/workflows/ci.yml`     | CI pipeline                                 | On push/PR to `main`: install → typecheck → lint → test → build, Node 20                                                                                                           | This is the authoritative definition of "passing" for this repo                                                 |
| `.github/workflows/deploy.yml` | GitHub Pages deployment                     | On push to `main` (or manual dispatch): typecheck → lint → test → build → upload → deploy, via the official `actions/upload-pages-artifact`/`actions/deploy-pages` Pages flow      | See [Static export / GitHub Pages](#11-static-export--github-pages)                                             |
| `.env.example`                 | Documents the one env var                   | `NEXT_PUBLIC_SITE_URL` (empty by default)                                                                                                                                          | See Environment Variables below                                                                                 |

This repository has no tool-specific IDE/AI-agent configuration (an earlier `.claude/` directory used only for local dev-server previewing was removed during cleanup — it was never required to run, build, or test the app). See [Section 10](#10-notes-on-agentsmd) for the one AI-agent-related file that remains and why.

---

## 8. Dependencies

### Runtime

| Package              | Version   | Purpose                 | Used where                                                                                     |
| -------------------- | --------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `next`               | `16.3.5`  | Framework/router/build  | Everywhere                                                                                     |
| `react`, `react-dom` | `19.2.8`  | UI runtime              | Everywhere                                                                                     |
| `framer-motion`      | `^13.3.0` | All JS-driven animation | `src/components/motion/*`, `src/components/trailer/*`, `Header`, `ArchitectureView`, `Divider` |

All three are load-bearing — none is safe to remove without replacing the feature it powers.

### Development

| Package                                                                                          | Purpose                         | Safe to remove?                                                     |
| ------------------------------------------------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------------- |
| `typescript`, `@types/*`                                                                         | Type checking                   | No — strict mode is load-bearing across the codebase                |
| `tailwindcss`, `@tailwindcss/postcss`                                                            | Styling                         | No — the entire visual system is Tailwind utility classes           |
| `eslint`, `eslint-config-next`                                                                   | Linting, enforced in CI         | No — CI will fail without it                                        |
| `prettier`, `prettier-plugin-tailwindcss`                                                        | Formatting, enforced pre-commit | No — pre-commit hook depends on it                                  |
| `husky`, `lint-staged`                                                                           | Git hook infrastructure         | No, unless the team explicitly wants to drop pre-commit enforcement |
| `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` | Test infrastructure             | No — 16 tests depend on this stack                                  |

This is documentation only — no dependency was removed or added as part of this analysis.

---

## 9. Environment variables

| Variable               | Where used                                                                                                                                                  | Purpose                                                                                            | Public/Server                                                 | Required?                                                                                           | Safe example                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `src/lib/site-url.ts` → consumed by `src/app/layout.tsx` (`metadataBase`), `src/app/robots.ts`, `src/app/sitemap.ts`, `src/components/seo/PersonJsonLd.tsx` | The canonical production domain, used for absolute URLs in metadata/OG tags/sitemap/robots/JSON-LD | **Public** (`NEXT_PUBLIC_` prefix — bundled into client code) | Optional in dev (falls back to `http://localhost:3000`); **should be set before production deploy** | `https://harshitteotia.dev` |

This is the **only** environment variable used anywhere in the codebase (confirmed by inspecting every `process.env` reference). No secrets exist in this project. `.env.example` documents this variable with no default value; `.env.local` is git-ignored.

In the GitHub Pages deployment (`.github/workflows/deploy.yml`), this is set from an optional repository variable named `SITE_URL` (Settings → Secrets and variables → Actions → Variables) — the workflow only injects it if that variable is non-empty, so an unconfigured deploy still builds successfully (with the `localhost:3000` fallback in its metadata) rather than failing.

Two build-time-only variables (not consumed by application code, only by `next.config.ts`) also affect the static export:

| Variable            | Purpose                                                                                                                                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_REPOSITORY` | Automatically provided by every GitHub Actions run (`owner/repo`); used to auto-derive `basePath` (see [Section 11](#11-static-export--github-pages)). Not set locally, so local builds always use an empty `basePath`. |
| `BASE_PATH`         | Manual override for `basePath`, e.g. for a custom domain on a repo not named `<owner>.github.io`. Empty string is a valid, meaningful override (root path).                                                             |

---

## 10. Notes on `AGENTS.md`

This repository is independent of any specific AI coding tool — no application code, build step, test, or CI job reads or requires an AI assistant. The repository intentionally has **no** Claude-specific configuration (a `.claude/` directory and a `CLAUDE.md` file were both removed during cleanup; they existed only for one contributor's local editor tooling and were never referenced by anything else in the repo).

`AGENTS.md` at the repository root is the one exception worth explaining, because it looks similar but is not the same kind of file: it is written by **Next.js's own dev server** (`node_modules/next/dist/server/lib/generate-agent-files.js` in the installed `next` package), not by any AI tool's configuration. It documents that this Next.js version may differ from an AI agent's training data and points to `node_modules/next/dist/docs/` for the authoritative reference — generic guidance useful to _any_ AI coding assistant (or human) working on this codebase, not a Claude-specific artifact. Next.js re-creates it automatically the next time `npm run dev` runs, so it is left in place rather than deleted (deleting it has no lasting effect).

---

## 11. Static export / GitHub Pages

The app is configured (`next.config.ts`) to build as a fully static site, deployable to any static host, with GitHub Pages as the target. This required real changes verified against this exact installed Next.js version's own docs and behavior — not assumed from general Next.js knowledge, per the caveat in `AGENTS.md`.

### `next.config.ts`

| Setting              | Value                                                                                                      | Why                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `output`             | `"export"`                                                                                                 | GitHub Pages only serves static files — there is no Node server to run Next's default request-time renderer. Verified against `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`.                                                                                                                                                                                                                                                                                                                                                                                                     |
| `trailingSlash`      | `true`                                                                                                     | Static export writes `<route>/index.html` instead of `<route>.html` — the layout static hosts (including GitHub Pages) resolve most reliably, since a directory request naturally serves its `index.html`. Verified this doesn't change any rendered UI — `next/link` automatically rewrites every internal `href` to match (confirmed by inspecting the built HTML: `/about` renders as `href="/about/"` with zero code changes to `nav-items.ts` or any component).                                                                                                                               |
| `images.unoptimized` | `true`                                                                                                     | GitHub Pages has no image-optimization endpoint to call at request time; `next/image` (used in `src/app/about/page.tsx`, currently inert since `about.photoSrc` is `null`) falls back to serving the original file byte-for-byte. Required — `output: "export"` throws a build error with the default image loader.                                                                                                                                                                                                                                                                                 |
| `basePath`           | Auto-derived from `process.env.GITHUB_REPOSITORY` (format `owner/repo`, always provided by GitHub Actions) | GitHub Pages serves a **user/org page** (repo named `<owner>.github.io`) at the domain root, but a **project page** (any other repo name) under `/<repo-name>/`. The logic in `next.config.ts` picks the right one automatically — empirically verified both cases by simulating `GITHUB_REPOSITORY` locally and inspecting the generated HTML's `href`/`src` attributes for the correct prefix (or its absence). An explicit `BASE_PATH` env var overrides the auto-detection (e.g. for a custom domain on a non-`.github.io`-named repo, which should serve from the root despite the repo name). |

`assetPrefix` is deliberately **not** set — Next's own docs explicitly recommend `basePath` over `assetPrefix` for sub-path hosting ("We do not suggest you use a custom Asset Prefix for this use case").

### Metadata routes require `force-static` in this Next.js version

`src/app/robots.ts` and `src/app/sitemap.ts` each export `export const dynamic = "force-static";`. Without it, `next build` with `output: "export"` fails outright: `"export const dynamic = 'force-static'/export const revalidate not configured on route ... with 'output: export'"`. This is a real, verified requirement of this specific Next.js version — discovered by actually running the export build, not assumed.

### `sitemap.ts` trailing slashes

Because `trailingSlash: true` changes the actual served path for every route, `src/app/sitemap.ts`'s URLs were updated to match (`/about` → `/about/`, `/projects/haut` → `/projects/haut/`) so the sitemap doesn't advertise a URL that differs from what's actually served.

### `next typecheck` requires `next typegen` first

Unrelated to static export itself, but discovered while validating this work: `tsc --noEmit` alone fails on a genuinely clean checkout (no prior `dev`/`build`) with `Cannot find name 'LayoutProps'`/`'PageProps'` — these are ambient types Next.js generates into `.next/types/*.d.ts`, and `next-env.d.ts` imports them unconditionally. This Next.js version ships a dedicated `next typegen` command ("Generate TypeScript definitions for routes, pages, and layouts without running a full build") specifically for this. `package.json`'s `typecheck` script is now `"next typegen && tsc --noEmit"`, making it self-sufficient in CI and on a fresh clone. (Previously this only appeared to work because a stale `.next/` from an earlier `build`/`dev` was always present locally — verified by deliberately clearing `.next/` before typechecking.)

### Documentation is excluded from Tailwind's content scan

Tailwind v4 auto-detects content sources by scanning essentially every non-ignored project file for class-name-shaped text — including prose inside `.md` files, not just `.tsx`/`.css`. This repo's own documentation quotes real utility classes (e.g. `duration-[var(--duration-cinematic)]`) and describes token groups with a wildcard shorthand (`--duration-*`), which the scanner misread as a literal, malformed arbitrary-value utility candidate — producing invalid generated CSS (`Unexpected token Delim('*')`). This was **not cosmetic**: in `next build` it surfaced only as a tolerated warning, but in `next dev` the identical parse failure was a hard error (`GET / 500` on every route). `src/app/globals.css` now excludes documentation from the scan:

```css
@source not "../../*.md";
@source not "../../docs/**/*";
```

Verified by reproducing the failure with the docs present, confirming it disappeared with them moved aside, then confirming it stays fixed with the docs restored and the `@source not` exclusion in place — both `next build` (zero warnings) and `next dev` (`GET / 200`, no console errors).

### Known, verified-harmless static-export quirk: RSC segment-prefetch 404s

With the static export served by any plain static file server (verified locally with `serve`, which behaves the same way GitHub Pages does — no server-side rewrites), the browser's Network tab shows 404s for requests like `/projects/__next.projects.__PAGE__.txt` — a per-route-segment React Server Components prefetch payload that this Next.js version's static export doesn't write to disk under the exact filename its own client router requests (the file is written nested, e.g. `__next.projects/__PAGE__.txt`; the router requests it flat, dot-joined). This reproduces identically regardless of `trailingSlash`, confirming it isn't caused by this repo's config.

**This does not break navigation.** Next.js's router explicitly catches the failed fetch, logs `"Failed to fetch RSC payload for <url>. Falling back to browser navigation."`, and falls back to fetching the full route's `index.txt`/`<route>.txt` RSC payload (or, if needed, a real browser navigation), which always succeeds — verified by clicking through every nav link and confirming every destination renders complete, correct content every time. The only user-visible cost is a console error (visible to developers, not typical visitors) and a marginally slower transition for the affected navigation. See [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md).

### Verification performed

- `next build` produces `out/` with all 17 routes (`index.html` per route under `trailingSlash: true`, plus `404.html` at the export root from `not-found.tsx`).
- Served the export locally (`npx serve out`) and, via the Claude Browser tooling, confirmed: the Trailer auto-plays and its full scene sequence, timer, and skip/replay all work; every nav link and project detail page renders complete correct content; the `/tech` hover map's highlight interaction works; the mobile hamburger menu opens/closes; an invalid project slug correctly serves the custom 404 page (via the host's native "serve `404.html` for any unmatched path" convention, which GitHub Pages also implements); fonts and the (currently placeholder) image path resolve correctly.
- Verified `basePath` auto-detection empirically for both a project-page repo name and a `<owner>.github.io` repo name by setting `GITHUB_REPOSITORY` locally and inspecting the generated HTML.
- Re-ran `typecheck`/`lint`/`test`/`build` from a genuinely clean state (`.next`/`out` removed) after every change.
