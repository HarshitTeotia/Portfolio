import type { NextConfig } from "next";

/**
 * GitHub Pages serves this repo either as a user/org root page
 * (repo named "<owner>.github.io", served at the domain root) or as a
 * project page (any other repo name, served under /<repo-name>/). GitHub
 * Actions always provides `GITHUB_REPOSITORY` as "<owner>/<repo>", so the
 * base path can be derived automatically at build time — no manual editing
 * required when the repo is renamed or forked. `BASE_PATH` is an explicit
 * escape hatch (e.g. for a custom domain on a non "<owner>.github.io" repo,
 * where the site is served from the root despite the repo name).
 */
function resolveBasePath(): string {
  if (process.env.BASE_PATH !== undefined) return process.env.BASE_PATH;

  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (!repoName || /\.github\.io$/i.test(repoName)) return "";

  return `/${repoName}`;
}

const basePath = resolveBasePath();

const nextConfig: NextConfig = {
  // GitHub Pages only serves static files — there is no Node server to run
  // Next's default request-time renderer, so the whole app is pre-rendered
  // to static HTML/CSS/JS at build time instead.
  output: "export",

  // Every route becomes "<route>/index.html" instead of "<route>.html" —
  // the layout static hosts (including GitHub Pages) resolve most reliably,
  // since a directory request naturally serves its index.html.
  trailingSlash: true,

  // GitHub Pages has no image-optimization endpoint to call at request time;
  // `next/image` falls back to serving the original file as-is.
  images: { unoptimized: true },

  basePath,
};

export default nextConfig;
