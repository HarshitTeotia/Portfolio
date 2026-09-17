import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { projects } from "@/content/projects";

// Required for `output: "export"` — without it, Next.js treats this route
// as dynamic and refuses to prerender it during a static export build.
export const dynamic = "force-static";

// Trailing slashes match the actual exported paths (see next.config.ts's
// `trailingSlash: true` — static export writes "<route>/index.html").
const staticRoutes = [
  "/",
  "/episodes/",
  "/projects/",
  "/tech/",
  "/experience/",
  "/about/",
  "/contact/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const projectEntries = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}/`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...projectEntries];
}
