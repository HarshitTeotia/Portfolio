import { test, expect, type Page, type Locator } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { projects } from "../../src/content/projects";
import { technologies } from "../../src/content/technologies";

const origin = "http://127.0.0.1:4173";
const root = origin + "/Portfolio/";
const pdf = root + "resume/Harshit_Teotia_Resume.pdf";
const widths = [320, 375, 390, 768, 1024, 1440];
const pages: Record<string, string> = {
  "": "Python Backend Developer | AI & GenAI Engineer",
  "experience/": "Where the real-world work happens",
  "projects/": "Backend & Applied AI Projects",
  "tech/": "The stack, mapped",
  "episodes/": "The career timeline",
  "about/": "Harshit Teotia",
  "contact/": "Let's build useful software.",
  ...Object.fromEntries(projects.map((p) => ["projects/" + p.slug + "/", p.title])),
  "404.html": "This one didn't make the cut.",
  "404/": "This one didn't make the cut.",
  "_not-found/": "This one didn't make the cut.",
  "dev/design-system/": "This one didn't make the cut.",
};
const nav: Record<string, string> = {
  Home: "",
  Experience: "experience/",
  Projects: "projects/",
  Technologies: "tech/",
  Career: "episodes/",
  About: "about/",
  Contact: "contact/",
};
const profiles: Record<string, string> = {
  Email: "mailto:harshitteotia2003@gmail.com",
  GitHub: "https://github.com/HarshitTeotia",
  LinkedIn: "https://www.linkedin.com/in/harshit-teotia/",
};
type Row = {
  page: string;
  element: string;
  expected: string;
  result: "PASS";
  width: number;
};
type Control = {
  index: number;
  name: string;
  scope: string;
  tag: string;
  href: string | null;
};
function save(name: string, rows: Row[]) {
  mkdirSync("test-results/button-audit", { recursive: true });
  writeFileSync(`test-results/button-audit/${name}.json`, JSON.stringify(rows, null, 2));
}
async function ready(page: Page) {
  await expect(page.locator("main h1")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  // A native menu toggle also confirms hydration before collecting portal controls.
  await expect(page.locator("header")).toBeVisible();
}
async function snapshot(page: Page, selector = "a, button"): Promise<Control[]> {
  return page.locator(selector).evaluateAll((elements) =>
    elements.flatMap((el, index) => {
      if (!el.getClientRects().length || getComputedStyle(el).visibility === "hidden")
        return [];
      const label = el.cloneNode(true) as Element;
      label.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove());
      return [
        {
          index,
          name: (el.getAttribute("aria-label") || label.textContent || "")
            .replace(/\s+/g, " ")
            .trim(),
          scope: el.closest("dialog")
            ? "Mobile navigation"
            : el.closest("header")
              ? "Header"
              : el.closest("footer")
                ? "Footer"
                : el.closest("main")
                  ? "Main"
                  : "Layout",
          tag: el.tagName,
          href: el.getAttribute("href"),
        },
      ];
    })
  );
}
// Expected destinations come from the content contract and labels, never from the
// clicked href. An unknown control fails the audit instead of silently passing.
function destination(name: string): string {
  if (name === "Skip to content") return "#main-content";
  if (name.includes("Resume")) return pdf;
  for (const [label, url] of Object.entries(profiles))
    if (name.startsWith(label)) return url;
  if (name === "Harshit Teotia" || name === "Back to Home") return root;
  if (name in nav) return root + nav[name];
  if (
    /^(Explore Projects|Explore all projects|View Projects|←?\s*All projects|←?\s*All case studies)/.test(
      name
    )
  )
    return root + "projects/";
  if (/^(Contact Me|Get in touch)/.test(name)) return root + "contact/";
  if (name.startsWith("See how each technology")) return root + "tech/";
  if (name.startsWith("See the full timeline")) return root + "episodes/";
  const anchors: Record<string, string> = {
    Problem: "#problem",
    Architecture: "#architecture",
    Contributions: "#contributions",
    "LLM investigation": "#investigation",
  };
  if (name in anchors) return anchors[name];
  if (/^S0[123] ·/.test(name)) return "#" + name.slice(0, 3).toLowerCase();
  const project = projects.find((p) => name.includes(p.title));
  if (project) return root + "projects/" + project.slug + "/";
  throw new Error("Control has no independently specified outcome: " + name);
}
async function targetSize(control: Locator, name: string) {
  await control.scrollIntoViewIfNeeded();
  const box = await control.boundingBox();
  expect(box, name).not.toBeNull();
  expect(box!.x, name).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width, name).toBeLessThanOrEqual(
    await control.page().evaluate(() => innerWidth + 1)
  );
  expect(box!.height, name + " touch height").toBeGreaterThanOrEqual(44);
  expect(box!.width, name + " touch width").toBeGreaterThanOrEqual(24);
}

