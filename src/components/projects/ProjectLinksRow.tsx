import { Button } from "@/components/ui";
import { isLinkAvailable } from "@/lib/content";
import type { ProjectLinks } from "@/content/types";

export function ProjectLinksRow({ links }: { links: ProjectLinks }) {
  const { github, demo } = links;

  return (
    <div className="flex flex-wrap items-center gap-4">
      {github &&
        (isLinkAvailable(github) ? (
          <Button href={github.url} external variant="ghost">
            {github.label}
          </Button>
        ) : (
          <span
            className="border-border text-text-muted cursor-not-allowed rounded-md border px-5 py-2.5 text-sm"
            title={github.isPrivate ? "Private codebase" : "Link coming soon"}
          >
            {github.isPrivate ? "Private codebase" : `${github.label} — coming soon`}
          </span>
        ))}

      {demo &&
        (isLinkAvailable(demo) ? (
          <Button href={demo.url} external variant="primary">
            {demo.label}
          </Button>
        ) : null)}
    </div>
  );
}
