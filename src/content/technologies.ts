import type { Technology } from "./types";

/** Documented project usage only; reciprocal relationships are validated by content tests. */
export const technologies: Technology[] = [
  {
    id: "python",
    name: "Python",
    category: "backend",
    usedIn: ["vrozart-finance", "van-sales-erp", "haut", "viblets"],
  },
  {
    id: "fastapi",
    name: "FastAPI",
    category: "backend",
    usedIn: ["vrozart-finance", "van-sales-erp", "haut", "viblets"],
  },
  {
    id: "sqlalchemy",
    name: "SQLAlchemy (async)",
    category: "backend",
    usedIn: ["van-sales-erp"],
  },
  {
    id: "pydantic",
    name: "Pydantic",
    category: "backend",
    usedIn: ["haut"],
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
    usedIn: ["vrozart-finance", "van-sales-erp", "haut", "viblets"],
  },
  {
    id: "redis",
    name: "Redis",
    category: "database",
    usedIn: ["haut"],
  },
  {
    id: "qdrant",
    name: "Qdrant",
    category: "database",
    usedIn: ["vrozart-finance"],
  },
  {
    id: "alembic",
    name: "Alembic",
    category: "database",
    usedIn: ["van-sales-erp"],
  },
  {
    id: "google-adk",
    name: "Google ADK",
    category: "ai-ml",
    usedIn: ["vrozart-finance", "viblets"],
  },
  {
    id: "llm-integration",
    name: "LLM Integration",
    category: "ai-ml",
    usedIn: ["vrozart-finance", "viblets"],
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
    name: "Embeddings",
    category: "ai-ml",
    usedIn: ["vrozart-finance"],
  },
  {
    id: "jwt",
    name: "JWT",
    category: "security",
    usedIn: ["van-sales-erp"],
  },
  {
    id: "s3",
    name: "AWS S3",
    category: "infrastructure",
    usedIn: ["vrozart-finance"],
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
    usedIn: ["van-sales-erp"],
  },
  {
    id: "react",
    name: "React",
    category: "frontend",
    usedIn: ["vrozart-finance"],
  },
  {
    id: "rest-apis",
    name: "REST APIs",
    category: "backend",
    usedIn: ["vrozart-finance", "van-sales-erp", "haut"],
  },
  {
    id: "rag",
    name: "Retrieval-Augmented Generation",
    category: "ai-ml",
    usedIn: ["vrozart-finance"],
  },
  {
    id: "rbac",
    name: "RBAC",
    category: "security",
    usedIn: ["van-sales-erp", "haut"],
  },
];

export function getTechnology(id: string): Technology | undefined {
  return technologies.find((tech) => tech.id === id);
}
