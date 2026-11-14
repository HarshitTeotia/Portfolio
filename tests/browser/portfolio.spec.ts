import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const routes = [
  "",
  "experience/",
  "projects/",
  "tech/",
  "episodes/",
  "about/",
  "contact/",
  "projects/vrozart-finance/",
  "projects/van-sales-distribution-erp/",
  "projects/haut/",
  "projects/viblets/",
];

test("development-only design showcase is absent from production content", async ({
  request,
}) => {
  const response = await request.get("dev/design-system/");
  const content = await response.text();
  expect(content).not.toContain("Tokens and primitives showcase");
  if (response.status() === 200) expect(content).toContain("noindex");
  else expect(response.status()).toBe(404);
});

test("current resume is served intact at the production path and every resume CTA agrees", async ({
  page,
  request,
}) => {
  const expected = readFileSync("resume/Harshit_Teotia_Resume.pdf");
  const response = await request.get("resume/Harshit_Teotia_Resume.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  const downloaded = await response.body();
  expect(downloaded.subarray(0, 5).toString()).toBe("%PDF-");
  expect(createHash("sha256").update(downloaded).digest("hex")).toBe(
    createHash("sha256").update(expected).digest("hex")
  );
  await page.goto("./");
  await expect(
    page.getByRole("link", { name: "View Resume", exact: true })
  ).toHaveAttribute("href", "/Portfolio/resume/Harshit_Teotia_Resume.pdf");
  await expect(page.getByText("Resume PDF update pending", { exact: false })).toHaveCount(
    0
  );
  await page.goto("contact/");
  await expect(
    page.getByRole("link").filter({ hasText: "Resume" }).first()
  ).toHaveAttribute("href", "/Portfolio/resume/Harshit_Teotia_Resume.pdf");
});

async function ready(page: Page) {
  await page.locator("main h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
}

for (const width of [320, 375, 390, 768, 1024, 1440]) {
  test(`public routes fit ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of routes) {
      const response = await page.goto(route || "./");
      expect(response?.status(), route).toBe(200);
      await ready(page);
      const overflow = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        return [
          ...document.querySelectorAll(
            "main h1, main h2, main h3, main p, main a, main button"
          ),
        ]
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && (rect.left < -1 || rect.right > width + 1);
          })
          .map((el) => el.textContent?.slice(0, 80));
      });
      expect(overflow, route).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth
        )
      ).toBe(true);
      if (route === "" && [390, 1440].includes(width)) {
        await page.screenshot({
          path: info.outputPath(`home-${width}.png`),
          fullPage: true,
        });
      }
    }
  });
}

test("intro is opt-in, traps focus, restores focus, and replays from the first scene", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await ready(page);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const play = page.getByRole("button", { name: "Play Intro" });
  await play.click();
  const dialog = page.getByRole("dialog", { name: "Harshit Teotia / Intro" });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole("button", { name: "Close intro" });
  const skip = dialog.getByRole("button", { name: "Skip intro" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(play).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await play.click();
  await expect(dialog.getByRole("status")).toContainText("Scene 1 of 4");
  await skip.click();
  await expect(play).toBeFocused();
  await play.click();
  await close.click();
  await expect(play).toBeFocused();
  expect(errors).toEqual([]);
});

test("reduced-motion intro completes and mobile controls stay usable", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await page.getByRole("button", { name: "Play Intro" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.screenshot({ path: info.outputPath("intro-mobile.png") });
  await expect(dialog.getByRole("button", { name: "Skip intro" })).toBeInViewport();
  await expect(dialog.getByRole("button", { name: "Close intro" })).toBeInViewport();
  await expect(dialog).toHaveCount(0, { timeout: 15_000 });
  await expect(page.getByRole("button", { name: "Play Intro" })).toBeFocused();
});

test("mobile navigation supports keyboard, route changes, resize, and active state", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.screenshot({ path: info.outputPath("mobile-menu.png") });
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Mobile", exact: true })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(page).toHaveURL(/\/Portfolio\/projects\/$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await toggle.click();
  await expect(
    page
      .getByRole("navigation", { name: "Mobile", exact: true })
      .getByRole("link", { name: "Projects", exact: true })
  ).toHaveAttribute("aria-current", "page");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("touch technology selection persists and can be reset", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/Portfolio/tech/");
  const qdrant = page.getByRole("button", { name: "Qdrant", exact: true });
  await qdrant.tap();
  await expect(qdrant).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("status")).toContainText("Qdrant · 1 related projects");
  await expect(
    page.getByRole("complementary", { name: "Related projects" }).getByRole("link")
  ).toHaveCount(1);
  await page.getByRole("button", { name: "Reset selection" }).tap();
  await expect(qdrant).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.getByRole("complementary", { name: "Related projects" }).getByRole("link")
  ).toHaveCount(4);
  await qdrant.focus();
  await page.keyboard.press("Enter");
  await expect(qdrant).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(qdrant).toHaveAttribute("aria-pressed", "false");
  await context.close();
});

test("case-study links, section anchors, assets, and next navigation work", async ({
  page,
  request,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("projects/");
  const links = page.getByRole("link", { name: /^View case study:/ });
  await expect(links).toHaveCount(4);
  await links.first().click();
  await expect(page).toHaveURL(/vrozart-finance\/$/);
  await ready(page);
  await page.screenshot({ path: info.outputPath("lending-desktop.png"), fullPage: true });
  await page.getByRole("link", { name: "LLM investigation", exact: true }).click();
  await expect(page.locator("#investigation")).toBeInViewport();
  await expect(page.locator("#investigation")).toContainText("have not been verified");
  await page.getByRole("link", { name: /^Next case study/ }).click();
  await expect(page).toHaveURL(/van-sales-distribution-erp\/$/);
  for (const asset of ["resume/Harshit_Teotia_Resume.pdf", "harshit.jpg"]) {
    expect((await request.get(asset)).status()).toBe(200);
  }
});

test("normal intro progresses through all scenes and fits a short landscape viewport", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 640, height: 360 });
  await page.clock.install();
  await page.goto("./");
  await page.getByRole("button", { name: "Play Intro" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.clock.runFor(3500);
  await page.screenshot({ path: info.outputPath("intro-landscape.png") });
  await page.clock.runFor(1000);
  await expect(dialog.getByRole("status")).toContainText("Scene 2 of 4");
  await page.clock.runFor(5000);
  await expect(dialog.getByRole("status")).toContainText("Scene 3 of 4");
  await expect(dialog.getByRole("button", { name: "Close intro" })).toBeInViewport();
  await expect(dialog.getByRole("button", { name: "Skip intro" })).toBeInViewport();
  await page.clock.runFor(5000);
  await expect(dialog.getByRole("status")).toContainText("Scene 4 of 4");
  await page.clock.runFor(5000);
  await expect(dialog).toHaveCount(0);
});

test("public navigation has no console, hydration, or failed local requests", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.url().startsWith("http://127.0.0.1:4173/") && response.status() >= 400)
      errors.push(response.status() + " " + response.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of routes) {
    await page.goto(route || "./");
    await ready(page);
  }
  await page
    .getByRole("navigation", { name: "Primary", exact: true })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await page
    .getByRole("link", { name: /^View case study:/ })
    .first()
    .click();
  await expect(page).toHaveURL(/vrozart-finance\/$/);
  expect(errors).toEqual([]);
});

test("homepage identity and primary actions are usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/Portfolio/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore Projects", exact: false })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View Resume", exact: true })
  ).toBeVisible();
  await page.getByRole("link", { name: "Contact Me", exact: true }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await context.close();
});

test("public pages and dialogs have no automated WCAG A/AA violations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of [
    "./",
    "projects/",
    "tech/",
    "about/",
    "contact/",
    "experience/",
    "episodes/",
    "projects/vrozart-finance/",
  ]) {
    await page.goto(route);
    await ready(page);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      result.violations,
      route +
        " " +
        JSON.stringify(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          }))
        )
    ).toEqual([]);
  }
  await page.goto("./");
  await page.getByRole("button", { name: "Play Intro" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu" }).click();
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations
  ).toEqual([]);
});
