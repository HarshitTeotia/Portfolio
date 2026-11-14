# Project Context

Reviewed November 13, 2026. Source code is authoritative. See [Phase 1 report](docs/PHASE_1_REPORT.md) for the audit, changed files, validation, factual limitations, and Phase 2 priorities.

## Professional profile

Harshit Teotia: **Python Backend Developer | AI & GenAI Engineer**. Official designation: **Python Developer**, Vrozart Group, **May 2025–September 2026** (17 months), Mohali, Punjab, India. Based in Bengaluru, India; available to join immediately and open to remote software engineering and AI engineering opportunities. No current employer is claimed.

Education: BCA, Meerut Institute of Technology, 2020–2023; MCA specializing in Artificial Intelligence & Machine Learning, Chandigarh University, 2023–2025.

## Architecture

Existing Next.js 16.4.6 App Router, React 19.2.8, strict TypeScript, Tailwind CSS v4, Framer Motion, Vitest, ESLint, and Prettier. Playwright and axe are development-only browser QA tools. Vitest is pinned to the security patch 5.0.3; use Node 24 LTS for CI/local tooling. No runtime backend, database, CMS, API routes, server actions, or authentication service. This portfolio describes backend work; it does not host those systems.

Pages and layouts are Server Components. Browser interactions live in client components: navigation, motion primitives, trailer, and technology map. Preserve the dark cinematic identity, violet accents, responsive layouts, focus indicators, skip link, and reduced-motion branches. No runtime dependencies were added in Phase 2.

## Routes and sources

| Route                     | Purpose                                                                     | Content                                                |
| ------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------ |
| /                         | Hero, availability, three primary case studies, tech teaser, optional intro | site.ts, projects.ts, technologies.ts, social.ts       |
| /projects                 | Primary projects followed by secondary Viblets                              | projects.ts                                            |
| /projects/[slug]          | Static case studies, diagrams, optional investigation, lessons, demo        | projects.ts, technologies.ts, experience.ts            |
| /experience               | Historical role, responsibilities, location, related work                   | experience.ts                                          |
| /episodes                 | Education and employer-associated episodes; ERP linked separately           | seasons.ts, experience.ts, projects.ts                 |
| /about                    | Profile, existing portrait, contributions, education                        | about.ts, education.ts, projects.ts                    |
| /tech                     | Reciprocal technology graph and other hands-on skills                       | technologies.ts, projects.ts, categories.ts, skills.ts |
| /contact                  | Availability, contact/social/resume links                                   | site.ts, social.ts                                     |
| /dev/design-system        | Internal QA page; noindex, excluded from sitemap                            | Shared UI primitives                                   |
| /robots.txt, /sitemap.xml | Static metadata routes                                                      | site-url.ts, projects.ts                               |

Case-study slugs remain vrozart-finance, van-sales-distribution-erp, haut, viblets. Array order determines display priority; episode numbers remain independent identifiers.

## Data rules

Content lives in src/content; types.ts defines schemas. Import content directly without a barrel. Every technology in the interactive map must reference documented projects, and project technologies must reciprocate through usedIn. content.test.ts checks both directions. Verified skills without project evidence belong in skills.ts without invented relationships or ratings.

Lending is the lead case study. Its anonymized prompt-injection narrative covers reproduction, analysis, trust boundaries, and proposed mitigations. It does not claim deployed safeguards or a completed fix. ERP metrics are limited to nine modules, 16 roles, 18 migrations, and 176+ tests. ERP employment attribution remains unconfirmed: use Backend Developer without an employer-season association. Viblets retains its existing narrative as a secondary project.

Unconfirmed links use null. A demo field with a null URL renders no button. Project GitHub entries remain private/unlinked; do not publish client code or invent outcomes, scale, business impact, URLs, or ownership.

## Source-of-truth map

| Change                                    | Files                                                               |
| ----------------------------------------- | ------------------------------------------------------------------- |
| Headline, summary, availability, identity | src/content/site.ts                                                 |
| Hero hierarchy and CTAs                   | src/components/home/Hero.tsx                                        |
| Historical role, dates, attribution       | src/content/experience.ts; keep seasons.ts consistent               |
| Biography and portrait                    | src/content/about.ts                                                |
| Education                                 | src/content/education.ts and seasons.ts                             |
| Projects and architecture data            | src/content/projects.ts                                             |
| Architecture rendering                    | src/components/projects/ArchitectureView.tsx                        |
| Case-study rendering                      | src/app/projects/[slug]/page.tsx                                    |
| Technology relationships                  | src/content/technologies.ts and projects.ts                         |
| Other verified skills                     | src/content/skills.ts                                               |
| Email/social/resume URLs                  | src/content/social.ts                                               |
| Root identity metadata                    | src/content/site.ts and src/app/layout.tsx                          |
| Per-route canonical/Open Graph/Twitter    | src/lib/page-metadata.ts and page metadata exports                  |
| Production URL                            | src/lib/site-url.ts                                                 |
| Raw anchor/image URLs                     | src/lib/asset-path.ts                                               |
| Navigation                                | src/components/layout/nav-items.ts                                  |
| Motion                                    | src/lib/motion/tokens.ts and src/app/globals.css; keep synchronized |
| Trailer copy/hold times                   | src/content/trailer.ts                                              |
| Trailer activation/replay                 | src/components/trailer/TrailerGate.tsx                              |