for (const width of widths) {
  test(`complete production control inventory and real clicks at ${width}px`, async ({
    page,
    context,
    request,
  }) => {
    test.setTimeout(300_000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const rows: Row[] = [];
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("response", (r) => {
      if (r.url().startsWith(origin) && r.status() >= 400)
        errors.push(r.status() + " " + r.url());
    });
    const externalRequests: string[] = [];
    // Exercise new-tab navigation through Chromium, stop at the network boundary.
    // This verifies dispatch, not remote availability (reported separately).
    await context.route(/^https:\/\//, async (route) => {
      externalRequests.push(route.request().url());
      await route.abort("blockedbyclient");
    });
    const session = await context.newCDPSession(page);
    await session.send("Page.enable");
    const mailRequests: string[] = [];
    session.on("Page.frameRequestedNavigation", (e) => {
      if (e.url.startsWith("mailto:")) mailRequests.push(e.url);
    });
    async function clickLink(control: Locator, name: string) {
      const expected = destination(name);
      const href = await control.getAttribute("href");
      expect(new URL(href!, page.url()).href).toBe(
        expected.startsWith("#") ? new URL(expected, page.url()).href : expected
      );
      await expect(control).toBeVisible();
      await expect(control).toBeEnabled();
      if (name !== "Skip to content") await targetSize(control, name);
      if (expected.startsWith("mailto:")) {
        const count = mailRequests.length;
        await control.click();
        await expect.poll(() => mailRequests.slice(count)).toContain(expected);
        return "Browser dispatched " + expected + "; OS mail client not verified";
      }
      if (expected.startsWith("https:")) {
        await expect(control).toHaveAttribute("target", "_blank");
        await expect(control).toHaveAttribute("rel", /noopener/);
        const count = externalRequests.length;
        const opened = page.waitForEvent("popup");
        await control.click();
        const popup = await opened;
        await expect.poll(() => externalRequests.slice(count)).toContain(expected);
        await popup.close();
        return "New tab requested " + expected + "; remote reachability not verified";
      }
      if (expected === pdf) {
        const response = context.waitForEvent("response", {
          predicate: (r) => r.url() === pdf,
        });
        const opened =
          (await control.getAttribute("target")) === "_blank"
            ? page.waitForEvent("popup")
            : null;
        await control.click();
        const served = await response;
        expect(served.status()).toBe(200);
        expect(served.headers()["content-type"]).toContain("application/pdf");
        const viewer = opened ? await opened : page;
        await expect(viewer).toHaveURL(pdf);
        // Chromium replaces the document response body with its PDF viewer shell;
        // fetch the URL it actually opened to compare the original PDF bytes.
        const bytes = await request.get(viewer.url());
        expect(await bytes.body()).toEqual(
          readFileSync("public/resume/Harshit_Teotia_Resume.pdf")
        );
        if (opened) await viewer.close();
        return "Opened current PDF (HTTP 200, application/pdf, byte-for-byte match)";
      }
      if (name === "Skip to content") await control.focus();
      await control.click();
      if (expected.startsWith("#")) {
        await expect(page).toHaveURL(new RegExp(expected + "$"));
        await expect(page.locator(expected)).toBeInViewport();
        if (expected === "#main-content")
          await expect(page.locator(expected)).toBeFocused();
        else
          expect(
            await page.locator(expected).evaluate((e) => e.getBoundingClientRect().top)
          ).toBeGreaterThanOrEqual(71);
        return expected === "#main-content"
          ? "Scrolled to and focused #main-content"
          : "Scrolled to " + expected + " below sticky header";
      }
      await expect(page).toHaveURL(expected);
      await expect(page.locator("main h1")).toHaveText(
        pages[expected.slice(root.length)]
      );
      await expect(page.getByRole("dialog")).toHaveCount(0);
      return "Opened " + new URL(expected).pathname + " with correct heading";
    }
    for (const [route, heading] of Object.entries(pages)) {
      const source = root + route;
      await page.goto(source);
      await ready(page);
      await expect(page.locator("main h1")).toHaveText(heading);
      async function restoreSource() {
        if (page.url() !== source) await page.goBack();
        await expect(page).toHaveURL(source);
        await expect(page.locator("main h1")).toHaveText(heading);
        await ready(page);
      }
      const controls = await snapshot(page);
      const knownButtons = [
        "Open menu",
        "Play Intro",
        "Reset selection",
        ...technologies.map((t) => t.name),
      ];
      for (const control of controls.filter((c) => c.tag === "BUTTON")) {
        expect(knownButtons, "Uncovered button: " + control.name).toContain(control.name);
      }
      for (const entry of controls) {
        if (entry.tag === "BUTTON") continue; // stateful controls exercised below / explorer matrix
        const control = page.locator("a, button").nth(entry.index);
        const expected = await clickLink(control, entry.name);
        rows.push({
          page: "/" + route,
          element: entry.scope + " / " + entry.name,
          expected,
          result: "PASS",
          width,
        });
        await restoreSource();
      }
      if (width < 1024) {
        const open = page.getByRole("button", { name: "Open menu" });
        await targetSize(open, "Open menu");
        await open.click();
        await expect(open).toHaveAttribute("aria-expanded", "true");
        const dialog = page.getByRole("dialog");
        const close = dialog.getByRole("button", { name: /Close menu/ });
        await expect(close).toBeFocused();
        await targetSize(close, "Close menu");
        await close.click();
        await expect(dialog).toHaveCount(0);
        await expect(open).toBeFocused();
        for (const name of ["Open menu", "Close menu"])
          rows.push({
            page: "/" + route,
            element: (name === "Open menu" ? "Header / " : "Mobile navigation / ") + name,
            expected: "Open / close dialog, restore focus, unlock body",
            result: "PASS",
            width,
          });
        await open.click();
        const mobile = await snapshot(page, "dialog a");
        await close.click();
        for (const entry of mobile) {
          await page.getByRole("button", { name: "Open menu" }).click();
          const control = page.locator("dialog a").nth(entry.index);
          const current = Object.entries(nav).find(
            ([, dest]) =>
              route === dest || (dest === "projects/" && route.startsWith(dest))
          )?.[0];
          if (entry.name === current)
            await expect(control).toHaveAttribute("aria-current", "page");
          else await expect(control).not.toHaveAttribute("aria-current", "page");
          const expected = await clickLink(control, entry.name);
          rows.push({
            page: "/" + route,
            element: "Mobile navigation / " + entry.name,
            expected,
            result: "PASS",
            width,
          });
          await restoreSource();
        }
      } else {
        const active = page
          .getByRole("navigation", { name: "Primary", exact: true })
          .locator('[aria-current="page"]');
        const current = Object.entries(nav).find(
          ([, dest]) => route === dest || (dest === "projects/" && route.startsWith(dest))
        )?.[0];
        if (current) await expect(active).toHaveText(current);
        else await expect(active).toHaveCount(0);
      }
      if (!route) {
        const play = page.getByRole("button", { name: "Play Intro" });
        for (const action of ["Close intro", "Skip intro", "Escape"]) {
          await targetSize(play, "Play Intro");
          await play.click();
          const dialog = page.getByRole("dialog");
          await expect(dialog).toBeVisible();
          await expect(dialog.getByRole("status")).toContainText("Scene 1 of 4");
          if (action === "Escape") await page.keyboard.press("Escape");
          else {
            const button = dialog.getByRole("button", { name: action });
            await targetSize(button, action);
            await expect(button).toBeInViewport();
            await button.click();
          }
          await expect(dialog).toHaveCount(0);
          await expect(play).toBeFocused();
          await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
          if (action !== "Escape")
            rows.push({
              page: "/",
              element: "Intro / " + action,
              expected: "Dismiss intro and restore Play Intro focus",
              result: "PASS",
              width,
            });
        }
        rows.push({
          page: "/",
          element: "Main / Play Intro",
          expected: "Open optional intro from scene 1; replay after dismissal",
          result: "PASS",
          width,
        });
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        route
      ).toBe(true);
    }
    expect(errors).toEqual([]);
    save("controls-" + width, rows);
  });
}

