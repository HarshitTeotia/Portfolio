/**
 * Content type definitions for THE DEVELOPER portfolio.
 *
 * Nothing here is copy — this file only shapes the data. Actual content
 * lives in the sibling *.ts files (projects.ts, seasons.ts, etc.) and is
 * consumed by page/section components. No page should hardcode project,
 * season, technology, or contact copy directly.
 *
 * PLACEHOLDER CONVENTION: any field that isn't confirmed yet (resume file,
 * GitHub/demo URLs, social links) is typed as `string | null`. `null` means
 * "not supplied yet" — components must treat it as a render-time absence
 * (omit the CTA, show a neutral label) and never invent a value to fill it.
 */

export type ProjectId = "viblets" | "haut" | "vrozart-finance" | "van-sales-erp";

export type TechnologyId =
  | "python"
  | "fastapi"
  | "postgresql"
  | "google-adk"
  | "llm-integration"
  | "facebook-business-api"
  | "asyncpg"
  | "redis"
  | "pydantic"
  | "jwt"
  | "pytest"
  | "httpx"
  | "tesseract-ocr"
  | "pdfplumber"
  | "qdrant"
  | "openai-embeddings"
  | "celery"
  | "s3"
  | "sqlalchemy"
  | "alembic"
  | "argon2"
  | "totp-2fa"
  | "ruff"
  | "mypy";

export type TechnologyCategory =
  "backend" | "database" | "ai-ml" | "security" | "infrastructure" | "quality";

export interface Technology {
  id: TechnologyId;
  name: string;
  category: TechnologyCategory;
  /** Projects that actually use this technology — the evidence for Epic 09/10. */
  usedIn: ProjectId[];
}

export interface ArchitectureStep {
  label: string;
  detail?: string;
}

/** Linear request/data flow — used where the project genuinely is a pipeline. */
export interface ArchitectureFlow {
  kind: "pipeline";
  steps: ArchitectureStep[];
  notes?: string[];
}

/** Grouped domain modules — used where the project is a broad system, not a pipeline. */
export interface ArchitectureModuleGroup {
  kind: "modules";
  groups: { title: string; items: string[] }[];
  /** Optional compact flow diagram shown alongside the module grid, e.g. request lifecycle. */
  requestFlow?: ArchitectureStep[];
  notes?: string[];
}

/** Metrics ledger — used for the one project whose strongest story is engineering evidence. */
export interface ArchitectureEvidence {
  kind: "evidence";
  metrics: { label: string; value: string }[];
  /** Optional compact flow diagram shown alongside the metrics ledger. */
  requestFlow?: ArchitectureStep[];
  notes?: string[];
}

export type ProjectArchitecture =
  ArchitectureFlow | ArchitectureModuleGroup | ArchitectureEvidence;

export interface ProjectLink {
  /** null = not supplied yet. Never fill with a guessed or placeholder URL. */
  url: string | null;
  label: string;
  /** True when the codebase is known to be private/proprietary rather than merely unlinked. */
  isPrivate?: boolean;
}

export interface ProjectLinks {
  github?: ProjectLink;
  demo?: ProjectLink;
}

export interface Project {
  id: ProjectId;
  slug: string;
  episodeNumber: number;
  episodeLabel: string;
  /** Draft title — refinable later without touching component code. */
  episodeTitle: string;
  title: string;
  /** One-line category, e.g. "AI / Agentic Marketing Automation Platform". */
  positioning: string;
  /** Short thematic line for the project-index card. */
  theme: string;
  problem: string;
  solution: string;
  role: string;
  architecture: ProjectArchitecture;
  technologies: TechnologyId[];
  highlights: string[];
  challenges: string[];
  /** Only set when a factual, non-fabricated outcome is known. */
  outcome?: string;
  links: ProjectLinks;
}

export interface Season {
  id: string;
  code: string;
  title: string;
  dateRange: string;
  roleOrDegree: string;
  institutionOrCompany: string;
  story: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  dateRange: string;
  current: boolean;
  summary: string;
  responsibilities: string[];
  relatedProjectIds: ProjectId[];
  /** Career phase this role belongs to — feeds each related project's
   * secondary "PHASE 0X — LABEL" metadata. See getProjectPhase(). */
  phaseNumber: number;
  phaseLabel: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  dateRange: string;
  seasonId: string;
  blurb: string;
}

export type SocialLinkId = "email" | "github" | "linkedin" | "resume";

export interface SocialLink {
  id: SocialLinkId;
  label: string;
  /** null = placeholder, not supplied yet. */
  url: string | null;
}

export type TrailerSceneId = "boot" | "timeline" | "stack" | "identity";

export interface TrailerScene {
  id: TrailerSceneId;
  order: number;
  /** Compact label for the HUD's scene list, e.g. "ORIGIN". */
  hudLabel: string;
  /**
   * Scene-specific narrative copy. Only set where the scene needs bespoke
   * text that isn't already sourced live from another content file — the
   * career timeline, project architecture, and identity scenes read
   * `seasons.ts` / `projects.ts` / `site.ts` directly instead of duplicating
   * that copy here.
   */
  lines: string[];
  /** How long this beat holds before advancing, in ms. */
  holdMs: number;
}
