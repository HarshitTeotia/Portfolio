/**
 * `photoSrc` is null until a real photo is supplied — the About page
 * renders a neutral placeholder instead of a fabricated or stock image.
 * This is also the ONLY place in the site allowed to render a photo.
 *
 * Every claim below traces to something in projects.ts/experience.ts —
 * this file describes real work, not aspirational skill language.
 */
export const about = {
  photoSrc: null as string | null,
  photoAlt: "Harshit Teotia",

  heroStatement:
    "Backend-focused developer building APIs, AI-powered systems, and data-driven products.",

  summary:
    "I work primarily with Python and FastAPI, building backend systems that connect business workflows, data, APIs, and AI capabilities. My experience spans REST APIs, asynchronous systems, PostgreSQL, authentication, RAG pipelines, agent workflows, document processing, and operational platforms.",

  whatIBuild: [
    {
      title: "Backend Systems",
      description:
        "API-driven services, business logic, authentication, RBAC and database-backed applications.",
    },
    {
      title: "AI / Intelligent Systems",
      description:
        "Agent workflows, RAG pipelines, document processing and LLM integrations.",
    },
    {
      title: "Operational Platforms",
      description:
        "Systems for hospitality, finance, distribution and business operations.",
    },
  ],

  howIWork: [
    {
      title: "Understand the workflow",
      description: "Translate business requirements into clear system behavior.",
    },
    {
      title: "Design the system",
      description: "Define APIs, data models, permissions and service boundaries.",
    },
    {
      title: "Build and integrate",
      description: "Implement backend services and connect external systems.",
    },
    {
      title: "Test and diagnose",
      description:
        "Use tests, logs and debugging to verify behavior and resolve failures.",
    },
  ],

  engineeringFocus: [
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Async Systems",
    "REST APIs",
    "Authentication & RBAC",
    "AI / LLM Systems",
    "RAG",
    "Agent Workflows",
    "Document Processing",
    "Testing",
    "System Integration",
  ],
} as const;
