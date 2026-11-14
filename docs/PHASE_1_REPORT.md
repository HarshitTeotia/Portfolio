# Phase 1 Portfolio Review — November 13, 2026

## Initial audit

The existing application already had a useful content-driven architecture, reusable components, cinematic dark/violet styling, three architecture visualization formats, reciprocal technology relationships, and static GitHub Pages deployment. These were retained.

The main issues were factual and editorial:

- Vrozart employment and its career season still ended in “Present”; the hero reported current employment.
- Hero and SEO copy gave less prominence to professional Python/backend experience and applied AI work than to the cinematic framing.
- Project order placed hospitality above ERP. Lending lacked the verified prompt-injection investigation; ERP asserted freelance attribution and several technical details outside the verified brief.
- About implied current work across historical projects. All projects, including ERP, were assigned to the employer season.
- Documentation incorrectly described GitHub, LinkedIn, resume, and photo as missing, despite existing source URLs and assets.
- Root metadata duplicated identity strings; canonical and per-route sharing URLs were absent. The metadata origin defaulted to localhost.
- Raw Footer/Contact resume anchors and photo URLs omitted the GitHub Pages base path.
- Two existing workflows deploy to GitHub Pages. They remain intact; consolidation is a separate maintenance recommendation.

The existing PDF was inspected by decompressing its text stream. It contains “May 2025–Present” and “1+ year,” so it does not match the November 2026 profile. The original PDF was preserved.

## Implemented changes

The shared profile now establishes 17 months of professional development, the official Python Developer designation, completed May 2025–September 2026 employment in Mohali, current Bengaluru location, immediate availability, and openness to remote roles. Experience includes backend/API work, AI/document workflows, React contributions, tests, cross-functional collaboration, and HRMS involvement explicitly framed as a cross-functional assignment.

Home provides Explore Projects, View Resume, and Contact Me CTAs. Trailer replay remains available as a secondary link. Home features the three primary case studies; the project index retains Viblets as additional work. No cinematic redesign or trailer activation/timing change was performed.

Case studies retain their slugs and architecture components. Lending adds optional investigation and lessons sections plus an optional demo field with no fabricated URL. ERP uses the neutral Backend Developer label and is no longer assigned to the employer season. HAUT emphasizes connected operational workflows without claims about traffic, transaction volume, revenue, or scale.

The technology map remains reciprocal and project-evidenced. React, REST APIs, RAG, and RBAC relationships were added where supported. Unverified project-specific tools/details were removed from the primary case studies and map. Embeddings are described without asserting a provider. Additional verified skills, including n8n, are displayed separately without invented project usage or proficiency scores.

Root SEO uses shared identity content. Public routes have canonical URLs, route-specific Open Graph and Twitter metadata, and the verified production origin. Person JSON-LD keeps the official professional title and does not identify a current employer. Sitemap route generation remains intact; robots disallows the base-prefixed internal QA route. Raw resume/photo paths now respect /Portfolio.

## Final homepage copy

**Python Backend Developer | AI & GenAI Engineer**

Python Developer with 17 months of professional experience building FastAPI backends, REST APIs, AI-powered document workflows, and business applications. Hands-on with LLM integrations, RAG pipelines, Google ADK agents, PostgreSQL, and cross-functional product development.

Availability: **Available for Opportunities**. Based in Bengaluru, India. Available to join immediately; open to remote software engineering and AI engineering opportunities.

## Project priority and focus

| Order     | Title                                              | Preserved route                       | Case-study focus                                                                                                                           |
| --------- | -------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1         | MSME Lending & AI-Powered Loan Management Platform | /projects/vrozart-finance/            | Loan/document APIs, OCR and extraction, metadata/chunking, embeddings/Qdrant/RAG, Google ADK, React/API integration, LLM data integrity    |
| 2         | Van Sales & Distribution ERP                       | /projects/van-sales-distribution-erp/ | Nine business modules, 16 roles, approval/validation/audit workflows, 18 migrations, 176+ tests; MissingGreenlet as a supporting challenge |
| 3         | HAUT: Hospitality Booking & Operations Platform    | /projects/haut/                       | Bookings, POS/billing, KDS/order management, QR ordering, inventory workflows, client integration, authentication/RBAC                     |
| Secondary | Viblets                                            | /projects/viblets/                    | Existing Google ADK/FastAPI/PostgreSQL/Facebook Business onboarding narrative preserved                                                    |

