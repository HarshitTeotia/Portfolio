import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

// Optional audit tooling stays outside the application lockfile.
const toolRoot = path.resolve(".tools/pdf/node_modules/lighthouse/core");
const { default: lighthouse } = await import(
  pathToFileURL(path.join(toolRoot, "index.js"))
);
const { default: desktop } = await import(
  pathToFileURL(path.join(toolRoot, "config/desktop-config.js"))
);
const summaries = [];
for (const [index, kind] of ["mobile", "desktop"].entries()) {
  const port = 9230 + index;
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    args: [`--remote-debugging-port=${port}`],
  });
  try {
    const result = await lighthouse(
      "http://127.0.0.1:4173/Portfolio/",
      {
        port,
        output: "json",
        logLevel: "error",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      },
      kind === "desktop" ? desktop : undefined
    );
    if (result.lhr.runtimeError) throw new Error(JSON.stringify(result.lhr.runtimeError));
    fs.writeFileSync(`docs/qa/phase-3/lighthouse-${kind}.json`, result.report);
    const lhr = result.lhr;
    const summary = {
      kind,
      lighthouse: lhr.lighthouseVersion,
      chromium: browser.version(),
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([name, category]) => [
          name,
          Math.round(category.score * 100),
        ])
      ),
      metrics: Object.fromEntries(
        [
          "first-contentful-paint",
          "largest-contentful-paint",
          "total-blocking-time",
          "cumulative-layout-shift",
          "speed-index",
        ].map((id) => [id, lhr.audits[id].numericValue])
      ),
      resources: lhr.audits["resource-summary"].details.items,
      settings: {
        throttling: lhr.configSettings.throttling,
        throttlingMethod: lhr.configSettings.throttlingMethod,
        screen: lhr.configSettings.screenEmulation,
      },
      conditions:
        "Single local headless run per preset against the uncompressed static preview; no browser regression suite running concurrently. Not deployed field data.",
    };
    summaries.push(summary);
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await browser.close();
  }
}
fs.writeFileSync(
  "docs/qa/phase-3/performance-summary.json",
  JSON.stringify(summaries, null, 2) + "\n"
);
