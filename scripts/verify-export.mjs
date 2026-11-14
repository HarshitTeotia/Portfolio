import fs from "node:fs";
import path from "node:path";

const origin = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://harshitteotia.github.io/Portfolio"
).replace(/\/+$/, "");
const routes = [
  "/",
  "/experience/",
  "/projects/",
  "/tech/",
  "/episodes/",
  "/about/",
  "/contact/",
  "/projects/vrozart-finance/",
  "/projects/van-sales-distribution-erp/",
  "/projects/haut/",
  "/projects/viblets/",
];
const failures = [];
let references = 0;
for (const route of routes) {
  const html = fs.readFileSync(path.join("out", route, "index.html"), "utf8");
  for (const expected of [
    `rel="canonical" href="${origin}${route}"`,
    `property="og:url" content="${origin}${route}"`,
    'name="description"',
    'property="og:title"',
    'name="twitter:title"',
  ]) {
    if (!html.includes(expected)) failures.push(`${route}: missing ${expected}`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    let url = match[1].replaceAll("&amp;", "&");
    if (!url.startsWith("/")) continue;
    references++;
    if (!url.startsWith("/Portfolio/")) {
      failures.push(`Unprefixed asset: ${url}`);
      continue;
    }
    url = url.slice("/Portfolio".length).split(/[?#]/)[0];
    let file = path.join("out", decodeURIComponent(url));
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    if (!fs.existsSync(file)) failures.push(`Missing asset: ${url}`);
  }
  const person = JSON.parse(
    html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]
  );
  if (person.jobTitle !== "Python Developer" || person.worksFor)
    failures.push(`${route}: incorrect employment schema`);
  if (/localhost:3000|May 2025[^<]{0,15}Present|Resume PDF update pending/.test(html))
    failures.push(`${route}: stale release content`);
}
const sitemap = fs.readFileSync("out/sitemap.xml", "utf8");
const qaFile = "out/dev/design-system/index.html";
if (
  fs.existsSync(qaFile) &&
  fs.readFileSync(qaFile, "utf8").includes("Tokens and primitives showcase")
)
  failures.push("Development-only QA content was exported");
for (const route of routes)
  if (!sitemap.includes(`${origin}${route}<`)) failures.push(`Sitemap missing ${route}`);
if (!fs.readFileSync("out/robots.txt", "utf8").includes("Disallow: /Portfolio/dev/"))
  failures.push("Robots QA exclusion missing");
if (
  !fs
    .readFileSync("out/resume/Harshit_Teotia_Resume.pdf")
    .equals(fs.readFileSync("resume/Harshit_Teotia_Resume.pdf"))
)
  failures.push("Exported resume differs");
const contact = fs.readFileSync("out/contact/index.html", "utf8");
for (const url of [
  "mailto:harshitteotia2003@gmail.com",
  "https://github.com/HarshitTeotia",
  "https://www.linkedin.com/in/harshit-teotia/",
])
  if (!contact.includes(`href="${url}"`)) failures.push(`Incorrect contact URL: ${url}`);
const scan = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? scan(path.join(dir, entry.name))
        : [path.join(dir, entry.name)]
    );
const secretPatterns = [
  /AKIA[0-9A-Z]{16}/,
  /gh[pousr]_[A-Za-z0-9]{36,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];
const files = scan("out").filter((file) => /\.(html|js|css|json|txt|xml)$/.test(file));
for (const file of files) {
  const data = fs.readFileSync(file, "utf8");
  if (secretPatterns.some((pattern) => pattern.test(data)))
    failures.push(`Potential secret in ${file}; inspect privately`);
}
const result = {
  routes: routes.length,
  localReferences: references,
  scannedTextAssets: files.length,
  secretScan: "Bounded high-confidence patterns; not an exhaustive confidentiality audit",
  failures,
};
fs.mkdirSync("docs/qa/phase-3", { recursive: true });
fs.writeFileSync(
  "docs/qa/phase-3/export-verification.json",
  JSON.stringify(result, null, 2) + "\n"
);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
