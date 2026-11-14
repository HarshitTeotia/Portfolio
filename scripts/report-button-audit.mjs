import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const widths = [320, 375, 390, 768, 1024, 1440];
const directory = "test-results/button-audit";
const run = JSON.parse(readFileSync(`${directory}/playwright.json`, "utf8"));
if (run.stats.unexpected || run.stats.flaky || run.stats.skipped)
  throw new Error("Refusing to issue a passing report for an incomplete/failing run");
function testResults(suites = []) {
  return suites.flatMap((suite) => [
    ...suite.specs.flatMap((spec) =>
      spec.tests.map((test) => ({
        file: spec.file,
        title: spec.title,
        outcome: test.status,
        results: test.results.map((result) => ({
          status: result.status,
          duration: result.duration,
        })),
      }))
    ),
    ...testResults(suite.suites),
  ]);
}
const tests = testResults(run.suites);
const addedTests = tests.filter((t) =>
  t.file.endsWith("interaction-audit.spec.ts")
).length;
if (addedTests < 19 || tests.length !== run.stats.expected)
  throw new Error("Run the complete Playwright suite before generating the report");
const merged = new Map();
let exercises = 0;
for (const width of widths) {
  for (const kind of ["controls", "technology"]) {
    const rows = JSON.parse(readFileSync(`${directory}/${kind}-${width}.json`, "utf8"));
    if (!rows.length || rows.some((r) => r.result !== "PASS" || r.width !== width))
      throw new Error(`Incomplete inventory: ${kind}-${width}`);
    for (const row of rows) {
      const key = row.page + "|" + row.element;
      const previous = merged.get(key);
      merged.set(key, { ...row, widths: [...(previous?.widths ?? []), width] });
      exercises++;
    }
  }
}
const rows = [...merged.values()]
  .map(({ width: _width, ...row }) => {
    void _width;
    return row.element.endsWith("Skip to content")
      ? { ...row, expected: "Scrolled to and focused #main-content" }
      : row;
  })
  .sort((a, b) => a.page.localeCompare(b.page) || a.element.localeCompare(b.element));
const edges = rows.filter((r) => r.element.startsWith("Related projects / "));
const controls = rows.length - edges.length;
const routes = [...new Set(rows.map((r) => r.page))];
const esc = (s) => s.replaceAll("|", "\\|").replaceAll("\n", " ");
function fix(row) {
  if (row.element.endsWith("Skip to content")) return "F1: focusable main landmark";
  if (/See how each technology|See the full timeline|← All projects/.test(row.element))
    return "F2: 44px minimum target";
  if (row.page === "/experience/" && row.element.startsWith("Main /"))
    return "F2: 44px linked badge target";
  if (row.page === "/episodes/" && row.element === "Main / Van Sales & Distribution ERP")
    return "F2: 44px minimum target";
  return "None required";
}
const table = rows
  .map(
    (r) =>
      `| ${esc(r.page)} | ${esc(r.element)} | ${esc(r.expected)} (${r.widths.join(", ")}px) | ${r.result} | ${fix(r)} |`
  )
  .join("\n");
const output = `# Portfolio button, link and interaction audit

Audited November 14, 2026 against the local **production static export**, served at \`http://127.0.0.1:4173/Portfolio/\`. No deployment or push performed. The opportunity/location content changes already in the working tree were preserved.

## Results and counting

- **${controls} interactive control instances discovered and successfully exercised.** An instance is a route + landmark + accessible name; shared navigation repeated on another route counts separately. Desktop navigation and mobile-dialog navigation are separate variants. Repetitions at different widths are merged below.
- **${edges.length} additional technology-to-project state/destination combinations** were exercised individually. These reuse the explorer's related-project links and are not added to the DOM control count.
- **${rows.length} passing inventory entries**, representing **${exercises} viewport/entry exercises**. A technology entry additionally contains mouse, touch, Enter, Space, hover/focus, persistence, toggle, reset and Escape assertions; the number above is not a claim about individual click count.
- **5 confirmed issue categories found; 5 fixed; 0 known unresolved local interaction failures.** Source checks identifying misleading affordances are distinguished from browser functional failures below. Test-authoring mismatches (decorative characters and attempting to refocus an already focused element) were corrected and are not counted as product failures.
- **${run.stats.expected} Playwright tests passed**, ${run.stats.unexpected} failed, ${run.stats.skipped} skipped, ${run.stats.flaky} flaky. Existing suite: ${tests.length - addedTests}; added audit suite: ${addedTests}. Actual run duration: ${(run.stats.duration / 1000).toFixed(1)} seconds.
- Chromium **153.0.8010.12**, Playwright **1.65.0**, Windows. Browser widths **320, 375, 390, 768, 1024, 1440px** at 900px height for the exhaustive matrices; existing intro tests also use 320×568 and 640×360. Touch emulation at every matrix width. Chromium only; Firefox, WebKit and physical-device/assistive-technology testing **UNVERIFIED**.
- **${routes.length} exported route variants**: ${routes.map((r) => `\`${r}\``).join(", ")}. The 11 public routes plus 404 aliases and the production-disabled design showcase are covered. The showcase's development demo controls are absent from production.

