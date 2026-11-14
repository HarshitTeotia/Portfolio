# Phase 3 — Resume, Dependency Security & Release Readiness

Reviewed November 13, 2026. Work is local only. **No push, deployment, release creation, or remote repository-setting change was performed.**

## 1. Initial release audit

Phases 1 and 2 were preserved: verified professional facts, project priority/slugs, cinematic styling, optional intro, modal keyboard behavior, persistent technology selection, responsive layouts, and static /Portfolio paths.

The remaining issues were an outdated PDF without editable source, 15 npm findings (1 critical, 5 high, 9 moderate), Node 20 CI despite the test toolchain requiring Node 22.12+/24+, duplicate Pages deployment workflows, and stale resume-warning copy. The internal design-system showcase was also still rendered in production despite being described as internal.

Before changes, npm audit --json, npm ls next react react-dom, npm outdated, the lockfile, workflows, resume assets/links, configuration, prior reports, and existing browser tests were inspected. Before/after evidence is retained under [docs/qa/phase-3](qa/phase-3/).

## 2. Current resume and PDF verification

Created [editable LaTeX source](../resume/Harshit_Teotia_Resume.tex), an [editable-source-directory PDF](../resume/Harshit_Teotia_Resume.pdf), and the identical [production resume asset](../public/resume/Harshit_Teotia_Resume.pdf).

The resume contains the verified November 2026 identity, Bengaluru location, immediate availability, 17 months of experience, official Python Developer designation, completed May 2025–September 2026 Vrozart employment in Mohali, three primary projects, skills, and accurate MCA/BCA education. ERP remains a project without an unsupported employer/freelance attribution. Lending security work is described as a reproduced/analyzed failure with proposed mitigations, not a deployed production fix. No business-impact or scale metrics were invented.

Format: traditional, single-column A4 article; 10pt body; 0.35-inch vertical and 0.5-inch horizontal margins; black text; thin dividers; clickable contact links; no photo, icons, rating bars, or charts.

The source uses standard PDFLaTeX-compatible packages. Actual compilation used official **Tectonic 0.17.0**, a XeTeX-based engine, because PDFLaTeX was not installed. PDFLaTeX execution itself was not tested. The source avoids fontspec/system-font requirements, and its PDFTeX-specific Unicode mapping is conditional. Build instructions are in [resume/README.md](../resume/README.md).

Actual checks:

- One A4 page: **595.28 × 841.89 points**.
- Compiled PDF: **28,411 bytes**; source-directory, public, downloaded, and exported copies agree.
- SHA-256: `07ebe9d5609443a7c20dce1d89e9259042b33f369e0ef042403d4ad4ea6364f3`.
- PDF.js extracted the complete readable text, including dates, 17 months, project counts, technologies, and education; no Present/1+ year or unsupported senior title was found.
- Four link annotations match email, LinkedIn, GitHub, and Portfolio exactly.
- No text outside the verifier’s safe page bounds, no overfull TeX boxes in the final compile, and no raster-image paint operators.
- The rendered [resume preview](qa/phase-3/resume-preview.png) was visually inspected for layout, clipping, readable text, and single-column reading order.
- Browser request testing returned application/pdf at the existing /Portfolio/resume/Harshit_Teotia_Resume.pdf path, with byte/hash equality to the compiled PDF. Resume CTAs point to that path.

The compiler printed a Fontconfig configuration message on this Windows host; embedded Latin Modern fonts, extraction, page geometry, and rendered output verified correctly. No font substitution was introduced into the source. The final compile had no overfull layout warning. ATS-friendly text/structure was verified; no commercial ATS score is claimed.

The update-pending component and its Home/Contact references were removed only after the new PDF passed inspection.

Evidence: [PDF verification JSON](qa/phase-3/resume-verification.json), [extracted text](qa/phase-3/resume-extracted.txt), [tool versions](qa/phase-3/tooling.json).

## 3. Dependency security investigation and remediation

**Initial full-tree audit:** 15 findings: 1 critical, 5 high, 9 moderate.

**Final full-tree audit:** 7 moderate, **0 high / 0 critical**.

**Final production dependency audit:** **0 findings at every severity**.

