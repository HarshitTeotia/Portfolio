# Phase 2 — Cinematic Portfolio UX & Design Refinement

Reviewed November 13, 2026. Implemented locally; **not deployed**. Phase 1 professional facts, project order, routes, privacy boundaries, and security-investigation limits remain intact.

## 1. Initial UX audit

The existing site already had a distinctive dark/violet visual language, shared UI/motion primitives, responsive architecture renderers, a skip-to-content link, and typed professional content. The main problems found in source and real-browser checks were:

- A session-based, 19-second intro still opened automatically after hydration and covered the homepage.
- The intro used a div-based modal without focus containment/restoration or scroll locking. Global Enter/Space handlers and click-anywhere dismissal overrode normal control behavior.
- The mobile menu lacked Escape handling, background inertness, scroll locking, and reliable cleanup on desktop resize.
- Name, role, storytelling, and availability competed for attention. Primary content was nested behind entrance effects, and display headings needed a more restrained scale for long titles.
- Home and the project index used different presentation patterns. The index emphasized large ghost numerals and alternating rows rather than comparable contributions/challenges.
- Technology exploration depended on transient hover/focus state; touch visitors could not retain a selection.
- Case studies lacked section navigation and previous/next links. Career seasons had no jump navigation.
- The existing resume remained outdated, and no newer PDF or verified resume source was found in the repository.
- Browser testing reproduced reduced-motion hydration mismatches (React error 418), missing speculative RSC segment requests, and attempts to prefetch the PDF as an application route.
- Axe flagged the faint decorative case-study numeral for contrast. The first keyboard test also showed that native dialog behavior alone allowed Shift+Tab to move focus into browser chrome.

The browser findings were fixed and tested again; they were not dismissed as harmless framework behavior or hidden by preview-server rewrites.

## 2. Improvements implemented

### Homepage and visual hierarchy

The headline remains **Python Backend Developer | AI & GenAI Engineer**. Identity, professional summary, core technologies, Explore Projects, View Resume, Contact Me, and availability are immediately available. Above-the-fold copy no longer depends on scroll-reveal animations. Typography and spacing use a more restrained fluid scale, while atmospheric violet lighting, the grid/orbit motif, and the cinematic identity remain.

Home and the project index now share ProjectCard: domain, title, role, core technologies, contribution, engineering challenge, and a clearly named case-study link. Three primary projects remain first: MSME lending, Van Sales ERP, and HAUT. Viblets remains additional work. No screenshots, metrics, demos, or new engineering claims were invented.

A visible update-pending note accompanies the retained resume on Home and Contact. It does not present the old PDF as current.

### Optional intro

- Play Intro is the sole playback trigger; there is no sessionStorage auto-start or hydration-time overlay.
- The intro is dynamically imported only when requested, using the installed Next.js lazy-loading API.
- Clear Close intro and Skip intro controls remain visible on small/short viewports.
- Escape closes the dialog. Enter and Space activate the focused control normally.
- Every playback mounts a fresh sequence; completion, close, skip, and replay are tested.
- The original four scenes remain, with 19 seconds of normal holds and 10 seconds under reduced motion.
- Scene-based progress replaces the previous continuous React timer. A concise status announcement identifies each scene without announcing every timer tick.

### Navigation and reading flow

Navigation now follows Home, Experience, Projects, Technologies, Career, About, Contact. The existing routes are preserved. Active states normalize trailing slashes and recognize nested project routes. The mobile menu closes on selection, Escape, and crossing into desktop layout.

Career seasons have jump links and anchored sections. Case studies have Problem, Architecture, Contributions, and optional LLM Investigation anchors, plus previous/next navigation and a contact link. Lending retains its pipeline diagram and gains a distinct, readable investigation panel. Its text still establishes investigation and proposed mitigations only, without claiming a completed security fix.

### Touch technology explorer

Technology buttons now support persistent tap/click/Enter selection, aria-pressed, Reset, and Escape. Hover/focus provide temporary previews without destroying the retained selection. The related-project panel filters to documented relationships, and a status message announces the selected technology and project count. Nonmatching text is no longer dimmed to an unreadable opacity. The reciprocal content graph is unchanged.

## 3. Accessibility improvements