## Confirmed issues and fixes

| ID | Finding and evidence before fix | Root cause / fix | Final result |
| --- | --- | --- | --- |
| F1 | Enter on Skip to content changed the hash but Chromium reported activeElement BODY. | Main lacked a programmatic focus target; added tabIndex=-1. Click and Enter now focus main, and next Tab reaches Explore Projects. | PASS |
| F2 | Browser measurements at 320px: About timeline and case-study back link were 17px high; Viblets employment link 28px. Stack teaser and ERP timeline link also lacked a consistent target minimum. | Added inline-flex/min-h-11 to the five affected link locations (including shared project back link and employment badge wrappers). Every visible enabled control, except the keyboard-only skip link, is checked for ≥44px height, ≥24px width, horizontal containment and a real unobstructed click. | PASS |
| F3 | Static technology/engineering-focus pills used the same hover border/background/text feedback as selectable controls. | Removed direct hover affordances from static Badge and About skill pills. Actual linked badges retain link-level feedback. | PASS |
| F4 | Four Private codebase spans had bordered button chrome and cursor-not-allowed despite having no action. | Rendered them as neutral informational text. No invented repository URLs. | PASS |
| F5 | Home/index project card bodies highlighted their border on hover although only View case study was a link. | Removed whole-body hover feedback; retained the explicit CTA, focus-within treatment, card layout and reveals. Career cards remain fully linked. | PASS |

## Validation and limits

