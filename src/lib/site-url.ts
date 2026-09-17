/**
 * PLACEHOLDER: set NEXT_PUBLIC_SITE_URL to the real production domain once
 * deployed. Falls back to localhost for dev so metadataBase/sitemap/robots
 * never silently point at a fabricated domain.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