A reusable native dialog component supplies top-layer modality and background inertness. Explicit Tab/Shift+Tab wrapping supplements native behavior; effects preserve and restore the trigger, lock/unlock body scrolling, and clean up on unmount. Dialogs have accessible names, close controls, and appropriate descriptive/status text.

Existing skip navigation and visible focus outlines remain. Key buttons/menu controls have minimum 44px targets, project links have descriptive accessible names, project-card heading levels match their page context, and typography/long labels wrap within narrow containers. Muted text contrast was strengthened, the primary button hover keeps sufficient contrast, and redundant low-contrast decorative numerals were removed.

Reduced-motion rendering now uses a shared useSyncExternalStore hook. Its first client tree matches server output; it then adopts the browser preference and subscribes to changes. This fixes the observed hydration mismatch while preserving reduced-motion branches across motion primitives and architecture rendering.

Automated axe results are measured findings on the sampled states, **not a claim of complete WCAG compliance or a substitute for manual screen-reader testing**.

## 4. Mobile and responsive improvements

Real Chromium testing covered **320, 375, 390, 768, 1024, and 1440px** across all 11 public content routes: 66 route/width combinations. Tests checked viewport bounds for content headings, paragraphs, links, and buttons, as well as document overflow. No content overflow was found in the final matrix.

Additional checks covered a 320×568 intro, a 390×844 touch/menu context, and a 640×360 normal-motion intro. Dialog headers/footers stay available, while scene content can scroll safely on short viewports. Architecture steps use bounded wrapping nodes; module/evidence layouts retain responsive grids. Contact addresses and long technical labels wrap. Touch selection uses ordinary controls rather than gestures that interfere with scrolling.

Screenshots were inspected, including the first mobile screen, full desktop/mobile homepages, mobile menu, intro, and lending architecture. A Close button wrapping issue discovered in the 320px screenshot was corrected.

## 5. Animation and performance refinements

- Removed the forced introduction and deferred its JavaScript until explicit playback.
- Made hero copy/CTAs visible in server HTML, including when JavaScript is disabled.
- Removed hero parallax and reduced overlapping initial animation layers.
- Disabled continuous orbit/glow animations on small screens, while preserving static atmosphere.
- Reduced route-transition obstruction and kept reduced-motion support.
- Replaced the intro HUD’s repeated clock updates with scene-based progress.
- Disabled speculative Next.js link prefetch through SiteLink. The observed static-host segment 404s disappear while normal route navigation remains available.
- Changed PDF buttons/header links to ordinary, base-prefixed asset anchors so the router does not request RSC data for a PDF.
- Kept native image dimensions, the existing static export, and existing production font configuration.

No Lighthouse, Core Web Vitals, or hardware performance scores were collected. These are implementation changes and browser-observed behavior; no numerical performance gain is claimed.

## 6. Components and files changed in Phase 2

These changes build on the existing uncommitted Phase 1 work; no earlier work was reverted.

