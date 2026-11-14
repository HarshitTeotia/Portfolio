import { CornerBrackets } from "@/components/decorative";
import { site } from "@/content/site";

export function StatusPill() {
  return (
    <div className="border-border-strong bg-bg-elevated/40 relative border px-5 py-4">
      <CornerBrackets />
      <p className="text-accent-300 font-mono text-xs tracking-wide uppercase">
        {site.availability}
      </p>
      <p className="text-text-primary mt-3 text-sm">{site.location}</p>
      <p className="text-text-secondary mt-2 text-sm">{site.availabilityDetail}</p>
      <p className="text-text-muted mt-3 font-mono text-xs">{site.eyebrow}</p>
    </div>
  );
}