for (const width of widths) {
  test(`every technology with mouse, touch, Enter, Space and related links at ${width}px`, async ({
    browser,
  }) => {
    test.setTimeout(240_000);
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      hasTouch: true,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const rows: Row[] = [];
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(root + "tech/");
    await expect(
      page.getByRole("region", { name: "Technology explorer" }).locator("..")
    ).not.toHaveAttribute("style", /./);
    const reset = page.getByRole("button", { name: "Reset selection" });
    const related = page.getByRole("complementary", { name: "Related projects" });
    async function allProjects() {
      await expect(related.getByRole("link")).toHaveText(
        projects.map((p) => p.title + "↗")
      );
      await expect(reset).toBeDisabled();
    }
    await allProjects();
    for (const tech of technologies) {
      const button = page.getByRole("button", { name: tech.name, exact: true });
      const connected = projects.filter((p) => tech.usedIn.includes(p.id));
      const names = connected.map((p) => p.title + "↗");
      for (const mode of ["mouse", "touch", "Enter", "Space"]) {
        await targetSize(button, tech.name);
        if (mode === "mouse") await button.click();
        else if (mode === "touch") await button.tap();
        else {
          await button.focus();
          await page.keyboard.press(mode);
        }
        await expect(button).toHaveAttribute("aria-pressed", "true");
        await expect(page.getByRole("status")).toContainText(
          tech.name + " · " + tech.usedIn.length + " related projects"
        );
        await page.mouse.move(0, 0);
        await reset.focus();
        await expect(related.getByRole("link")).toHaveText(names);
        await expect(related.getByRole("heading")).toHaveText(tech.name + " / Projects");
        // Persistent selection survives pointer leave and focus elsewhere.
        await expect(button).toHaveAttribute("aria-pressed", "true");
        if (mode === "touch") await reset.tap();
        else if (mode === "Space") {
          await button.focus();
          await page.keyboard.press("Escape");
        } else if (mode === "Enter") {
          await button.focus();
          await page.keyboard.press("Enter");
        } else await reset.click();
        await allProjects();
      }
      // Preview changes displayed data without changing committed selection.
      await button.hover();
      await expect(related.getByRole("link")).toHaveText(names);
      await expect(button).toHaveAttribute("aria-pressed", "false");
      await page.mouse.move(0, 0);
      await reset.focus();
      await allProjects();
      await page.locator("main").focus();
      await button.focus();
      await expect(related.getByRole("link")).toHaveText(names);
      await reset.focus();
      await allProjects();
      // Every technology-to-project edge must navigate, not just show an href.
      for (const project of connected) {
        await button.tap();
        const link = related.getByRole("link", { name: project.title, exact: false });
        await link.click();
        await expect(page).toHaveURL(root + "projects/" + project.slug + "/");
        await expect(page.locator("main h1")).toHaveText(project.title);
        await page.goto(root + "tech/");
        await expect(
          page.getByRole("region", { name: "Technology explorer" }).locator("..")
        ).not.toHaveAttribute("style", /./);
        rows.push({
          page: "/tech/",
          element: "Related projects / " + tech.name + " → " + project.title,
          expected:
            "Select technology, display documented connection, open correct case study",
          result: "PASS",
          width,
        });
      }
      rows.push({
        page: "/tech/",
        element: "Technology explorer / " + tech.name,
        expected:
          "Mouse, touch, Enter, Space, hover/focus preview, persistence, toggle, reset and Escape with correct project data",
        result: "PASS",
        width,
      });
    }
    rows.push({
      page: "/tech/",
      element: "Technology explorer / Reset selection",
      expected:
        "Disabled at rest; clear every technology by mouse/touch; restore all four projects",
      result: "PASS",
      width,
    });
    await page.getByRole("button", { name: "Qdrant", exact: true }).click();
    await page.getByRole("button", { name: "Python", exact: true }).hover();
    await expect(related.getByRole("link")).toHaveCount(4);
    await expect(
      page.getByRole("button", { name: "Qdrant", exact: true })
    ).toHaveAttribute("aria-pressed", "true");
    await page.mouse.move(0, 0);
    await expect(related.getByRole("link")).toHaveCount(1);
    await reset.click();
    expect(errors).toEqual([]);
    save("technology-" + width, rows);
    await context.close();
  });
}

