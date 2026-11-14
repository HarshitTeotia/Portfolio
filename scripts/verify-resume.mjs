import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

// Inspection tools are isolated from app dependencies; see resume/README.md.
const tools = path.resolve(".tools/pdf/node_modules");
const { createCanvas, DOMMatrix, Path2D, ImageData } = await import(
  pathToFileURL(path.join(tools, "@napi-rs/canvas/index.js"))
);
Object.assign(globalThis, { DOMMatrix, Path2D, ImageData });
const { getDocument, OPS } = await import(
  pathToFileURL(path.join(tools, "pdfjs-dist/legacy/build/pdf.mjs"))
);
const filename = "resume/Harshit_Teotia_Resume.pdf";
const bytes = fs.readFileSync(filename);
if (!bytes.equals(fs.readFileSync("public/resume/Harshit_Teotia_Resume.pdf")))
  throw new Error("Production PDF differs from compiled resume");
const task = getDocument({
  data: new Uint8Array(bytes),
  standardFontDataUrl: pathToFileURL(
    path.join(tools, "pdfjs-dist/standard_fonts") + path.sep
  ).href,
});
const pdf = await task.promise;
if (pdf.numPages !== 1) throw new Error(`Expected a single page, got ${pdf.numPages}`);
const page = await pdf.getPage(1);
const viewport = page.getViewport({ scale: 1 });
const content = await page.getTextContent();
const text = content.items
  .map((item) => item.str ?? "")
  .join(" ")
  .replace(/\s+/g, " ");
for (const expected of [
  "HARSHIT TEOTIA",
  "17 months",
  "May 2025",
  "September 2026",
  "Bengaluru",
  "176+",
  "16 roles",
  "18 Alembic",
  "Google ADK",
  "Qdrant",
  "2023",
  "2025",
]) {
  if (!text.includes(expected)) throw new Error(`Missing resume fact: ${expected}`);
}
if (/\bPresent\b|1\+ year|Senior Engineer|Lead Developer|AI Architect/i.test(text))
  throw new Error("Stale or unsupported resume claim");
const links = (await page.getAnnotations())
  .filter((a) => a.subtype === "Link")
  .map((a) => a.url ?? a.unsafeUrl);
for (const url of [
  "mailto:harshitteotia2003@gmail.com",
  "https://www.linkedin.com/in/harshit-teotia/",
  "https://github.com/HarshitTeotia",
  "https://harshitteotia.github.io/Portfolio/",
]) {
  if (!links.includes(url)) throw new Error(`Missing PDF link: ${url}`);
}
const textBounds = content.items
  .filter((item) => item.str?.trim())
  .map((item) => ({
    text: item.str,
    x: item.transform[4],
    y: item.transform[5],
    width: item.width,
  }));
const clipped = textBounds.filter(
  (item) =>
    item.x < 20 ||
    item.y < 15 ||
    item.y > viewport.height - 10 ||
    item.x + item.width > viewport.width - 20
);
if (clipped.length)
  throw new Error(`Text outside safe page bounds: ${JSON.stringify(clipped)}`);
const ops = await page.getOperatorList();
const imageOps = [
  OPS.paintImageXObject,
  OPS.paintInlineImageXObject,
  OPS.paintImageMaskXObject,
].filter((op) => op !== undefined);
if (ops.fnArray.some((op) => imageOps.includes(op)))
  throw new Error("Unexpected raster image in ATS resume");
if (Math.abs(viewport.width - 595.28) > 2 || Math.abs(viewport.height - 841.89) > 2)
  throw new Error("Expected A4 dimensions");
const target = path.resolve("docs/qa/phase-3");
fs.mkdirSync(target, { recursive: true });
const scaled = page.getViewport({ scale: 1.8 });
const canvas = createCanvas(Math.ceil(scaled.width), Math.ceil(scaled.height));
await page.render({ canvasContext: canvas.getContext("2d"), viewport: scaled }).promise;
fs.writeFileSync(path.join(target, "resume-preview.png"), await canvas.encode("png"));
fs.writeFileSync(path.join(target, "resume-extracted.txt"), text + "\n");
const result = {
  pages: pdf.numPages,
  pagePoints: [viewport.width, viewport.height],
  bytes: bytes.length,
  sha256: createHash("sha256").update(bytes).digest("hex"),
  links,
  textItems: textBounds.length,
  clippedItems: clipped.length,
  rasterImages: 0,
};
fs.writeFileSync(
  path.join(target, "resume-verification.json"),
  JSON.stringify(result, null, 2) + "\n"
);
console.log(JSON.stringify(result, null, 2));
await task.destroy();
