import type { NextConfig } from "next";

/**
 * Resolve the base path for GitHub Pages.
 *
 * - User/org site:
 *   https://username.github.io/
 *   → basePath = ""
 *
 * - Project site:
 *   https://username.github.io/Portfolio/
 *   → basePath = "/Portfolio"
 *
 * BASE_PATH can be used to override this behavior when needed.
 */
function resolveBasePath(): string {
  if (process.env.BASE_PATH !== undefined) {
    return process.env.BASE_PATH;
  }

  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];

  if (!repoName || /\.github\.io$/i.test(repoName)) {
    return "";
  }

  return `/${repoName}`;
}

const basePath = resolveBasePath();

const nextConfig: NextConfig = {
  // Export the Next.js application as static files
  // for GitHub Pages.
  output: "export",

  // Generate routes as /route/index.html
  // for reliable GitHub Pages routing.
  trailingSlash: true,

  // GitHub Pages does not provide Next.js's image
  // optimization server, so serve images directly.
  images: {
    unoptimized: true,
  },

  // Automatically use /Portfolio when deployed as
  // https://username.github.io/Portfolio/
  basePath,

  // Make the base path available to client-side code.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