test("keyboard skip, visible focus, native activation and both modal focus cycles", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(root);
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await expect(skip).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /^Explore Projects/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(root + "projects/");
  const open = page.getByRole("button", { name: "Open menu" });
  for (const key of ["Enter", "Space"]) {
    await open.focus();
    await page.keyboard.press(key);
    const dialog = page.getByRole("dialog");
    const close = dialog.getByRole("button", { name: /Close menu/ });
    await expect(close).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("link", { name: "View Resume" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    // Traverse every menu control with actual Tab before testing Escape.
    for (let i = 0; i < 9; i++) await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await expect(close).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Escape");
    await expect(open).toBeFocused();
  }
  await page.goto(root);
  const play = page.getByRole("button", { name: "Play Intro" });
  for (const key of ["Enter", "Space"]) {
    await play.focus();
    await page.keyboard.press(key);
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("button", { name: "Close intro" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Skip intro" })).toBeFocused();
    await page.keyboard.press(key);
    await expect(dialog).toHaveCount(0);
    await expect(play).toBeFocused();
  }
});

test("direct reload and browser Back/Forward preserve routes, anchors and active navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [route, heading] of Object.entries(pages)) {
    await page.goto(root + route);
    await page.reload();
    await expect(page.locator("main h1")).toHaveText(heading);
    await page.locator("header").getByRole("link", { name: "Harshit Teotia" }).click();
    await expect(page).toHaveURL(root);
    await expect(page.locator("main h1")).toHaveText(pages[""]);
    if (!route) continue;
    await page.goBack();
    await expect(page).toHaveURL(root + route);
    await expect(page.locator("main h1")).toHaveText(heading);
    await page.goForward();
    await expect(page).toHaveURL(root);
  }
  await page.goto(root + "projects/vrozart-finance/");
  await page.getByRole("link", { name: "Architecture", exact: true }).click();
  await expect(page.locator("#architecture")).toBeInViewport();
  await page.getByRole("link", { name: "Contributions", exact: true }).click();
  await expect(page).toHaveURL(/#contributions$/);
  await page.goBack();
  await expect(page).toHaveURL(/#architecture$/);
  await expect(page.locator("#architecture")).toBeInViewport();
  await page.goForward();
  await expect(page).toHaveURL(/#contributions$/);
});

test("static badges, private-code labels, diagrams and card bodies have no false controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of [
    "",
    "projects/",
    "about/",
    ...projects.map((p) => "projects/" + p.slug + "/"),
  ]) {
    await page.goto(root + route);
    const tags = page.locator("main span.rounded-full");
    for (const tag of await tags.all()) {
      if (await tag.evaluate((e) => !!e.closest("a, button"))) continue;
      expect(await tag.getAttribute("class")).not.toMatch(
        /(?:^|\s)hover:|cursor-pointer/
      );
      await expect(tag).not.toHaveAttribute("tabindex");
    }
    const privateLabel = page.getByText("Private codebase", { exact: true });
    if (await privateLabel.count()) {
      await expect(privateLabel).toHaveCSS("cursor", "auto");
      await expect(privateLabel).toHaveCSS("border-top-width", "0px");
      expect(await privateLabel.evaluate((e) => !!e.closest("a, button"))).toBe(false);
    }
    for (const card of await page.locator("article[aria-labelledby]").all()) {
      expect(await card.getAttribute("class")).not.toContain("hover:");
      await expect(card.getByRole("link")).toHaveCount(1);
    }
  }
});

test("normal-motion reveals leave every page-specific navigation link clickable", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of Object.keys(pages)) {
    await page.goto(root + route);
    await ready(page);
    const controls = (await snapshot(page)).filter(
      (c) => c.scope === "Main" && c.tag === "A"
    );
    for (const entry of controls) {
      const expected = destination(entry.name);
      if (!expected.startsWith(root) && !expected.startsWith("#")) continue;
      if (expected === pdf) continue; // PDF controls are clicked at all six widths above.
      await page.goto(root + route);
      const control = page.locator("a, button").nth(entry.index);
      await control.click();
      if (expected.startsWith("#")) {
        await expect(page).toHaveURL(new RegExp(expected + "$"));
        await expect(page.locator(expected)).toBeInViewport();
      } else {
        await expect(page).toHaveURL(expected);
        await expect(page.locator("main h1")).toHaveText(
          pages[expected.slice(root.length)]
        );
      }
    }
  }
  expect(errors).toEqual([]);
});

