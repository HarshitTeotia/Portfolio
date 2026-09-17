import { CornerBrackets } from "@/components/decorative";
import { experience } from "@/content/experience";

/**
 * Compact technical metadata element — the hero's "system status" read-out.
 * Deliberately small: a status line, not a card. Renders nothing if no role
 * is marked current, rather than showing a stale or fabricated claim.
 */
export function StatusPill() {
  const current = experience.find((entry) => entry.current);
  if (!current) return null;

  return (
    <div className="border-border-strong bg-bg-elevated/40 relative border px-5 py-4">
      <CornerBrackets />
      <p className="text-accent-300 flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase">
        <span className="bg-accent-400 relative flex h-1.5 w-1.5 rounded-full">
          <span className="bg-accent-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
        </span>
        Currently building
      </p>
      <p className="text-text-primary mt-3 text-sm">{current.company}</p>
      <p className="text-text-muted mt-0.5 font-mono text-xs tracking-wide uppercase">
        {current.role}
      </p>
    </div>
  );
}
