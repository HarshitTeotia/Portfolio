"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { duration, ease } from "@/lib/motion/tokens";
import type { ArchitectureStep, ProjectArchitecture } from "@/content/types";

interface ArchitectureViewProps {
  architecture: ProjectArchitecture;
}

/** Down-arrow connector used between schematic nodes — the one recurring
 * "this is how it flows" motif shared by every architecture kind. Draws
 * once, top-to-bottom, when it scrolls into view — "the system coming
 * online," not a looping signal. */
function FlowConnector() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div aria-hidden="true" className="flex justify-start pl-[19px]">
        <svg width="10" height="20" viewBox="0 0 10 20" className="text-border-strong">
          <line x1="5" y1="0" x2="5" y2="14" stroke="currentColor" strokeWidth="1" />
          <path
            d="M0 12 L5 18 L10 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="flex justify-start pl-[19px]">
      <svg width="10" height="20" viewBox="0 0 10 20" className="text-border-strong">
        <motion.line
          x1="5"
          y1="0"
          x2="5"
          y2="14"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: duration.normal, ease: ease.standard }}
        />
        <motion.path
          d="M0 12 L5 18 L10 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{
            duration: duration.fast,
            ease: ease.standard,
            delay: duration.normal,
          }}
        />
      </svg>
    </div>
  );
}

/** Compact horizontal "A → B → C" schematic — used for request-flow asides
 * alongside the module grid and evidence ledger. */
function CompactFlow({ steps }: { steps: ArchitectureStep[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center gap-2">
          <span className="border-border-strong bg-bg-elevated text-text-secondary rounded-none border px-3 py-1.5 font-mono text-xs tracking-wide uppercase">
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <span className="text-accent-500" aria-hidden="true">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/** Box entrance — a touch of scale alongside opacity reads as "materializing," not just fading in. */
const nodeVariant = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.normal, ease: ease.entrance },
  },
};

/**
 * Polymorphic renderer — the visual differentiation between project pages
 * (pipeline vs. module grid vs. evidence ledger) comes from this, driven by
 * `architecture.kind` in the project's own data, not a hardcoded per-project
 * component.
 */
export function ArchitectureView({ architecture }: ArchitectureViewProps) {
  if (architecture.kind === "pipeline") {
    return (
      <div>
        <Stagger staggerDelay={0.15} amount={0.2}>
          <ol className="flex flex-col">
            {architecture.steps.map((step, index) => (
              <li key={step.label}>
                <StaggerItem variants={nodeVariant}>
                  <div className="border-border-strong bg-bg-elevated flex items-start gap-4 border px-5 py-4">
                    <span className="text-accent-400 font-mono text-xs">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-text-primary font-mono text-sm tracking-wide uppercase">
                        {step.label}
                      </p>
                      {step.detail && (
                        <p className="text-text-secondary mt-1 text-sm normal-case">
                          {step.detail}
                        </p>
                      )}
                    </div>
                  </div>
                </StaggerItem>
                {index < architecture.steps.length - 1 && <FlowConnector />}
              </li>
            ))}
          </ol>
        </Stagger>
        {architecture.notes && (
          <ul className="border-border text-text-muted mt-6 flex flex-col gap-1 border-t pt-4 text-sm">
            {architecture.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (architecture.kind === "modules") {
    return (
      <div>
        {architecture.requestFlow && (
          <div className="mb-8">
            <p className="text-text-muted mb-3 font-mono text-xs tracking-wide uppercase">
              Request flow
            </p>
            <CompactFlow steps={architecture.requestFlow} />
          </div>
        )}
        <Stagger staggerDelay={0.08} amount={0.2} className="grid gap-px sm:grid-cols-2">
          {architecture.groups.map((group) => (
            <StaggerItem key={group.title} variants={nodeVariant}>
              <div className="border-border-strong h-full border p-5">
                <p className="text-accent-300 font-mono text-xs tracking-wide uppercase">
                  {group.title}
                </p>
                <ul className="text-text-secondary mt-3 flex flex-col gap-1.5 text-sm">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        {architecture.notes && (
          <ul className="border-border text-text-muted mt-6 flex flex-col gap-1 border-t pt-4 text-sm">
            {architecture.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // kind === "evidence"
  return (
    <div>
      {architecture.requestFlow && (
        <div className="mb-8">
          <p className="text-text-muted mb-3 font-mono text-xs tracking-wide uppercase">
            Architecture flow
          </p>
          <CompactFlow steps={architecture.requestFlow} />
        </div>
      )}
      <Stagger
        staggerDelay={0.06}
        amount={0.2}
        className="grid grid-cols-2 gap-px sm:grid-cols-3"
      >
        {architecture.metrics.map((metric) => (
          <StaggerItem key={metric.label} variants={nodeVariant}>
            <div className="border-border-strong h-full border p-5">
              <p className="font-display text-accent-300 text-3xl">{metric.value}</p>
              <p className="text-text-secondary mt-1 text-xs">{metric.label}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      {architecture.notes && (
        <div className="mt-6 flex flex-wrap gap-2">
          {architecture.notes.map((note) => (
            <Badge key={note}>{note}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}
