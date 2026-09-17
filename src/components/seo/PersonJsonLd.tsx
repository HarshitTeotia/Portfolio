import { site } from "@/content/site";
import { experience } from "@/content/experience";
import { socialLinks } from "@/content/social";
import { siteUrl } from "@/lib/site-url";

/**
 * Person structured data — only confirmed facts. `sameAs` only includes
 * links that actually have a URL yet (placeholders are skipped, never
 * fabricated).
 */
export function PersonJsonLd() {
  const current = experience.find((entry) => entry.current);
  const sameAs = socialLinks
    .filter((link) => link.url && link.id !== "email" && link.id !== "resume")
    .map((link) => link.url as string);

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: siteUrl,
    jobTitle: current?.role,
    worksFor: current
      ? {
          "@type": "Organization",
          name: current.company,
        }
      : undefined,
    knowsAbout: [...site.positioning],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
