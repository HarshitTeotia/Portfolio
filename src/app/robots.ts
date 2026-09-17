import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Required for `output: "export"` — without it, Next.js treats this route
// as dynamic and refuses to prerender it during a static export build.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dev/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
