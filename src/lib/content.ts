import type { ProjectLink } from "@/content/types";

/** True only when a link has a real, confirmed URL — never true for a placeholder. */
export function isLinkAvailable(
  link: ProjectLink | undefined
): link is ProjectLink & { url: string } {
  return Boolean(link && link.url);
}
