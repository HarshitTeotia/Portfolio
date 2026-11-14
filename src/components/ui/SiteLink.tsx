import NextLink from "next/link";
import type { ComponentProps } from "react";

/** Avoid speculative segment requests against a static GitHub Pages host. */
export default function SiteLink(props: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} prefetch={false} />;
}
