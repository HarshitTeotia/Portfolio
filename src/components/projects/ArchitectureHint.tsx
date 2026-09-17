import type { ProjectArchitecture } from "@/content/types";

interface ArchitectureHintProps {
  architecture: ProjectArchitecture;
  className?: string;
}

/**
 * One-line architecture summary for the project index — a preview of the
 * full ArchitectureView on the detail page, not a duplicate of it.
 */
export function ArchitectureHint({ architecture, className }: ArchitectureHintProps) {
  let text: string;

  if (architecture.kind === "pipeline") {
    const labels = architecture.steps.map((step) => step.label);
    const shown = labels.slice(0, 3);
    text = shown.join(" → ") + (labels.length > shown.length ? " → …" : "");
  } else if (architecture.kind === "modules") {
    text = `${architecture.groups.length} domain modules`;
  } else {
    const shown = architecture.metrics.slice(0, 2);
    text = shown
      .map((metric) => `${metric.value} ${metric.label.toLowerCase()}`)
      .join(" · ");
  }

  return (
    <p className={className}>
      <span className="text-text-muted font-mono text-xs tracking-wide uppercase">
        {text}
      </span>
    </p>
  );
}
