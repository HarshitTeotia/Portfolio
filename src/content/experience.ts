import type { ExperienceEntry, ProjectId } from "./types";

export const experience: ExperienceEntry[] = [
  {
    id: "vrozart-group",
    role: "Python Developer",
    company: "Vrozart Group",
    dateRange: "May 2025 – September 2026",
    location: "Mohali, Punjab, India",
    current: false,
    summary:
      "17 months of professional software development across Python backends, applied AI, and business applications.",
    responsibilities: [
      "Developed Python/FastAPI REST APIs and PostgreSQL-backed business workflows, with authentication, JWT, RBAC, and business validation.",
      "Integrated Google ADK conversational agent workflows with backend services and structured application information.",
      "Worked on document processing, OCR, chunking, metadata, embeddings, vector search, and RAG integration.",
      "Contributed to React modules and frontend/API integration alongside frontend engineers.",
      "Wrote and executed automated backend tests, diagnosed failures, and collaborated with QA and product stakeholders on engineering reliability.",
      "Supported an HRMS cross-functional assignment: requirements gathering, user stories, acceptance criteria, workflow documentation, and developer coordination.",
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
 * `null` for work done outside any listed role (attribution not confirmed) — callers
 * show a neutral "Backend Developer" label rather than inventing a phase.
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
