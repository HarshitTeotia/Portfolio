# Known limitations

Reviewed November 13, 2026. See [Phase 3 report](PHASE_3_REPORT.md) for current release validation.

## Content and assets

- The current one-page resume is compiled from editable LaTeX in resume/. No commercial ATS score is claimed.
- Project repositories are private/unlinked. No verified demo URL has been supplied. Lending supports an optional demo field; null renders no button.
- ERP employment attribution remains unconfirmed. Its role is Backend Developer, without a freelance/company label or employer-season association.
- Lending security work establishes reproduction, analysis, and proposed mitigations only. No complete fix or deployed safeguards are claimed.
- Remote social/live-site reachability and mail delivery are separate from local URL and asset checks. See the report for verification limits.

GitHub, LinkedIn, email, resume links, and the existing portrait are configured. Production metadata defaults to the confirmed GitHub Pages URL.

## UX and verification

- Intro is now optional and lazy-loaded. Normal hold time remains 19s; reduced-motion hold time is 10s.
- Intro and mobile menu now use a native dialog with Tab wrapping, Escape, background inertness, scroll locking, and focus restoration.
- Technology selection supports touch, click, Enter, Escape, and Reset; hover/focus remain previews.
- Case studies now have section anchors and previous/next navigation.
- Playwright and axe checks are configured and were run. Lighthouse was measured in Phase 3. Real-device testing, non-Chromium browsers, and manual assistive-technology testing remain outside the measured results.
- Missing speculative RSC requests were reproduced in Phase 2 and avoided with SiteLink prefetch=false. PDF links bypass the App Router. The final browser console/local-request regression test passes.
- Google Fonts require network access during a production build.
- Deployment is consolidated into one manual workflow. Actual GitHub Actions execution and live hosting settings remain unverified until a separately approved release.

## Release gates

- Current resume is verified locally and no longer blocks release.
- The production dependency audit reports zero findings. Seven moderate development-only TypeScript-ESLint/minimatch findings remain; their supported parent range cannot take the patched minimatch major. Exact scope and follow-up are documented in Phase 3; no incompatible override was applied.

## Technical debt

- JS motion timing and CSS timing tokens require manual synchronization.
- Trailer text/visual signal timings require coordinated edits.
- Z-index and container-width choices are not centralized.
- Button prop narrowing is verbose but functional.

Phase 1 resolved duplicated root identity metadata, stale employment content, and raw resume/photo paths missing the GitHub Pages prefix. No business metrics, security fixes, or public project URLs were fabricated.