The lending investigation reports an anonymized INR 3 LPA source figure versus an INR 15 LPA manipulated response. It explains the document/instruction trust boundary and proposed grounding, instruction separation, and source validation. It does not disclose payloads, internal code, customer data, or secrets; it does not claim a complete fix or deployed safeguards.

## Files changed and why

Paths below are relative to the repository root.

| File                                              | Reason                                                                                          |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| src/content/site.ts                               | Shared professional positioning, summary, availability, location, and SEO identity              |
| src/content/about.ts                              | Verified biography and existing portrait configuration                                          |
| src/content/experience.ts                         | Closed employment dates, location, engineering highlights, cross-functional HRMS assignment     |
| src/content/education.ts                          | Full BCA/MCA degree names and accurate specialization                                           |
| src/content/seasons.ts                            | Correct education/employment timeline and historical role story                                 |
| src/content/projects.ts                           | Primary project order, verified contributions, diagrams, investigation, lessons, optional demo  |
| src/content/technologies.ts                       | Supported reciprocal project/technology relationships                                           |
| src/content/skills.ts                             | Other verified hands-on skills without undocumented project attribution                         |
| src/content/categories.ts                         | Frontend grouping for supported React usage                                                     |
| src/content/types.ts                              | Optional investigation/lessons, experience location, supported technology/category types        |
| src/content/social.ts                             | Correct stale placeholder commentary; verified URLs retained                                    |
| src/content/content.test.ts                       | Regression checks for closed employment/timeline consistency, resume presence, absent demo URLs |
| src/components/home/Hero.tsx                      | Visible career headline/summary and three primary CTAs                                          |
| src/components/home/StatusPill.tsx                | Immediate availability/location instead of current-employer status                              |
| src/components/home/FeaturedWork.tsx              | Three primary case studies, all-projects link, neutral attribution fallback                     |
| src/components/home/WatchTrailerButton.tsx        | Secondary trailer replay styling                                                                |
| src/components/layout/Footer.tsx                  | Base-prefixed raw resume anchor                                                                 |
| src/components/seo/PersonJsonLd.tsx               | Official professional title, location, factual capabilities, no current employer                |
| src/components/trailer/visuals/CareerTimeline.tsx | BCA caption compatible with full degree name; corrected date example                            |
| src/app/page.tsx                                  | Homepage canonical and sharing metadata                                                         |
| src/app/layout.tsx                                | Shared SEO identity; appropriate text-only Twitter summary card                                 |
| src/app/about/page.tsx                            | Base-prefixed existing portrait, historical contributions heading, route SEO                    |
| src/app/contact/page.tsx                          | Location/availability copy, resume prefix, route SEO, shorter content reveal delay              |
| src/app/experience/page.tsx                       | Historical role SEO and visible work location                                                   |
| src/app/episodes/page.tsx                         | Employer-associated episodes only; neutral separate ERP link; route SEO                         |
| src/app/projects/page.tsx                         | Recruiter-friendly title/intro, additional-project label, neutral role fallback, route SEO      |
| src/app/projects/[slug]/page.tsx                  | Contribution framing, optional investigation/lessons, neutral attribution, route SEO            |
| src/app/tech/page.tsx                             | Additional skills display and route SEO                                                         |
| src/app/robots.ts                                 | Base-prefixed internal QA exclusion                                                             |
| src/lib/asset-path.ts                             | Shared prefix for raw public asset URLs                                                         |
| src/lib/page-metadata.ts                          | Consistent canonical/Open Graph/Twitter metadata per route                                      |
| src/lib/site-url.ts                               | Verified production default and URL normalization                                               |
| src/lib/urls.test.ts                              | Root/project-hosting asset and sharing metadata regression checks                               |
| .env.example                                      | Verified optional production URL override example                                               |
| .github/workflows/deploy.yml                      | Correct metadata-default comments; workflow behavior retained                                   |
| README.md                                         | Current profile/project overview, real clone URL, resume/social/deployment notes                |
| PROJECT_CONTEXT.md                                | Current architecture, source map, factual rules, assets, deployment, maintenance                |
| docs/PROJECT_CONTEXT.md                           | Pointer to canonical context instead of a duplicated stale copy                                 |
| docs/ARCHITECTURE.md                              | Reconcile changed data flow, metadata, project priority, assets, tests                          |
| docs/FILE_MAP.md                                  | Correct component consumers, availability, asset and metadata notes                             |
| docs/CHANGE_GUIDE.md                              | Correct profile/photo/SEO editing guidance                                                      |
| docs/KNOWN_LIMITATIONS.md                         | Actual remaining factual, UX, verification, and maintenance limitations                         |
| docs/PHASE_1_REPORT.md                            | This audit and delivery record                                                                  |