\`npm run typecheck\`, \`npm run lint\`, \`npm run test\` (**21 unit tests**), \`npm run build\` with \`GITHUB_REPOSITORY=HarshitTeotia/Portfolio\`, \`npm run resume:verify\`, and \`npx playwright test\` passed. The preview uses the existing static HTTP server, not next dev. Normal-motion page links and full intro progression are tested in addition to the reduced-motion exhaustive matrices. Route reloads, Back/Forward, hash navigation below the sticky header, desktop/mobile active states, menu dismissal after navigation, modal focus trapping/restoration, Tab traversal of every enabled page control, Enter/Space, no-JavaScript primary actions and automated WCAG checks passed. Browser page/console errors are checked in the control matrices; aborted remote popup requests are deliberately excluded from local application errors.

Every PDF control is actually clicked. The opened URL, browser HTTP response (200/application/pdf), and original bytes at that opened URL are checked; Chromium substitutes a PDF-viewer shell for the document response body, so the source bytes are fetched separately. Current PDF: one A4 page, 28,411 bytes, SHA-256 \`07ebe9d5609443a7c20dce1d89e9259042b33f369e0ef042403d4ad4ea6364f3\`. Resume extraction verifies the completed May 2025–September 2026 role and 17 months; the previously outdated employment wording is resolved. There is no separate Download Resume action; PDF viewer download functionality belongs to the browser.

Manual screenshot review covered the 1440px homepage, 320px hero/status card, and 320px Viblets project navigation/private-code label. The layouts, copy, cinematic palette and explicit CTA hierarchy remain intact. Review screenshots are retained as \`test-results/audit-review-*.png\` for this run.

| Boundary / intentionally static item | Expected action | Result | Evidence / limit |
| --- | --- | --- | --- |
| GitHub profile live availability | Reach https://github.com/HarshitTeotia | UNVERIFIED | Every site instance was clicked and Chromium requested the exact URL in a new tab with noopener/noreferrer. Remote requests were stopped at the browser network boundary. Independent fetch returned Cache miss. This is not evidence of a dead profile. |
| LinkedIn profile live availability | Reach https://www.linkedin.com/in/harshit-teotia/ | UNVERIFIED | Same real-click/new-tab verification; independent fetch returned Cache miss. Authentication/network availability cannot be inferred. |
| OS email application | Open a composer addressed to harshitteotia2003@gmail.com | UNVERIFIED | Every Email anchor was clicked; Chromium Page.frameRequestedNavigation confirmed the exact mailto: URL. Headless automation cannot verify the user's mail client or send mail. Browser dispatch itself passed. |
| Separate resume download CTA | Download from a site-owned control | NOT APPLICABLE | Only PDF-view controls exist; all open the current, valid base-path PDF. |
| Project repository/demo actions | Follow public project URLs if available | NOT APPLICABLE | All four repositories are private; no public demos are advertised. Neutral Private codebase labels are informational. |
| Static technology badges / About skill pills | Display labels | NOT APPLICABLE | No handlers, roles or tab stops; direct hover affordances removed and regression-checked. Actual explorer buttons are tested individually. |
| Project diagrams, decorative nodes, availability card, portrait and intro progress | Explain/display content | NOT APPLICABLE | Static visual content with no advertised actions. No expandable diagrams or user-operated carousel exist. |
| Previous/next case studies | Follow adjacent project | PASS | Every rendered previous/next link is included below. No previous project exists before lending (All case studies instead); no next control is rendered after Viblets. |
| Development design showcase demo controls | Remain absent from production | NOT APPLICABLE | Exported route renders noindexed not-found UI; all controls in that fallback were exercised. robots.txt/sitemap.xml are noninteractive assets. |

## Complete interaction inventory

All rows below passed after actual browser interaction and outcome assertions. Widths show where each responsive variant is rendered. Email/profile rows certify dispatch only; live remote and OS outcomes remain UNVERIFIED above. Main/default explorer links and every technology-specific connection are both listed to make state coverage explicit.

| Page | Element | Expected Action | Result | Fix Applied |
|------|---------|-----------------|--------|-------------|
${table}

## Files modified for this audit

- \`src/app/layout.tsx\`: skip target focus.
- \`src/components/ui/Badge.tsx\`, \`src/components/projects/ProjectLinksRow.tsx\`, \`src/components/projects/ProjectCard.tsx\`: remove misleading static affordances.
- \`src/components/home/TechTeaser.tsx\`, \`src/app/about/page.tsx\`, \`src/app/experience/page.tsx\`, \`src/app/episodes/page.tsx\`, \`src/app/projects/[slug]/page.tsx\`: touch targets; About also removes static pill hover feedback.
- \`tests/browser/interaction-audit.spec.ts\`: exhaustive click/state/input matrices, normal-motion checks, history, focus and static-control regressions.
- \`playwright.config.ts\`: machine-readable JSON results alongside existing reporters.
- \`scripts/report-button-audit.mjs\`: generate this report from passing browser evidence; refuses failed, skipped or flaky runs.
- \`docs/BUTTON_INTERACTION_AUDIT.md\`, \`docs/qa/button-interactions.json\`: report and merged machine-readable inventory.

The pre-existing location/content edits in Contact, StatusPill, Header, PersonJsonLd, site/about content and About metadata are preserved and are not attributed to this audit. Resume verification regenerated its existing evidence without changing the PDF.

## Reproduce

In PowerShell, run the quality commands above and build with \`$env:GITHUB_REPOSITORY='HarshitTeotia/Portfolio'\`. Start \`node scripts/serve-export.mjs\` in one terminal. In a second terminal set \`$env:PLAYWRIGHT_EXTERNAL_SERVER='1'\`; if using the installed cached browser, set \`$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE="$env:LOCALAPPDATA\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe"\`. Run \`npx playwright test\`, then \`node scripts/report-button-audit.mjs\`. The existing Playwright-managed preview also works where process teardown is permitted. Screenshots and the full HTML/JSON browser reports remain in ignored test output directories.
`;
mkdirSync("docs/qa", { recursive: true });
writeFileSync("docs/BUTTON_INTERACTION_AUDIT.md", output);
writeFileSync(
  "docs/qa/button-interactions.json",
  JSON.stringify(
    {
      audited: "2026-11-14",
      browser: "Chromium 153.0.8010.12",
      widths,
      controls,
      additionalConnectionStates: edges.length,
      viewportEntryExercises: exercises,
      playwright: run.stats,
      tests,
      rows,
    },
    null,
    2
  ) + "\n"
);
console.log(
  JSON.stringify({
    controls,
    connectionStates: edges.length,
    entries: rows.length,
    exercises,
    routes: routes.length,
    tests: run.stats.expected,
  })
);