for (const width of [390, 1440]) {
  test(`Tab reaches every enabled control with visible focus at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of Object.keys(pages)) {
      await page.goto(root + route);
      await ready(page);
      if (route === "tech/")
        await expect(
          page.getByRole("region", { name: "Technology explorer" }).locator("..")
        ).not.toHaveAttribute("style", /./);
      const expected = (await snapshot(page))
        .filter((c) => c.name !== "Reset selection")
        .map((c) => c.scope + " / " + c.name);
      const visited = new Set<string>();
      // The disabled Reset control can become enabled during focus preview; allow
      // that extra stop while requiring all initially enabled controls to be reached.
      for (let i = 0; i < expected.length + 4; i++) {
        await page.keyboard.press("Tab");
        const active = page.locator(":focus");
        const id = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el?.matches("a, button")) return null;
          const label = el.cloneNode(true) as Element;
          label.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove());
          const name = (el.getAttribute("aria-label") || label.textContent || "")
            .replace(/\s+/g, " ")
            .trim();
          const scope = el.closest("header")
            ? "Header"
            : el.closest("footer")
              ? "Footer"
              : el.closest("main")
                ? "Main"
                : "Layout";
          return scope + " / " + name;
        });
        if (id !== null) {
          visited.add(id);
          await expect(active).toHaveCSS("outline-style", "solid");
          await expect(active).toBeInViewport();
        }
        if (expected.every((id) => visited.has(id))) break;
      }
      expect(
        expected.filter((id) => !visited.has(id)),
        route
      ).toEqual([]);
    }
  });
}

test("touch activates every mobile menu destination and both intro dismiss controls", async ({
  browser,
}) => {
  test.setTimeout(120_000);
  for (const width of [320, 375, 390, 768]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      hasTouch: true,
      isMobile: true,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(root);
    const open = page.getByRole("button", { name: "Open menu" });
    await open.tap();
    await page.getByRole("button", { name: /Close menu/ }).tap();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    for (const [label, route] of Object.entries(nav)) {
      await open.tap();
      await page
        .getByRole("navigation", { name: "Mobile", exact: true })
        .getByRole("link", { name: label, exact: true })
        .tap();
      await expect(page).toHaveURL(root + route);
      await expect(page.locator("main h1")).toHaveText(pages[route]);
      await expect(page.getByRole("dialog")).toHaveCount(0);
    }
    await page.goto(root);
    for (const name of ["Skip intro", "Close intro"]) {
      await page.getByRole("button", { name: "Play Intro" }).tap();
      await page.getByRole("dialog").getByRole("button", { name }).tap();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    }
    await context.close();
  }
});
