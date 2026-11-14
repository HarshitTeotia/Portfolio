/** Confirmed production URL; trim trailing slashes before joining route paths. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://harshitteotia.github.io/Portfolio"
).replace(/\/+$/, "");