Audit count reductions are corroborated by exact installed/locked versions and official advisory ranges, not just warning suppression. Thirteen distinct high/critical advisory records were retrieved from the official GitHub Advisory API; **26 installed package/range occurrences were checked, with zero remaining affected occurrences**. Official framework guidance also informed the decision to patch even features that are not used here. See [Next.js upstream security guidance](https://nextjs.org/blog/nextjs-security-update-october-14-2026).

No npm audit fix --force, framework downgrade, arbitrary dependency override, or major ESLint/TypeScript migration was used. A reviewed non-force audit fix was attempted for the residual tooling findings and made no changes; they remain explicitly tracked.

### Exact relevant version changes

| Dependency         | Before | After  | Decision                                                                                   |
| ------------------ | ------ | ------ | ------------------------------------------------------------------------------------------ |
| next               | 16.3.5 | 16.4.6 | Supported Next.js 16 security release; static export and React peer compatibility verified |
| eslint-config-next | 16.3.5 | 16.4.6 | Match framework release                                                                    |
| sharp              | 0.35.4 | 0.35.5 | Patched transitive SVG-processing library                                                  |
| source-map-js      | 1.2.1  | 1.2.2  | Patched source-map handling                                                                |
| undici             | 7.29.1 | 7.30.2 | Supported same-major transitive HTTP client patch                                          |
| vite               | 8.3.0  | 8.3.8  | Supported test-tool dependency update                                                      |
| vitest             | 5.0.1  | 5.0.3  | Targeted mock-registration/traversal security patch                                        |
| zod                | 4.6.5  | 4.6.7  | Supported transitive validation patch                                                      |
| react / react-dom  | 19.2.8 | 19.2.8 | Retained compatible pair; no root-package audit finding                                    |

All lockfile version changes, including related platform/tool subpackages, are recorded in [dependency-changes.json](qa/phase-3/dependency-changes.json). The exact before/final framework trees, outdated reports, and audits are retained beside it. Latest unrelated React, TypeScript, ESLint, animation-library, and formatting majors were not adopted merely to make npm outdated empty.

### High/critical advisory register

The linked official records establish affected ranges and first patched releases. These assessments distinguish public runtime, build-time, developer, and CI exposure; static hosting was not used as a reason to leave vulnerable versions installed.

| Advisory                                                                 | CVE in official record | Affected range → first patch                                                                                                                                                                                                   | Application exposure assessment and decision                                                                                                                                  |
| ------------------------------------------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j) | —                      | next: >= 16.2.0, < 16.3.6 → 16.3.6                                                                                                                                                                                             | Node ImageResponse with untrusted SVG values. No next/og route or external SVG input exists here; patched rather than waived.                                                 |
| [GHSA-cjq9-62q9-8jv4](https://github.com/advisories/GHSA-cjq9-62q9-8jv4) | CVE-2026-94483         | next: >= 16.0.0, < 16.3.8 → 16.3.8                                                                                                                                                                                             | Image-optimizer SSRF through configured remote images. Images are unoptimized with no remotePatterns; patched rather than relying on that configuration.                      |
| [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw) | —                      | next: >= 10.0.0, <= 15.5.27 → 15.5.28; next: >= 16.0.0, <= 16.4.0 → 16.4.1                                                                                                                                                     | glibc Linux SVG image-optimization RCE. No live optimizer runs on Pages; Linux CI/build tooling still warranted an update.                                                    |
| [GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r) | CVE-2026-94482         | next: >= 13.0.0, <= 15.5.27 → 15.5.28; next: >= 16.0.0, <= 16.4.0 → 16.4.1                                                                                                                                                     | App Router Server Action CPU exhaustion. No Server Actions are present; version updated regardless.                                                                           |
| [GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr) | —                      | next: >= 16.0.0, <= 16.4.0 → 16.4.1                                                                                                                                                                                            | Cache Components/use cache typed-array RCE. Those features are not used, but the maintainer recommends upgrading even without similar functions.                              |
| [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) | —                      | sharp: < 0.35.5 → 0.35.5                                                                                                                                                                                                       | Transitive sharp/librsvg SVG processing risk on glibc Linux. No public optimizer or untrusted uploaded images; patched for build/tooling safety.                              |
| [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | CVE-2026-93749         | source-map-js: >= 1.0.0, < 1.2.2 → 1.2.2                                                                                                                                                                                       | Transitive source-map parser event-loop DoS. Relevant to build/source-map processing rather than a public Node endpoint; patched.                                             |
| [GHSA-xjj6-f33q-929c](https://github.com/advisories/GHSA-xjj6-f33q-929c) | CVE-2026-109869        | undici: >= 6.23.0, < 6.29.1 → 6.29.1; undici: >= 7.18.0, < 7.30.1 → 7.30.1; undici: >= 8.0.0, < 8.12.2 → 8.12.2                                                                                                                | Transitive undici fetch crash from malicious encoded HTTP responses. Present through test tooling; outbound tooling traffic cannot be dismissed as static-host safe.          |
| [GHSA-4w7w-5xrc-9h26](https://github.com/advisories/GHSA-4w7w-5xrc-9h26) | CVE-2026-109829        | undici: >= 7.0.0, < 7.30.1 → 7.30.1; undici: >= 8.0.0, < 8.12.2 → 8.12.2                                                                                                                                                       | undici shared-cache redirect poisoning under a specific interceptor composition. No such application code found; test/tool dependency patched.                                |
| [GHSA-2m5v-pch6-74hx](https://github.com/advisories/GHSA-2m5v-pch6-74hx) | CVE-2026-109383        | undici: >= 4.0.0, < 6.29.1 → 6.29.1; undici: >= 7.0.0, < 7.30.1 → 7.30.1; undici: >= 8.0.0, < 8.12.2 → 8.12.2                                                                                                                  | undici Agent custom TLS callback loss. No custom Agent/TLS pinning is configured; test/tool dependency patched.                                                               |
| [GHSA-qrxm-fqhp-jwvm](https://github.com/advisories/GHSA-qrxm-fqhp-jwvm) | CVE-2026-87018         | undici: >= 4.2.1, < 6.29.1 → 6.29.1; undici: >= 7.0.0, < 7.30.1 → 7.30.1; undici: >= 8.0.0, < 8.12.2 → 8.12.2                                                                                                                  | undici process crash on TLS 1.2 renegotiation by a contacted endpoint. No public Node service, but outbound tool requests still justify patching.                             |
| [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm) | CVE-2026-112942        | launch-editor: <= 2.14.1 → 2.14.2; vite: >= 8.3.0, <= 8.3.2 → 8.3.3; vite: >= 8.2.0, <= 8.2.3 → 8.2.4; vite: >= 8.0.0, <= 8.1.5 → 8.1.6; vite: >= 7.0.0, <= 7.3.6 → 7.3.7; vite: <= 6.4.3 → 6.4.4; vite-plus: <= 1.0.0 → 1.1.0 | Vite/launch-editor Windows command-injection chain. Windows is used locally; Vite is test infrastructure, not the deployed app server. Patched through supported Vite update. |
| [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) | CVE-2023-54404         | zod: < 4.6.6 → 4.6.6                                                                                                                                                                                                           | Transitive Zod collection-validation memory exhaustion. No public form/API validation service; configuration/lint tooling dependency patched.                                 |

For the SVG-processing issue, the Next.js maintainer notice and sharp advisory identify **CVE-2026-96889** even though the API’s cve_id field is empty for the associated GHSA records. Other blank CVE cells mean the retrieved record did not provide one; the GHSA remains the precise identifier.

Evidence: [official advisory snapshot](qa/phase-3/advisories.json), [installed-version range checks](qa/phase-3/patched-range-checks.json), [initial audit](qa/phase-3/audit-before.json), [final audit](qa/phase-3/audit-final.json), [production-only audit](qa/phase-3/audit-production.json).

### Remaining moderate development-only issue

[GHSA-g3hv-75wg-m249 / CVE-2026-118764](https://github.com/advisories/GHSA-g3hv-75wg-m249) concerns minimatch pattern amplification with optimizationLevel >= 2. The advisory covers >=7.0.0 <11.0.1 and identifies 11.0.1 as patched.

The installed affected copy is **minimatch 10.2.6**, under **@typescript-eslint/typescript-estree 8.72.2**. That supported parent requires **^10.2.2**; current typescript-eslint is 8.72.2. npm counts the same issue through six additional TypeScript-ESLint chain entries, yielding seven moderate package findings. A minimatch 11 override would violate the parent’s declared major range, so it was not introduced without upstream compatibility support.

Applicability assessment: this copy is development-only lint/parser infrastructure. The portfolio has no interface accepting glob patterns and does not ship this tooling as a public request service. The project’s ESLint configuration does not enable optimizationLevel 2 or external pattern input; the installed minimatch default is 1. Fixed repository configuration, read-only CI permissions, and bounded job timeouts further limit the current workflow exposure. This is an assessed, nonblocking tooling follow-up, **not a claim that the vulnerable library was fixed**.

Remediation: adopt an upstream compatible TypeScript-ESLint release using a patched minimatch range when available, then rerun lint, tests, build, and audit. Do not feed attacker-controlled glob patterns into the tooling meanwhile. Current audit gates fail on high/critical findings while retaining visibility into this moderate issue.

## 4. Production configuration and hosting audit

- Retained output: export, trailingSlash, unoptimized images, existing project slugs, GitHub Pages base-path derivation, and explicit public asset prefixing. No backend or server-only security mechanism was added.
- Production build used GITHUB_REPOSITORY=HarshitTeotia/Portfolio. All four case studies remain statically generated.
- Consolidated duplicate deployment workflows: removed nextjs.yml and retained **one workflow_dispatch-only deploy.yml**. Pushing runs CI; deployment now requires an explicit manual workflow action.
- CI/deploy use Node 24 and verified official action releases with Node 24 runtimes (or a composite artifact action). The package engine range matches Vitest’s supported Node range. Next.js peer constraints accept the retained React 19.2.8 pair.
- Added npm audit --audit-level=high, production-export verification, and Playwright/axe regression gates. CI permissions are read-only; build jobs have a 15-minute limit. No remote workflow was triggered.
- The optional SITE_URL variable passes through an environment variable rather than direct shell interpolation.
- The design-system showcase calls notFound in production, preserving local development access while excluding showcase content from production rendering. The generated route is a noindex not-found response; a static host may return HTTP 200 for an existing fallback HTML file. The browser test verifies absence of QA content rather than misreporting that as an authenticated route.
- Checked **397 local href/src references across 11 public routes**. All resolved under /Portfolio, including fonts, favicon, portrait, styles/scripts, and the current PDF.
- Sitemap entries, canonical URLs, route Open Graph metadata, Twitter metadata, robots exclusions, and Person JSON-LD were checked. Root positioning remains Harshit Teotia — Python Backend Developer | AI & GenAI Engineer. The description now naturally includes Generative AI and Qdrant alongside FastAPI, REST APIs, PostgreSQL, LLMs, RAG, and Google ADK.
- Person JSON-LD retains Python Developer as the professional title and does not claim a current Vrozart employer.
- No localhost/stale resume-warning/current-employment copy was found in the checked production HTML. Docs and local QA tools are not published in the export.
- A bounded high-confidence credential-pattern scan of source/config and 102 exported text assets found no matches. Authored project content was reviewed for internal URLs, customer records, private client code, secrets, and exploit payloads; none were found. This is not an exhaustive secret-scanner certification.

**HTTP security limits:** GitHub Pages serves static files; Next.js headers/server settings would not become hosting response controls. No unsupported header configuration was added or credited as protection. Live HTTPS settings, custom response headers, and account/repository access controls must be verified on the hosting platform during the separately approved deployment step. See [GitHub Pages hosting model](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## 5. Validation and browser/accessibility evidence

| Check                                  | Actual result                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------ |
| npm run typecheck                      | PASS — route generation and TypeScript                                                     |
| npm run lint                           | PASS — no errors/warnings                                                                  |
| npm run test                           | PASS — 4 files, 21 tests                                                                   |
| npm run build                          | PASS — Next.js 16.4.6 production static export; 17 generated pages; all four project slugs |
| npm run test:e2e                       | PASS — final 17-test browser suite                                                         |
| npm run resume:verify                  | PASS — one A4 page, current facts, annotations, bounds, no raster images, byte equality    |
| npm run verify:export                  | PASS — 11 routes, 397 local references, 102 scanned text assets                            |
| npm audit --json                       | 7 moderate development-only chain findings; 0 high/critical                                |
| npm audit --omit=dev --json            | PASS — 0 findings                                                                          |
| Official advisory/lockfile range check | PASS — 13 high/critical advisories, 26 installed occurrences, 0 affected                   |
| Workflow YAML/configuration inspection | PASS locally — manual deployment only; Node 24; audit/export/browser gates                 |
| git diff --check                       | PASS                                                                                       |

Browser environment: Node 24.14.0, Playwright 1.65.0, Chromium 153.0.8010.12, local literal static preview at /Portfolio. Browser tests use the production export without SPA/RSC rewrites. All prior browser tests were retained; resume integrity and production QA-content exclusion checks were added.

Responsive matrix: all 11 public content routes at **320, 375, 390, 768, 1024, and 1440px**. No content/document horizontal overflow was detected. Additional interactions use 320×568, 390×844 touch/menu, and 640×360 landscape contexts.

Covered interactions include optional initial intro state; close/skip/Escape, Tab wrapping and focus restoration; normal/reduced-motion completion; mobile navigation selection/resize/active state; touch/keyboard technology selection/reset; all project links, investigation anchors, previous/next navigation; no-JavaScript homepage identity/primary actions; and a console/page-error/local-request check. No hydration errors, failed local requests, or page/console errors were observed in that final regression check.

**Exact axe coverage:** Home, Projects, Technologies, About, Contact, Experience, Career/Episodes, and the MSME lending case study, plus open intro and mobile navigation dialog states. The configured WCAG 2 A/AA and WCAG 2.1 A/AA page scans, and modal A/AA scans, reported **zero violations**. This is representative automated coverage, not complete WCAG certification. Other project pages were covered by route/layout tests; they were not all individually axe-audited.

Live GitHub/LinkedIn requests through the web tool returned cache/access failures. Their configured destinations and PDF annotations are correct, but live service reachability is **UNVERIFIED**. Mailbox delivery was not tested. The currently deployed site is not a substitute for the new local export and was not modified.

## 6. Measured production performance

Lighthouse **13.6.0**, Chromium **153.0.8010.12**, one final isolated run per preset against the local production export. The initial CLI measurement encountered process-teardown limitations; the retained final measurements use an explicitly managed browser, after browser regression testing had completed. No concurrent browser test suite ran during the final measured navigation.

| Metric                                      | Mobile          | Desktop         |
| ------------------------------------------- | --------------- | --------------- |
| Performance score                           | 99              | 100             |
| Accessibility / Best practices / SEO scores | 100 / 100 / 100 | 100 / 100 / 100 |
| First contentful paint                      | 1.361 s         | 0.292 s         |
| Largest contentful paint                    | 1.361 s         | 0.292 s         |
| Total blocking time                         | 121 ms          | 0 ms            |
| Cumulative layout shift                     | 0               | 0               |
| Speed index                                 | 1.361 s         | 0.325 s         |

Mobile preset: simulated 150ms RTT, 1638.4 Kbps throughput, 4× CPU slowdown, 412×823 viewport. Desktop: simulated 40ms RTT, 10240 Kbps throughput, 1× CPU, 1350×940 viewport. The local server does not compress responses or reproduce GitHub’s CDN/header behavior. These are single-run lab results, not field Core Web Vitals, deployment measurements, or a guarantee that future runs score identically.

Resource review: 14 requests, approximately 882 KB total uncompressed transfer; eight script resources account for approximately 615 KB and three fonts for 112 KB. Lighthouse reports roughly 267 KB potentially unused JavaScript for the initial route, which includes framework/motion code; this does not establish that an entire dependency can safely be removed. No homepage image or third-party request was recorded. The 204 KB portrait is confined to About; the resume is roughly 28 KB.

Existing dynamic intro loading, disabled speculative prefetch, static hero content, dimensions, font display swapping, and mobile/reduced-motion behavior were retained. No unsupported performance target or before/after gain is claimed. Further removal of cinematic motion or framework code was not justified by this measured pass and would exceed the requested release-hardening scope.

Evidence: [performance summary](qa/phase-3/performance-summary.json), [mobile Lighthouse report](qa/phase-3/lighthouse-mobile.json), [desktop Lighthouse report](qa/phase-3/lighthouse-desktop.json).

## 7. Modified files and reasons

| Files                                                                                                       | Reason                                                                                               |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| resume/Harshit_Teotia_Resume.tex, resume/Harshit_Teotia_Resume.pdf, public/resume/Harshit_Teotia_Resume.pdf | Maintainable verified resume source and matching compiled/production PDFs                            |
| resume/README.md                                                                                            | Compilation, engine provenance, inspection instructions, ATS limits                                  |
| scripts/build-resume.ps1                                                                                    | PDFLaTeX/Tectonic build, overfull-box gate, asset copy                                               |
| scripts/verify-resume.mjs                                                                                   | PDF text, links, page/bounds/image checks and rendered evidence                                      |
| scripts/verify-export.mjs                                                                                   | Reusable production prefix, links/assets, metadata, PDF, QA-content, and bounded credential checks   |
| scripts/measure-performance.mjs                                                                             | Reproducible isolated Lighthouse measurements using an owned browser                                 |
| package.json, package-lock.json                                                                             | Targeted patched versions, compatible Node engine, verification scripts                              |
| .gitignore                                                                                                  | Ignore local compiler/audit tool cache and intermediate resume build files                           |
| src/content/site.ts                                                                                         | Natural verified Generative AI/Qdrant discoverability in shared summary/metadata                     |
| src/components/ui/ResumeNotice.tsx (removed), src/components/home/Hero.tsx, src/app/contact/page.tsx        | Remove obsolete pending-resume notice after verification                                             |
| src/app/dev/design-system/page.tsx                                                                          | Production not-found guard for internal QA content                                                   |
| tests/browser/portfolio.spec.ts                                                                             | Current PDF integrity/CTA regression and production QA exclusion                                     |
| .github/workflows/ci.yml                                                                                    | Supported actions/Node, read permissions, timeout, audit/export/browser gates                        |
| .github/workflows/deploy.yml                                                                                | Single explicit manual deployment workflow with matching validation gates and safe variable handling |
| .github/workflows/nextjs.yml (removed)                                                                      | Eliminate duplicate automatic deployment path                                                        |
| README.md, PROJECT_CONTEXT.md, docs/KNOWN_LIMITATIONS.md                                                    | Current resume/security/workflow state and remaining limitations                                     |
| docs/qa/phase-3/*                                                                                           | Audit/version/advisory/PDF/export/source/performance evidence                                        |
| docs/PHASE_3_REPORT.md                                                                                      | This release decision record                                                                         |

All prior uncommitted phase work was preserved. The cinematic UI, project slugs, verified professional content, technology graph, and Next.js static-export configuration were not redesigned or replaced.

## 8. Release readiness checklist

| Area                              | Status     | Basis / limitation                                                                                                                                   |
| --------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resume accuracy                   | PASS       | Verified November profile, correct dates/title, visually inspected one-page PDF                                                                      |
| Resume download                   | PASS       | Correct production path, PDF content type, byte/hash equality                                                                                        |
| TypeScript validation             | PASS       | Actual typecheck and production compilation                                                                                                          |
| ESLint                            | PASS       | Actual lint run                                                                                                                                      |
| Unit tests                        | PASS       | 21 tests                                                                                                                                             |
| Browser tests                     | PASS       | 17 production-export tests                                                                                                                           |
| Accessibility checks              | PASS       | Zero violations in the stated automated sample; manual assistive-tech testing remains unverified                                                     |
| Mobile responsiveness             | PASS       | Six-width route matrix and touch/short-viewport interactions                                                                                         |
| Security advisories               | PASS       | No high/critical or production audit findings; exact patch ranges checked; one assessed moderate dev-only issue retained through seven chain entries |
| Static export                     | PASS       | Build and literal static-host browser tests                                                                                                          |
| GitHub Pages base paths           | PASS       | 397 local references resolved under /Portfolio                                                                                                       |
| SEO and metadata                  | PASS       | Root positioning, per-route canonical/OG/Twitter, JSON-LD, robots/sitemap checks                                                                     |
| External links                    | UNVERIFIED | Destinations correct; live fetch/cache failures and no mail-delivery test                                                                            |
| Confidential information exposure | PASS       | No finding in bounded source/export pattern and content review; not an exhaustive certification                                                      |
| Remote CI / hosting controls      | UNVERIFIED | YAML inspected; no Actions workflow, deployment, or live hosting-setting change executed                                                             |

## 9. Recommendation and remaining follow-up

**Locally ready for a separately approved GitHub Pages deployment**, with the documented moderate tooling follow-up and explicit remote-verification limits. The outdated resume and all high/critical dependency findings have been resolved with current artifacts, supported versions, range checks, and passing regressions. No applicable critical vulnerability is being waived solely on the basis of static export.

Before invoking the manual release workflow, review the resume/report, confirm GitHub Pages source/HTTPS/environment settings, and check external social destinations in a normal browser. After deployment, validate live canonical/assets/PDF and host response behavior. Track the upstream compatible minimatch/TypeScript-ESLint remediation, and add non-Chromium/physical-device/manual screen-reader testing as follow-up. Run the audit again at release time because advisories change.

No deployment approval was requested or exercised in this phase. Work stops at local release readiness.
