import type { Metadata } from "next";
import { site } from "@/content/site";
import { siteUrl } from "./site-url";

/** Per-route sharing metadata prevents inherited homepage titles/URLs. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, type: "website" },
    twitter: { card: "summary", title, description },
  };
}