| Files                                                                                                                                         | Purpose                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| src/components/home/Hero.tsx                                                                                                                  | Recruiter-focused hierarchy, immediate primary content/actions, bounded atmosphere                   |
| src/components/home/FeaturedWork.tsx                                                                                                          | Shared three-project card presentation                                                               |
| src/components/home/WatchTrailerButton.tsx                                                                                                    | Explicit Play Intro trigger                                                                          |
| src/components/home/TechTeaser.tsx                                                                                                            | Shared static-host-safe link import                                                                  |
| src/components/projects/ProjectCard.tsx                                                                                                       | New reusable project comparison component                                                            |
| src/app/projects/page.tsx                                                                                                                     | Consistent responsive project grid                                                                   |
| src/app/projects/[slug]/page.tsx                                                                                                              | Reading scale, section anchors, investigation panel, previous/next and contact flow                  |
| src/components/projects/ArchitectureView.tsx                                                                                                  | Wrapping/spacing and responsive diagram refinements; hydration-safe preference                       |
| src/components/trailer/TrailerGate.tsx                                                                                                        | Opt-in playback and dynamic loading                                                                  |
| src/components/trailer/Trailer.tsx                                                                                                            | Native modal, standard keyboard behavior, clear controls, mobile layout, clean playback              |
| src/components/trailer/TrailerHud.tsx                                                                                                         | Scene-based progress without interval updates                                                        |
| src/components/ui/Modal.tsx                                                                                                                   | New shared accessible modal lifecycle and keyboard wrapping                                          |
| src/components/layout/Header.tsx                                                                                                              | Active state, modal mobile navigation, resize cleanup, PDF anchor                                    |
| src/components/layout/nav-items.ts                                                                                                            | Logical recruiter navigation order                                                                   |
| src/components/layout/Footer.tsx                                                                                                              | Larger link targets and shared navigation link behavior                                              |
| src/components/tech/TechMap.tsx                                                                                                               | Persistent touch/keyboard selection, reset, status, related projects                                 |
| src/app/tech/page.tsx                                                                                                                         | Updated interaction instructions                                                                     |
| src/components/episodes/SeasonBlock.tsx                                                                                                       | Anchored named season sections and clearer contrast                                                  |
| src/app/episodes/page.tsx                                                                                                                     | Career jump links                                                                                    |
| src/components/ui/ResumeNotice.tsx                                                                                                            | New reusable, visible resume-update note                                                             |
| src/app/contact/page.tsx                                                                                                                      | Resume notice and bounded email/link presentation                                                    |
| src/app/globals.css                                                                                                                           | Muted contrast, scroll offsets/gutter, wrapping, progress styling, mobile/reduced-motion refinements |
| src/components/ui/Button.tsx, Badge.tsx, Card.tsx, SectionHeading.tsx                                                                         | Target sizes, contrast, wrapping, restrained hover motion, fluid display scale                       |
| src/lib/use-reduced-motion.ts                                                                                                                 | New hydration-safe preference hook                                                                   |
| src/lib/use-reduced-motion.test.tsx                                                                                                           | Regression test reproducing server/client preference disagreement                                    |
| src/components/motion/Reveal.tsx, ClipReveal.tsx, DrawLine.tsx, Parallax.tsx, Stagger.tsx, RouteTransition.tsx; src/components/ui/Divider.tsx | Shared hydration-safe preference; nonblocking route fade                                             |
| src/components/ui/SiteLink.tsx                                                                                                                | New shared next/link wrapper with speculative prefetch disabled                                      |
| src/app/about/page.tsx, src/app/experience/page.tsx, src/app/not-found.tsx; link consumers above                                              | SiteLink import adoption without changing routes/facts                                               |
| src/components/layout/Header.test.tsx                                                                                                         | Expected navigation labels updated                                                                   |
| vitest.setup.ts, vitest.config.mts                                                                                                            | Media-query fixture and unit-test discovery separate from browser specs                              |
| playwright.config.ts, tests/browser/portfolio.spec.ts                                                                                         | New real-browser interaction, layout, console, and accessibility suite                               |
| scripts/serve-export.mjs                                                                                                                      | Literal production-prefix static preview, without route/payload rewrites                             |
| package.json, package-lock.json                                                                                                               | Development-only Playwright/axe tooling and test:e2e script                                          |
| PROJECT_CONTEXT.md, README.md, docs/KNOWN_LIMITATIONS.md                                                                                      | Current behavior, test instructions, and remaining release gates                                     |
| docs/ARCHITECTURE.md, docs/FILE_MAP.md, docs/CHANGE_GUIDE.md, docs/ANIMATION_SYSTEM.md                                                        | Phase 2 pointers distinguishing current behavior from earlier detailed implementation history        |
| docs/qa/*.png, docs/PHASE_2_REPORT.md                                                                                                         | Browser evidence and this delivery record                                                            |

Next.js configuration and deployment workflows were preserved. No runtime dependency, backend, CMS, or authentication service was added.

## 7. Actual validation and browser results

| Check                          | Result                                                                                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| npm run typecheck              | Passed: generated route types and TypeScript                                                                                                                                  |
| npm run lint                   | Passed without errors/warnings                                                                                                                                                |
| npm run test                   | Passed: 4 files, 21 tests, including the previous 20 checks and the hydration regression                                                                                      |
| npm run build                  | Passed with GITHUB_REPOSITORY=HarshitTeotia/Portfolio: 17 generated pages and all four case-study slugs                                                                       |
| npm run test:e2e               | Passed: 15 tests in the complete run                                                                                                                                          |
| Responsive browser matrix      | Passed: 11 public routes × six widths, with no content overflow detected                                                                                                      |
| Browser console/request check  | Passed: no observed console errors, page/hydration errors, or failed local requests across public routes and representative client navigation                                 |
| Keyboard/touch checks          | Passed: intro opening/closing/replay/completion, Tab wrapping, Escape, focus restoration, scroll cleanup, mobile menu routing/resize, persistent technology selection/reset   |
| No-JavaScript check            | Passed for homepage identity and the three primary links; Contact navigation worked                                                                                           |
| Axe WCAG A/AA checks           | Zero violations in the sampled public pages and both modal states                                                                                                             |
| Static link/asset verification | Passed: 397 local href/src references across 11 routes; production canonical/OG URLs and configured social links matched. PDF/portrait paths and case-study navigation passed |
| git diff --check               | Passed                                                                                                                                                                        |

Browser: installed **Chromium 153.0.8010.12**, automated headlessly with Playwright. The suite ran against the actual production export on a literal local /Portfolio host. Responsive/touch tests emulate viewport/input behavior; they are not physical-device tests. The preview was managed separately in this restricted environment to avoid child-process teardown limitations. Default Playwright configuration can manage the preview in ordinary environments.

The complete 15-test suite passed after the browser-discovered functional fixes. Three focused browser checks passed again after the final narrow Close-button styling correction: mobile intro, console/local requests, and sampled axe checks. Early failures are recorded in the audit above; final results do not count failed attempts as passes.

### Screenshots

- [Desktop homepage](qa/phase-2-home-desktop.png)
- [Mobile homepage, full page](qa/phase-2-home-mobile.png)
- [Mobile first screen](qa/phase-2-mobile-first-screen.png)
- [Mobile navigation](qa/phase-2-mobile-menu.png)
- [Mobile intro](qa/phase-2-intro-mobile.png)
- [Short landscape intro](qa/phase-2-intro-landscape.png)
- [Lending case study](qa/phase-2-lending-desktop.png)
- [Mobile lending architecture](qa/phase-2-architecture-mobile.png)

## 8. Remaining release blockers and limits

1. **Approved current resume PDF — release blocker.** The only repository PDF still contains May 2025–Present and 1+ year. No verified newer source/PDF was found. The existing asset path/file is retained, with visible update-pending notices. No replacement was generated from incomplete information.
2. **Dependency advisory review — release gate.** npm audit reported 15 advisories: 1 critical, 5 high, 9 moderate, including a critical Next.js flag. Framework/tooling applicability, exposure, and compatible updates require review before release. This phase did not automatically upgrade Next.js or claim the static site is exploitable or secured.
3. **Cross-browser/manual accessibility verification.** Chromium checks passed; Firefox, WebKit/Safari, physical devices, zoomed layouts, and manual screen-reader testing were not performed. Axe results cover sampled states rather than every possible interaction.
4. **External services.** User-supplied GitHub/LinkedIn/email values and local asset links are retained. Live remote availability and mailbox delivery are not guaranteed by local checks.
5. **Public project evidence.** No verified demo/video or public client-code URL was supplied. No placeholder demo button or fabricated evidence was added. ERP attribution remains neutral.
6. **Deployment workflow review.** Both existing Pages workflows remain. Consolidation is recommended before public deployment, without changing deployment behavior during this phase.

## 9. Suggested Phase 3 work before deployment

1. Supply and approve the current resume PDF at the existing asset path, then recheck the PDF text and all resume actions.
2. Triage npm audit findings and make a separate, validated dependency update where appropriate.
3. Validate keyboard/screen-reader behavior and visual layouts in Safari/WebKit and Firefox, on physical phones, and at browser zoom.
4. Run a measured Lighthouse/Core Web Vitals pass on a production-equivalent preview; prioritize observed bottlenecks rather than speculative optimization.
5. Consolidate the two GitHub Pages workflows, verify repository Pages settings, and rerun the static-prefix checks.
6. Add project video/demo evidence only when verified URLs and publication approval are supplied.
7. Review the screenshots and release gates, then deploy only after an explicit deployment instruction.

Phase 2 implementation and validation stop here. No commit, push, or deployment was performed.
