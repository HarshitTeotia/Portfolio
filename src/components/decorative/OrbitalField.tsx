interface OrbitalFieldProps {
  className?: string;
  /** Shifts the ring center off-axis so the field reads as asymmetric, not a centered badge. */
  align?: "left" | "right";
}

/**
 * Faint orbital rings + system-node marks — the hero's "software as system"
 * backdrop. Deliberately abstract (no logos, no literal iconography): the
 * nodes stand for architecture/systems, not a tech-stack showcase.
 * Pure CSS animation (orbit-spin, see globals.css) so this stays a server
 * component and respects prefers-reduced-motion for free.
 */
export function OrbitalField({ className, align = "right" }: OrbitalFieldProps) {
  const cx = align === "right" ? 640 : 320;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 960 720"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <g
        className="animate-orbit-slow"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <circle
          cx={cx}
          cy={360}
          r="140"
          fill="none"
          stroke="var(--color-border-strong)"
          strokeWidth="1"
        />
        <circle
          cx={cx}
          cy={360}
          r="140"
          fill="none"
          stroke="var(--color-accent-500)"
          strokeWidth="1.5"
          strokeDasharray="2 10"
          opacity="0.5"
        />
      </g>

      <g
        className="animate-orbit-slow-reverse"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <circle
          cx={cx}
          cy={360}
          r="260"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <rect x={cx - 260} y={358} width="4" height="4" fill="var(--color-text-muted)" />
        <rect
          className="animate-node-pulse"
          x={cx + 256}
          y={358}
          width="4"
          height="4"
          fill="var(--color-accent-400)"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      </g>

      <circle
        cx={cx}
        cy={360}
        r="380"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1"
      />

      <circle cx={cx} cy={100} r="2.5" fill="var(--color-text-muted)" />
      <circle
        className="animate-node-pulse"
        cx={cx - 200}
        cy={560}
        r="2.5"
        fill="var(--color-accent-500)"
      />
      <circle cx={cx + 320} cy={200} r="2" fill="var(--color-text-muted)" />
    </svg>
  );
}
