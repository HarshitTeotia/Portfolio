import type { ExperienceEntry, ProjectId } from "./types";

export const experience: ExperienceEntry[] = [
  {
    id: "vrozart-group",
    role: "Python Developer",
    company: "Vrozart Group",
    dateRange: "May 2025 – Present",
    current: true,
    summary:
      "Backend development across AI-driven and operational products — building APIs, integrating AI/agent workflows, and working across the stack when a product needed it.",
    responsibilities: [
      "Backend API development with FastAPI and PostgreSQL",
      "AI/agent workflow integration (Google ADK, RAG pipelines)",
      "Debugging and diagnosing production issues, including deep async/ORM-level bugs",
      "Some frontend collaboration — bug fixes and a new frontend module on Vrozart Finance",
    ],
    relatedProjectIds: ["viblets", "haut", "vrozart-finance"],
    phaseNumber: 3,
    phaseLabel: "Real World",
  },
];

/**
 * A project's career phase, derived from whichever experience entry claims
 * it via `relatedProjectIds` — not a field on the project itself, so it can
 * never drift out of sync with the one source of truth for "when." Returns
 * `null` for work done outside any listed role (e.g. freelance) — callers
 * show a neutral "Independent Project" label rather than inventing a phase.
 */
export function getProjectPhase(
  projectId: ProjectId
): { label: string; dateRange: string } | null {
  const entry = experience.find((e) => e.relatedProjectIds.includes(projectId));
  if (!entry) return null;
  return {
    label: `Phase ${String(entry.phaseNumber).padStart(2, "0")} — ${entry.phaseLabel}`,
    dateRange: entry.dateRange,
  };
}
