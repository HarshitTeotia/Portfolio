# CHANGE_GUIDE.md

The practical "if you want to change X, edit Y" reference for this repository. Every file path below was verified by reading the actual file — see [FILE_MAP.md](FILE_MAP.md) for full per-file detail and [ARCHITECTURE.md](ARCHITECTURE.md) for how the pieces connect.

---

## Quick reference table

| If you want to change...                                                  | Edit...                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage hero title/tagline/role tags                                     | [src/content/site.ts](../src/content/site.ts) (`name`, `tagline`, `identityRoles`) — layout is in [src/components/home/Hero.tsx](../src/components/home/Hero.tsx)                                                                                                                               |
| "Watch Trailer" button behavior                                           | [src/components/home/WatchTrailerButton.tsx](../src/components/home/WatchTrailerButton.tsx) (calls `useTrailerReplay()`)                                                                                                                                                                        |
| Trailer duration / scene hold times                                       | [src/content/trailer.ts](../src/content/trailer.ts) — each scene's `holdMs` (currently sums to 19,000ms across 4 scenes)                                                                                                                                                                        |
| Trailer scene copy/order/count                                            | [src/content/trailer.ts](../src/content/trailer.ts) (`trailerScenes[]`, `hudLabel`, `lines`) — **and** [src/components/trailer/Trailer.tsx](../src/components/trailer/Trailer.tsx)'s `SCENE_MOTION` table + `SceneContent()` switch if you add/remove/reorder scenes (both keyed by `scene.id`) |
| Trailer visuals per scene                                                 | `SceneContent()` inside [src/components/trailer/Trailer.tsx](../src/components/trailer/Trailer.tsx), switched on `scene.id` — the per-scene visual components live in [src/components/trailer/visuals/](../src/components/trailer/visuals/)                                                     |
| Trailer HUD (timer, progress bar, scene list)                             | [src/components/trailer/TrailerHud.tsx](../src/components/trailer/TrailerHud.tsx)                                                                                                                                                                                                               |
| Trailer's persistent backdrop (grid/orbit/glow)                           | [src/components/trailer/TrailerStage.tsx](../src/components/trailer/TrailerStage.tsx)                                                                                                                                                                                                           |
| Whether the trailer replays every visit vs. once per session              | [src/components/trailer/TrailerGate.tsx](../src/components/trailer/TrailerGate.tsx) (`STORAGE_KEY`, `getSnapshot`/`getServerSnapshot`)                                                                                                                                                          |
| Navigation items (header + footer)                                        | [src/components/layout/nav-items.ts](../src/components/layout/nav-items.ts) — single array feeds both                                                                                                                                                                                           |
| Header visual behavior (scroll blur, mobile menu)                         | [src/components/layout/Header.tsx](../src/components/layout/Header.tsx)                                                                                                                                                                                                                         |
| Footer content/links                                                      | [src/components/layout/Footer.tsx](../src/components/layout/Footer.tsx) (structure) + `nav-items.ts`/`content/social.ts` (data)                                                                                                                                                                 |
| Project display order ("Project 01/02/03/04")                             | [src/content/projects.ts](../src/content/projects.ts) — the array's literal order                                                                                                                                                                                                               |
| A project's narrative episode number/label ("EP 06")                      | [src/content/projects.ts](../src/content/projects.ts) — `episodeNumber`/`episodeLabel` fields (independent of array order — see below)                                                                                                                                                          |
| Project card hover (index/home grid)                                      | [src/components/ui/Card.tsx](../src/components/ui/Card.tsx) (shared hover shell) or the row-level hover in [src/app/projects/page.tsx](../src/app/projects/page.tsx)                                                                                                                            |
| Project detail page layout/sections                                       | [src/app/projects/[slug]/page.tsx](../src/app/projects/[slug]/page.tsx)                                                                                                                                                                                                                         |
| Project copy (problem/solution/role/highlights/challenges/outcome)        | [src/content/projects.ts](../src/content/projects.ts)                                                                                                                                                                                                                                           |
| Project architecture diagram content                                      | [src/content/projects.ts](../src/content/projects.ts)'s `architecture` field (`kind: "pipeline" \| "modules" \| "evidence"`)                                                                                                                                                                    |
| Project architecture diagram _rendering_                                  | [src/components/projects/ArchitectureView.tsx](../src/components/projects/ArchitectureView.tsx) (detail page) / [ArchitectureHint.tsx](../src/components/projects/ArchitectureHint.tsx) (index one-liner)                                                                                       |
| A project's GitHub/demo link                                              | [src/content/projects.ts](../src/content/projects.ts) — `links.github`/`links.demo`; rendering logic in [src/components/projects/ProjectLinksRow.tsx](../src/components/projects/ProjectLinksRow.tsx)                                                                                           |
| Tech stack list / which projects use a technology                         | [src/content/technologies.ts](../src/content/technologies.ts) (`usedIn[]`) — **must stay symmetric** with the matching project's `technologies[]` in `projects.ts` (enforced by `content.test.ts`)                                                                                              |
| Tech category grouping/labels/order                                       | [src/content/categories.ts](../src/content/categories.ts)                                                                                                                                                                                                                                       |
| Tech↔project hover map behavior                                           | [src/components/tech/TechMap.tsx](../src/components/tech/TechMap.tsx)                                                                                                                                                                                                                           |
| Experience entry (role/company/dates/responsibilities)                    | [src/content/experience.ts](../src/content/experience.ts)                                                                                                                                                                                                                                       |
| Experience date range                                                     | [src/content/experience.ts](../src/content/experience.ts) — `dateRange` field on the entry                                                                                                                                                                                                      |
| Which projects a role "built" (shown on `/experience`)                    | [src/content/experience.ts](../src/content/experience.ts) — `relatedProjectIds[]`                                                                                                                                                                                                               |
| Career-phase label shown on project pages ("Phase 03 — Real World")       | [src/content/experience.ts](../src/content/experience.ts) — `phaseNumber`/`phaseLabel` on the relevant entry, resolved via `getProjectPhase()`                                                                                                                                                  |
| About page text                                                           | [src/content/about.ts](../src/content/about.ts)                                                                                                                                                                                                                                                 |
| About page photo                                                          | [src/content/about.ts](../src/content/about.ts) — set `photoSrc` to a real image path (currently `null`, renders a placeholder box)                                                                                                                                                             |
| Education entries                                                         | [src/content/education.ts](../src/content/education.ts)                                                                                                                                                                                                                                         |
| "Episodes"/season copy                                                    | [src/content/seasons.ts](../src/content/seasons.ts)                                                                                                                                                                                                                                             |
| Contact page / social links                                               | [src/content/social.ts](../src/content/social.ts) — layout in [src/app/contact/page.tsx](../src/app/contact/page.tsx)                                                                                                                                                                           |
| Resume link                                                               | [src/content/social.ts](../src/content/social.ts) — the `resume` entry's `url`                                                                                                                                                                                                                  |
| Global purple/violet accent color                                         | [src/app/globals.css](../src/app/globals.css) — `--color-accent-*` (aliased to Tailwind's built-in `violet` scale)                                                                                                                                                                              |
| Background/surface colors                                                 | [src/app/globals.css](../src/app/globals.css) — `--color-bg`, `--color-bg-elevated`, `--color-bg-overlay`                                                                                                                                                                                       |
| Text colors                                                               | [src/app/globals.css](../src/app/globals.css) — `--color-text-primary/secondary/muted`                                                                                                                                                                                                          |
| Typography scale (font sizes)                                             | [src/app/globals.css](../src/app/globals.css) — the `@theme inline` block's `--text-2xl` … `--text-7xl` `clamp()` values                                                                                                                                                                        |
| Font families                                                             | [src/app/layout.tsx](../src/app/layout.tsx) (`next/font/google` loaders) + [src/app/globals.css](../src/app/globals.css) (`--font-display/sans/mono` mapping)                                                                                                                                   |
| Border radius scale                                                       | [src/app/globals.css](../src/app/globals.css) — `--radius-sm/md/lg/xl`                                                                                                                                                                                                                          |
| Global animation timing (durations/easings)                               | **Both** [src/lib/motion/tokens.ts](../src/lib/motion/tokens.ts) (JS/Framer Motion) **and** [src/app/globals.css](../src/app/globals.css) (`--duration-*`/`--ease-*` CSS vars) — hand-synced, change both                                                                                       |
| Default scroll-reveal animation                                           | [src/lib/motion/variants.ts](../src/lib/motion/variants.ts) — `fadeUp` (used by `Reveal` and `StaggerItem` by default)                                                                                                                                                                          |
| Mobile navigation                                                         | [src/components/layout/Header.tsx](../src/components/layout/Header.tsx) — the `menuOpen`/`AnimatePresence` block                                                                                                                                                                                |
| Responsive breakpoints                                                    | Not overridden in this repo — Tailwind v4 defaults apply (`sm`/`md`/`lg`/`xl`/`2xl`); if you need custom breakpoints, add `--breakpoint-*` to `globals.css`'s `@theme inline` block                                                                                                             |
| SEO title/description (root)                                              | [src/app/layout.tsx](../src/app/layout.tsx) — `title`/`description` consts (currently **hardcoded**, independent of `content/site.ts`)                                                                                                                                                          |
| SEO title/description (per project)                                       | `generateMetadata()` in [src/app/projects/[slug]/page.tsx](../src/app/projects/[slug]/page.tsx)                                                                                                                                                                                                 |
| `robots.txt` / `sitemap.xml` rules                                        | [src/app/robots.ts](../src/app/robots.ts) / [src/app/sitemap.ts](../src/app/sitemap.ts)                                                                                                                                                                                                         |
| Production domain used in metadata                                        | `NEXT_PUBLIC_SITE_URL` env var (see [.env.example](../.env.example)), read by [src/lib/site-url.ts](../src/lib/site-url.ts) — set via the `SITE_URL` repository variable for the deployed GitHub Pages site                                                                                     |
| Structured data (JSON-LD)                                                 | [src/components/seo/PersonJsonLd.tsx](../src/components/seo/PersonJsonLd.tsx)                                                                                                                                                                                                                   |
| GitHub Pages base path                                                    | Auto-derived in [next.config.ts](../next.config.ts) from `GITHUB_REPOSITORY` — override with the `BASE_PATH` env var only if needed (e.g. a custom domain)                                                                                                                                      |
| Static export settings (`output`, `trailingSlash`, image optimization)    | [next.config.ts](../next.config.ts) — see [ARCHITECTURE.md § Static export / GitHub Pages](ARCHITECTURE.md#11-static-export--github-pages) before changing any of these                                                                                                                         |
| Deployment workflow (what runs before a deploy, which branch triggers it) | [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)                                                                                                                                                                                                                                 |

---

## Two numbering systems — don't confuse them

`projects.ts`'s array **order** drives "Project 01/02/03/04" everywhere (index → `String(index+1).padStart(2,"0")`). Each project's `episodeNumber`/`episodeLabel` ("EP 06") is a **separate, independent** narrative sequence used only on `/episodes` and in each project's `episodeTitle`/`episodeLabel` display. Reordering the array changes "Project 0X" labels but does **not** change any `EP 0X` label, and vice versa. If a change request says "move Viblets to the top," that's an array reorder in `projects.ts` — it does not touch `episodeNumber`.

---

## Change impact map

High-impact files — changing these ripples across many pages. Always check every consumer listed before editing.

```
src/content/projects.ts
  → /projects, /projects/[slug] (×4 static pages), Home (FeaturedWork),
    /about, /experience, /episodes, /tech (TechMap), sitemap.ts, content.test.ts

src/content/technologies.ts (+ categories.ts)
  → /tech, Home (TechTeaser + FeaturedWork), /projects, /projects/[slug], content.test.ts
    (must stay symmetric with projects.ts — content.test.ts enforces this both ways)

src/content/experience.ts
  → /experience, Home (StatusPill), PersonJsonLd, every "Phase 0X" label
    on /projects, /projects/[slug], Home (FeaturedWork)

src/components/layout/nav-items.ts
  → Header (desktop + mobile nav), Footer

src/lib/motion/tokens.ts + globals.css motion vars
  → every motion primitive (Reveal, ClipReveal, DrawLine, Stagger, Parallax,
    RouteTransition, Trailer, ArchitectureView) — must change both files together

src/app/globals.css color tokens
  → the entire site (every component consumes these via Tailwind utility classes)

src/components/ui/* (Badge, Button, Card, SectionHeading, Divider)
  → reused across nearly every page
```

---

## Safe editing rules

1. **Prefer editing the existing source of truth instead of duplicating data.** Check `src/content/` before adding a new data file.
2. **Do not create a second component if an existing component already performs the job** — check `src/components/ui/` and `src/components/motion/` first.
3. **Do not create duplicate project data.** `src/content/projects.ts` is the only place project facts live.
4. **Do not add a dependency for a feature that can be implemented with the existing stack** (Next.js + React + Tailwind + Framer Motion covers everything currently built here).
5. **Do not move components unnecessarily.** The current grouping (`layout`/`home`/`trailer`/`motion`/`decorative`/`ui`/`projects`/`tech`/`episodes`/`seo`) is deliberate and documented in [ARCHITECTURE.md](ARCHITECTURE.md).
6. **Do not convert Server Components to Client Components unless required.** See the audit in [ARCHITECTURE.md](ARCHITECTURE.md#client-server-boundary) before adding `"use client"`.
7. **Do not modify `globals.css` to solve a component-local problem** unless the fix is genuinely a design-token or global-base-style change.
8. **Before changing shared components** (`Badge`, `Button`, `Card`, `SectionHeading`, `Reveal`, `Stagger`, etc.), grep for every import of that component — see [FILE_MAP.md](FILE_MAP.md) for a starting "used by" list.
9. **Before changing design tokens** in `globals.css`, check every page using them — in this codebase, that typically means "every page."
10. **Do not invent content, URLs, metrics, clients, technologies, or achievements.** This codebase has an explicit convention: unconfirmed facts are `null` (see `ProjectLink.url`, `SocialLink.url`, `about.photoSrc`, `Project.outcome`), not a plausible-looking placeholder.
11. **Preserve accessibility** — `aria-current`, `aria-expanded`, `aria-hidden` on decorative elements, `role="dialog"`/`aria-modal` on the Trailer, the skip-to-content link in `layout.tsx`, and focus-visible outlines in `globals.css` are all intentional.
12. **Preserve `prefers-reduced-motion` support** — every motion primitive and the Trailer itself have a reduced-motion branch; any new animation should too.
13. **Preserve mobile behavior** — check the mobile nav (`Header.tsx`), the compact trailer viewport logic (`useIsCompactViewport` in `Trailer.tsx`), and that `TechMap`'s hover-only interaction isn't made worse for touch users (see Known Limitations).
14. **After meaningful changes, run:** `npm run typecheck && npm run lint && npm run test && npm run build`.
15. **Preserve static-export compatibility.** This app deploys as a static export (`output: "export"` in `next.config.ts`) to GitHub Pages, which has no Node server. Don't add API routes, server actions, middleware, `cookies()`/`headers()`, or a dynamic route segment without `generateStaticParams()` — none of these can run on GitHub Pages. A new metadata route (`robots.ts`/`sitemap.ts`-style) needs `export const dynamic = "force-static";` or the build fails outright in this Next.js version.
16. **Don't remove the `@source not` lines in `globals.css`** without understanding why they're there (see [ARCHITECTURE.md § Static export / GitHub Pages](ARCHITECTURE.md#11-static-export--github-pages)) — removing them reintroduces a real, verified bug where prose in this repo's own documentation breaks `next dev` (`500` on every route).

---

## Common change recipes

### Change project order

1. Open [src/content/projects.ts](../src/content/projects.ts).
2. Reorder the objects in the `projects` array (the array order _is_ the display order).
3. Check `/projects` (index numbering), Home `FeaturedWork` (card order), `/about` ("Currently Building Across" list), `/tech` (project side panel order) — all derive their order from this same array, so no other file needs editing.
4. `episodeNumber`/`episodeLabel` do **not** change — confirm that's intended (see "Two numbering systems" above).
5. Run `npm run test` (checks unique ids/slugs/episode numbers) and `npm run build`.

### Change a project's description/copy

1. Locate the project object in [src/content/projects.ts](../src/content/projects.ts) by `id`.
2. Edit `problem`/`solution`/`theme`/`positioning`/`role`/`highlights`/`challenges`/`outcome` as needed.
3. Verify on `/projects` (uses `theme`, `positioning`), `/projects/[slug]` (uses everything), Home `FeaturedWork` (uses `theme`, `positioning`).
4. No duplicate copy exists elsewhere — this is the only place project text lives.
5. Run `npm run test && npm run build`.

### Change trailer duration/timing

1. Open [src/content/trailer.ts](../src/content/trailer.ts) and adjust each scene's `holdMs`.
2. The overall timer total (`TrailerHud`'s `totalMs`) is computed automatically in `Trailer.tsx` as `trailerScenes.reduce((sum, s) => sum + s.holdMs, 0)` — no separate total to update.
3. The HUD's progress bar reads `totalMs` directly (one continuous fill over the whole run) — no separate per-scene update needed.
4. If you add/remove/reorder scenes, add/update an entry in `Trailer.tsx`'s `SCENE_MOTION` table (the per-scene enter/exit variant) keyed by the new `scene.id`, and add a matching `case` in `SceneContent()`'s switch — the `default` case falls through to the identity-scene visual. Also update the `TrailerSceneId` union in `src/content/types.ts`.
5. If a scene's own visual has internal signal/reveal timing (e.g. `SystemBoot`'s node-to-node signal, `CareerTimeline`'s year-to-year signal), that timing is independent of the parent scene's `holdMs` — keep it comfortably inside the scene's `holdMs` so nothing is cut off mid-reveal.
6. Under `prefers-reduced-motion`, every scene uses a flat `REDUCED_MOTION_HOLD_MS` (2500ms) instead of its own `holdMs` — adjust that one constant in `Trailer.tsx` if reduced-motion viewers need more/less reading time, rather than each scene's real `holdMs`.
7. Verify skip/close still works (click-anywhere, Escape/Enter/Space, the "Skip intro" button) and that cleanup still runs (no lingering timers) — see [ANIMATION_SYSTEM.md](ANIMATION_SYSTEM.md#trailer-lifecycle).
8. **Do not add `mode="wait"` to the scene `AnimatePresence`** in `Trailer.tsx` — verified to make the animated content permanently invisible in this exact setup (see the code comment there).
9. **The trailer is deliberately scoped to four beats (Origin/Building/Real World/Identity) and never names a specific project** — don't reintroduce a project-named scene (the old `systems` scene, and its `ArchitectureMorph` visual, were removed for exactly this reason).
10. **A scene's own visual container needs a real width, not `w-full`, if the scene wrapper it sits in has none.** `Trailer.tsx`'s scene wrapper (`className="flex flex-col items-center"`) is a shrink-to-fit flex item — a child's `w-full` resolves against it and collapses to the child's own content width (confirmed the hard way on `CareerTimeline` — see [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md#technical-debt)). Use a viewport-relative width (e.g. `w-[min(calc(100vw-3rem),48rem)]`) for any scene visual that needs to actually fill available space.

### Add a hover effect

1. Check whether `Card.tsx` or `Badge.tsx`'s existing hover language already covers the need — most of the site's hover behavior is centralized there.
2. Reuse `duration.base`/`ease.standard` from [src/lib/motion/tokens.ts](../src/lib/motion/tokens.ts) (or the equivalent Tailwind `duration-base ease-standard` utility classes) rather than inventing new timing.
3. Prefer a pure-CSS hover (Tailwind `hover:`/`group-hover:` classes) for simple color/border/transform changes — this is the pattern used almost everywhere in this codebase.
4. Use a Framer Motion / JS approach only when the interaction needs shared state across siblings (e.g. `TechMap`'s highlight-on-hover).
5. Preserve keyboard focus parity — most hover styles in this codebase are paired with `focus`/`focus-visible` equivalents (see `TechMap.tsx`'s `onFocus`/`onBlur` alongside `onMouseEnter`/`onMouseLeave`).
6. Verify on mobile — CSS `:hover`/`group-hover` still works via tap-to-hover on many mobile browsers, but state-driven hover (like `TechMap`) does not have a tap fallback today (see Known Limitations) — don't introduce a second such gap without considering a tap handler.

### Add a new project

1. Add a new object to the `projects` array in [src/content/projects.ts](../src/content/projects.ts) with a unique `id`, `slug`, and `episodeNumber`.
2. Add its `id` to `ProjectId` in [src/content/types.ts](../src/content/types.ts).
3. Add/extend entries in [src/content/technologies.ts](../src/content/technologies.ts)'s `usedIn[]` for every technology it uses (and list those technology ids in the new project's own `technologies[]` — both directions must agree).
4. If the project belongs to an existing role, add its `id` to that entry's `relatedProjectIds` in [src/content/experience.ts](../src/content/experience.ts) (otherwise it will show "Independent Project" everywhere, like the Van Sales ERP project currently does).
5. Pick an `architecture.kind` (`pipeline`/`modules`/`evidence`) that matches the project's real shape — no new rendering code is needed for these three kinds.
6. Run `npm run test` — `content.test.ts` will fail loudly on a duplicate id/slug/episode number, an unknown technology reference, an unknown project reference, or a missing required field.
7. Run `npm run build` — the new project gets its own static route automatically via `generateStaticParams`, and a sitemap entry automatically via `sitemap.ts`.

### Remove a project

1. Delete its object from `projects` in [src/content/projects.ts](../src/content/projects.ts).
2. Remove its id from `ProjectId` in [src/content/types.ts](../src/content/types.ts).
3. Remove it from every technology's `usedIn[]` in [src/content/technologies.ts](../src/content/technologies.ts) (symmetry test will otherwise fail).
4. Remove it from any `relatedProjectIds` in [src/content/experience.ts](../src/content/experience.ts).
5. Run `npm run test && npm run build` — the static route disappears automatically.

### Change tech stack

1. Add/edit/remove entries in [src/content/technologies.ts](../src/content/technologies.ts); add new ids to `TechnologyId` in [src/content/types.ts](../src/content/types.ts).
2. Assign the correct `category` (see [src/content/categories.ts](../src/content/categories.ts) for the valid set and display order/labels).
3. Set `usedIn[]` to the real project(s) — every technology must trace to at least one project (`content.test.ts` fails on an "orphan buzzword").
4. Add the matching technology id to that project's `technologies[]` in `projects.ts` (symmetry).
5. Verify on `/tech`, Home `TechTeaser`, and the relevant project card/detail pages.

### Change experience

1. Edit the entry in [src/content/experience.ts](../src/content/experience.ts) (`role`, `company`, `dateRange`, `summary`, `responsibilities[]`).
2. If adding a second role, ensure at most one entry has `current: true` (`content.test.ts` enforces this).
3. Set `relatedProjectIds[]` to real project ids, and `phaseNumber`/`phaseLabel` for the "Phase 0X — Label" text shown on project pages.
4. Verify `/experience`, Home `StatusPill` (only shows the `current` entry), and `PersonJsonLd` (uses the `current` entry's `role`/`company`).

### Change About

Edit [src/content/about.ts](../src/content/about.ts) directly — every field maps 1:1 to a section on `/about` (`heroStatement`, `summary`, `whatIBuild[]`, `howIWork[]`, `engineeringFocus[]`, `photoSrc`/`photoAlt`). No other file needs to change.

### Change navigation

Edit [src/components/layout/nav-items.ts](../src/components/layout/nav-items.ts) — both `Header.tsx` and `Footer.tsx` read this single array; no duplication to worry about. Note `/dev/design-system` is deliberately excluded from this list (internal-only route).

### Change hero

Copy: [src/content/site.ts](../src/content/site.ts). Layout/animation timing: [src/components/home/Hero.tsx](../src/components/home/Hero.tsx) — the entrance sequence's delays are hand-tuned (see the in-file comment listing the intended ~100ms/~250ms/~400ms/~600ms/~750ms beats) — treat them as a deliberate choreography, not arbitrary numbers.

### Change colors

Edit the CSS custom properties in [src/app/globals.css](../src/app/globals.css) (`:root` block). The accent scale is aliased to Tailwind v4's built-in `violet` OKLCH scale — to change the accent hue entirely, either point the aliases at a different built-in Tailwind color scale or replace the `var(--color-violet-*)` references with literal color values. This is a single-theme (dark-only) site — there is no separate light-mode token set to update.

### Change typography

Font families: swap the `next/font/google` loader in [src/app/layout.tsx](../src/app/layout.tsx) and update the corresponding `--font-*` mapping in `globals.css`. Type scale: edit the `clamp()` values under `--text-2xl` … `--text-7xl` in `globals.css`'s `@theme inline` block.

### Change responsive behavior

There are no custom breakpoints defined — this repo uses Tailwind v4's defaults (`sm`/`md`/`lg`/`xl`/`2xl`). Per-component responsive behavior is authored inline with Tailwind's `sm:`/`md:`/`lg:` prefixes in each component (e.g. `Header.tsx`'s `hidden lg:flex` desktop nav vs. hamburger, `TechMap.tsx`'s `lg:grid-cols-[1fr_300px]` side panel). To add a genuinely new breakpoint, add a `--breakpoint-*` var to `globals.css`'s `@theme inline` block.

### Add a page

1. Create `src/app/<route>/page.tsx` (Server Component by default — only add `"use client"` if it genuinely needs it, per the audit in [ARCHITECTURE.md](ARCHITECTURE.md#client-server-boundary)).
2. Export `metadata` (a `Metadata` object) for `<title>`/description.
3. Add the route to `navItems` in [nav-items.ts](../src/components/layout/nav-items.ts) if it should appear in the header/footer nav.
4. Add the route path to `staticRoutes` in [src/app/sitemap.ts](../src/app/sitemap.ts) if it should be indexed.
5. Reuse existing content files/UI primitives — don't create new one-off components if `src/components/ui/` already covers the need.

### Modify a project detail page

Section-by-section layout lives in [src/app/projects/[slug]/page.tsx](../src/app/projects/[slug]/page.tsx) itself (it is not further decomposed beyond `ArchitectureView`/`ProjectLinksRow`). To reorder sections (Problem → Solution → Architecture → Technology → Highlights → Challenges → Outcome → Links), reorder the JSX blocks directly in that file.

### Change animations (site-wide motion timing)

Edit **both** [src/lib/motion/tokens.ts](../src/lib/motion/tokens.ts) (`duration`/`ease` objects, consumed by Framer Motion components) **and** the matching `--duration-*`/`--ease-*` custom properties in [src/app/globals.css](../src/app/globals.css) (consumed by CSS-only animations and Tailwind's `duration-[var(--duration-*)]` arbitrary values). These are intentionally two files with one shared intent — see the in-file comments explicitly calling this out as "kept in sync by hand."