No dependencies, public assets, framework configuration, CSS design tokens, architecture rendering components, or project slugs were replaced. No commit, push, or deployment was performed.

## Unresolved facts and verification limits

1. **Resume replacement:** an approved current PDF is still needed. The existing file remains accessible through the preserved path.
2. **ERP attribution:** the old portfolio says freelance, while the outdated PDF mentions ERP under experience. The November brief does not establish attribution conclusively. No freelance/company claim is made for ERP.
3. **Project demos/public code:** no verified URLs supplied; none invented. Optional lending demo support is ready.
4. **Security remediation:** only reproduction, analysis, and proposed mitigations are confirmed. No completed security fix is claimed.
5. **Business impact:** no revenue, scale, traffic, savings, or transaction claims added. Verified engineering counts are retained.
6. **Remote links:** GitHub, LinkedIn, live portfolio, and deployed PDF fetches were attempted through the web tool; cache/access errors prevented live reachability confirmation. User-supplied URL values were preserved. Email has a valid mailto target; mailbox delivery was not tested.
7. **Browser QA:** no interactive browser, viewport, Lighthouse, or automated accessibility run was performed. Static output inspection and build/test results do not substitute for these checks.

## Validation results

| Check             | Actual result                                                                                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| npm run typecheck | Passed: route types generated; TypeScript completed without errors                                                                                                                                                           |
| npm run lint      | Passed without errors or warnings                                                                                                                                                                                            |
| npm run test      | Passed: 3 files, 20 tests, including reciprocal technology graph checks                                                                                                                                                      |
| npm run build     | Passed with GITHUB_REPOSITORY=HarshitTeotia/Portfolio; 17 generated pages, including all four project detail routes                                                                                                          |
| Export inspection | Passed across 11 public content routes: 387 local href/src references resolved, correct /Portfolio prefixes, canonical/OG URLs, sitemap entries, official Person title, no current employer or stale employment copy in HTML |
| git diff --check  | Passed                                                                                                                                                                                                                       |

The initial restricted production build failed because next/font could not reach Google Fonts. A network-enabled build then passed with the existing font configuration. No font substitution or dependency change was required.

The resume PDF is intentionally excluded from the clean-HTML employment finding because its stale content is a known unresolved asset issue.

## Prioritized Phase 2 visual and UX recommendations

1. **Recruiter access:** make the 19-second first-session trailer optional, keeping replay visible. Lead directly with career positioning, project evidence, and contact/resume actions.
2. **Modal accessibility:** add focus management/restoration, focus containment, and body-scroll locking; verify keyboard and reduced-motion behavior.
3. **Mobile hierarchy:** review the long lending/HAUT titles, name-to-role balance, CTA wrapping, and availability placement at narrow widths with real browser checks.
4. **Project scanning:** consider concise role/evidence summaries, section anchors, and next/previous navigation within the current cinematic design. Add a verified video only when supplied.
5. **Technology map:** add a persistent touch/tap interaction and a clear reset state; verify keyboard parity.
6. **Measured QA:** audit contrast, focus visibility, reveal delays, mobile performance, and navigation/prefetch behavior before further motion refinements.

Separate maintenance: replace the approved resume when available and review the two GitHub Pages deployment workflows for consolidation.

Phase 1 ends here. No full visual or trailer redesign has been started.