## Trailer

Four scenes remain: Origin (4s), Building (5s), Real World (5s), Identity (5s). Total normal hold time is 19s; reduced motion uses 2.5s per scene (10s). Playback begins only through Play Intro; it is closable, skippable, and replayable, with no storage-based auto-start. Home is server-rendered underneath. Timeline and identity derive from seasons.ts and site.ts. Phase 2 lazy-loads the intro and uses a native dialog with explicit Tab wrapping, background inertness, scroll locking, and focus restoration.

## Assets and URLs

GitHub, LinkedIn, and email use user-supplied values. public/harshit.jpg exists and is configured in about.ts. public/resume/Harshit_Teotia_Resume.pdf is now the current one-page resume. Editable source and an identical compiled copy live in resume/. Build and verification instructions are in resume/README.md.

SiteLink wraps next/link with prefetch disabled to avoid missing speculative segment payloads on static hosting. PDF links are ordinary anchors, not App Router destinations. Raw resume anchors and next/image sources use assetPath to apply NEXT_PUBLIC_BASE_PATH. Do not double-prefix SiteLink URLs.

siteUrl defaults to https://harshitteotia.github.io/Portfolio, with an optional non-empty NEXT_PUBLIC_SITE_URL override and trailing-slash normalization. Canonicals and route sharing URLs are absolute. Person JSON-LD uses the official professional title without worksFor because no role is current.

## Static export and deployment

next.config.ts preserves output: export, trailingSlash: true, and images.unoptimized: true. The base path derives from GITHUB_REPOSITORY, with an optional BASE_PATH override, and is exposed as NEXT_PUBLIC_BASE_PATH. A local build without an override has an empty asset prefix. For production-path validation in PowerShell, set $env:GITHUB_REPOSITORY = 'HarshitTeotia/Portfolio' before npm run build.

Static output goes to out. Metadata routes use force-static; project routes use generateStaticParams and await params. Read installed Next.js guides before changing framework APIs, per AGENTS.md.

.github/workflows/ci.yml validates changes. deploy.yml runs typecheck, lint, tests, build, adds .nojekyll, and deploys via GitHub Actions. Optional SITE_URL overrides metadata origin. The duplicate nextjs.yml was removed in Phase 3. deploy.yml is workflow_dispatch-only, uses Node 24, and runs audit/browser/export gates before deployment. No remote settings were changed or workflow triggered.

## Phase 2 interaction rules

Use the shared Modal for top-layer overlays; preserve Escape, Tab wrapping, focus restoration, and scroll cleanup. Technology selections support touch/click/Enter with aria-pressed, Reset, and Escape. Keep reciprocal content relationships unchanged.

Use src/lib/use-reduced-motion.ts for render-tree branching: it matches the server tree on hydration before adopting the media preference. Direct preference-dependent markup during hydration previously caused React error 418.

Home and project index share ProjectCard. Case studies have section anchors and previous/next navigation. Navigation order is Home, Experience, Projects, Technologies, Career, About, Contact. Phase 3 replaced the outdated resume and removed ResumeNotice.

## Validation and maintenance

Run npm run typecheck, npm run lint, npm run test, and npm run build. After a /Portfolio build, npm run test:e2e checks the literal export through scripts/serve-export.mjs. Install Chromium with npx playwright install chromium, or set PLAYWRIGHT_CHROMIUM_EXECUTABLE to an installed compatible binary. PLAYWRIGHT_EXTERNAL_SERVER=1 lets QA use an independently managed preview. Typecheck runs next typegen before tsc so clean checkouts resolve PageProps/LayoutProps. Existing Google Fonts need network access during builds. See docs/PHASE_3_REPORT.md for current release validation, browser/performance results, and advisory applicability.

Keep reusable components, diagrams, static generation, accessible navigation, and reduced-motion behavior. Do not add dependencies or restructure working components unnecessarily. Null means unconfirmed; do not replace it with a guessed URL or claim.

Detailed guides: docs/ARCHITECTURE.md, docs/FILE_MAP.md, docs/CHANGE_GUIDE.md, docs/DESIGN_SYSTEM.md, docs/ANIMATION_SYSTEM.md, docs/KNOWN_LIMITATIONS.md.
