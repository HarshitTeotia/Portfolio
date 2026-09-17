import type { TechnologyCategory } from "./types";

export const categoryLabels: Record<TechnologyCategory, string> = {
  backend: "Backend",
  database: "Database & Data",
  "ai-ml": "AI / Intelligent Systems",
  security: "Security & Auth",
  infrastructure: "Cloud & Infrastructure",
  quality: "Engineering & Quality",
};

export const categoryOrder: TechnologyCategory[] = [
  "backend",
  "database",
  "ai-ml",
  "security",
  "infrastructure",
  "quality",
];
