# Harshit Teotia — Developer Portfolio

A cinematic developer portfolio showcasing backend engineering, AI/LLM systems, APIs, data-driven applications and real-world software projects.

## Tech Stack

- **Next.js 16** (App Router, Turbopack, React Server Components) — configured for **static export** (`output: "export"`), so the whole site is pre-rendered to static HTML/CSS/JS with no Node server required at runtime
- **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS v4** — design tokens defined in [`src/app/globals.css`](src/app/globals.css)
- **Framer Motion** — shared animation tokens/variants in [`src/lib/motion`](src/lib/motion)
- **Vitest** + React Testing Library — content-schema and component tests
- **ESLint**, **Prettier**, **Husky** + **lint-staged** — linting/formatting enforced on commit

## Projects

- **Vrozart Finance** — a backend finance/operations system.
- **HAUT** — a hospitality operations platform.
- **Van Sales & Distribution ERP** — a multi-tenant distribution and sales ERP.
- **Viblets** — an AI-powered, document/agent-driven product.

Each project has a full case study (problem, architecture, technology, engineering highlights) under `/projects`.

## Getting Started

```bash
git clone <repository-url>
cd <project-directory>
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

No secrets are required for local development. `.env.local` is git-ignored and should never be committed.

For the deployed GitHub Pages site, set `NEXT_PUBLIC_SITE_URL` via the `SITE_URL` repository variable (see [Deploying to GitHub Pages](#deploying-to-github-pages)) rather than a committed `.env` file.

## Production Build

```bash
npm run build   # writes a fully static site to ./out
npm run start   # serves ./out locally (npx serve — no Node server involved)
```

## Deploying to GitHub Pages

This repo builds as a static export and deploys via a GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). To enable it on a new fork/repo:

1. In the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.
2. (Optional but recommended) In **Settings → Secrets and variables → Actions → Variables**, add a repository variable named `SITE_URL` set to the site's real published URL (e.g. `https://<owner>.github.io/<repo>`). The default is the verified `https://harshitteotia.github.io/Portfolio` URL.
3. Push changes to run CI. After reviewing the release report, manually run **Deploy to GitHub Pages** from Actions. Deployment is no longer triggered by a push.

The site's base path (`/` vs. `/<repo-name>/`) is derived automatically at build time from the repository name — no manual configuration needed for the common case. See [`next.config.ts`](next.config.ts) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md#static-export--github-pages) for exactly how.

## Project Structure

```
src/
  app/          # Routes (App Router) — pages, layouts, metadata, sitemap/robots
  components/   # UI, layout, motion, and section-specific components
  content/      # All portfolio copy/data, typed via content/types.ts
  lib/          # Small shared utilities (motion tokens, class-name helper, etc.)
public/         # Static assets served as-is
```

Content is data-driven: nothing is hardcoded into pages or components. All copy lives under `src/content/`, so updating a project, role, or piece of copy only requires editing the relevant content file.

## Scripts

| Script                 | Description                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Start the dev server                                                                                                         |
| `npm run build`        | Static export build (writes `./out`)                                                                                         |
| `npm run start`        | Serve `./out` locally via `npx serve` (there is no Node production server — `next start` does not work with a static export) |
| `npm run lint`         | Run ESLint                                                                                                                   |
| `npm run typecheck`    | Generate route types (`next typegen`) then run `tsc --noEmit`                                                                |
| `npm run test`         | Run the Vitest suite once                                                                                                    |
| `npm run test:watch`   | Run Vitest in watch mode                                                                                                     |
| `npm run format`       | Format the codebase (Prettier)                                                                                               |
| `npm run format:check` | Check formatting without writing                                                                                             |

## Documentation

For a full architectural breakdown (route map, data flow, animation system, design tokens, and a complete "if you want to change X, edit Y" guide), see [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) and the detailed docs under [`docs/`](docs/).

## Notes

- GitHub, LinkedIn, email, and the existing resume path are set in `src/content/social.ts`. The current PDF matches the November 2026 profile; editable LaTeX source and build/verification instructions are in `resume/`.
- `NEXT_PUBLIC_SITE_URL` optionally overrides the confirmed production URL; it feeds `metadataBase`, Open Graph tags, `sitemap.xml`, and `robots.txt`.
- This is a fully static site — no backend, no API routes, no database, no server actions. `next/image` runs `unoptimized` (GitHub Pages has no image-optimization endpoint to call).
- This repository has no dependency on any specific AI coding tool. `AGENTS.md` at the repo root is generated automatically by the Next.js dev server as general guidance for AI coding agents (of any kind) working in this codebase — it is not required to run, build, or test the app.

## November 13, 2026 profile review

Python Backend Developer | AI & GenAI Engineer. 17 months as a Python Developer at Vrozart Group, May 2025–September 2026, Mohali. Based in Bengaluru; available to join immediately and open to remote opportunities. See [Phase 1 report](docs/PHASE_1_REPORT.md) for audit findings, changed files, factual limitations, validation, and Phase 2 priorities.

## Browser QA (Phase 2)

Build with GITHUB_REPOSITORY=HarshitTeotia/Portfolio so the export matches production paths, install a test browser with `npx playwright install chromium`, then run `npm run test:e2e`. Playwright serves the literal export under `/Portfolio/` and checks all public content routes at six widths, dialog keyboard behavior, touch selection, links, hydration/console errors, and sampled WCAG A/AA rules with axe. The browser packages are development-only. An existing browser may be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. For environments that require separate process management, start `node scripts/serve-export.mjs` and set `PLAYWRIGHT_EXTERNAL_SERVER=1`.

The intro starts only through **Play Intro**. Phase 3 replaced the outdated PDF with a verified one-page LaTeX resume and removed the update-pending notices. See [Phase 2 report](docs/PHASE_2_REPORT.md) for actual results and remaining release work.

## Phase 3 release readiness

Next.js and its ESLint config are pinned to 16.4.6; React/React DOM remain 19.2.8. Vitest is patched to 5.0.3. Use Node 24 LTS (the engine range also permits supported Node 22.12+ and 26+). The public runtime dependency audit is clean; seven moderate TypeScript-ESLint/minimatch development-only findings remain documented without an incompatible override.

Run `npm run verify:export` after the production-prefix build, and see [Phase 3 report](docs/PHASE_3_REPORT.md) for exact advisory decisions, measured performance, resume checks, and release status. There is one manual deployment workflow; no deployment was performed during modernization.
