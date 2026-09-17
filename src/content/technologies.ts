import type { Technology } from "./types";

/**
 * Every technology shown on /tech must trace to at least one real project
 * below via `usedIn` — this is what makes the stack page evidence-based
 * instead of a generic skill list. See src/content/projects.ts for the
 * project side of the relationship.
 *
 * Categories group by engineering concern (backend / database / AI /
 * security / infrastructure / quality), not by which project uses them —
 * see src/content/categories.ts for the group labels and display order.
 */
export const technologies: Technology[] = [
  {
    id: "python",
    name: "Python",
    category: "backend",
    usedIn: ["viblets", "haut", "vrozart-finance", "van-sales-erp"],
  },
  {
    id: "fastapi",
    name: "FastAPI",
    category: "backend",
    usedIn: ["viblets", "haut", "vrozart-finance", "van-sales-erp"],
  },
  {
    id: "sqlalchemy",
    name: "SQLAlchemy (async)",
    category: "backend",
    usedIn: ["van-sales-erp"],
  },
  {
    id: "asyncpg",
    name: "asyncpg",
    category: "backend",
    usedIn: ["haut", "van-sales-erp"],
  },
  {
    id: "pydantic",
    name: "Pydantic",
    category: "backend",
    usedIn: ["haut", "van-sales-erp"],
  },
  {
    id: "facebook-business-api",
    name: "Facebook Business API",
    category: "backend",
    usedIn: ["viblets"],
  },

  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "database",
    usedIn: ["viblets", "haut", "vrozart-finance", "van-sales-erp"],
  },
  {
    id: "redis",
    name: "Redis",
    category: "database",
    usedIn: ["haut", "van-sales-erp"],
  },
  { id: "qdrant", name: "Qdrant", category: "database", usedIn: ["vrozart-finance"] },
  { id: "alembic", name: "Alembic", category: "database", usedIn: ["van-sales-erp"] },

  {
    id: "google-adk",
    name: "Google ADK",
    category: "ai-ml",
    usedIn: ["viblets", "vrozart-finance"],
  },
  {
    id: "llm-integration",
    name: "LLM Integration",
    category: "ai-ml",
    usedIn: ["viblets", "vrozart-finance"],
  },
  {
    id: "tesseract-ocr",
    name: "Tesseract OCR",
    category: "ai-ml",
    usedIn: ["vrozart-finance"],
  },
  {
    id: "pdfplumber",
    name: "PDFPlumber",
    category: "ai-ml",
    usedIn: ["vrozart-finance"],
  },
  {
    id: "openai-embeddings",
    name: "OpenAI Embeddings",
    category: "ai-ml",
    usedIn: ["vrozart-finance"],
  },

  { id: "jwt", name: "JWT", category: "security", usedIn: ["haut", "van-sales-erp"] },
  { id: "argon2", name: "Argon2", category: "security", usedIn: ["van-sales-erp"] },
  { id: "totp-2fa", name: "TOTP / 2FA", category: "security", usedIn: ["van-sales-erp"] },

  {
    id: "s3",
    name: "S3",
    category: "infrastructure",
    usedIn: ["vrozart-finance", "van-sales-erp"],
  },
  {
    id: "celery",
    name: "Celery",
    category: "infrastructure",
    usedIn: ["vrozart-finance"],
  },

  {
    id: "pytest",
    name: "Pytest",
    category: "quality",
    usedIn: ["haut", "van-sales-erp"],
  },
  { id: "httpx", name: "HTTPX", category: "quality", usedIn: ["haut", "van-sales-erp"] },
  { id: "ruff", name: "Ruff", category: "quality", usedIn: ["van-sales-erp"] },
  { id: "mypy", name: "mypy", category: "quality", usedIn: ["van-sales-erp"] },
];

export function getTechnology(id: string): Technology | undefined {
  return technologies.find((tech) => tech.id === id);
}
