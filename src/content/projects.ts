import type { Project } from "./types";

/**
 * All four projects are real work. Nothing here is fabricated — see the
 * project brief in conversation history for source facts. Fields left
 * unset (outcome, links.*.url) are unset because the fact isn't confirmed
 * yet, not because they were forgotten.
 *
 * `links.github`/`links.demo` default to `{ url: null, isPrivate: true }`
 * for all four — these are employer/client codebases, presumed private
 * until confirmed otherwise. Flip `isPrivate` and set `url` per-project
 * once you confirm which (if any) can be public.
 *
 * Display order (this array's order) was deliberately changed to lead with
 * Vrozart Finance — it's independent of `episodeNumber`/`episodeLabel`,
 * which stay tied to each project's place in the season/episode story and
 * are not renumbered when the listing order changes.
 */
export const projects: Project[] = [
  {
    id: "vrozart-finance",
    slug: "vrozart-finance",
    episodeNumber: 6,
    episodeLabel: "EP 06",
    episodeTitle: "Reading Between the Lines",
    title: "Vrozart Finance",
    positioning: "AI-powered Finance / Lending Platform",
    theme: "Turning stacks of documents into something a backend can query.",
    problem:
      "Finance and lending workflows depend on reading identity and financial documents by hand — slow, and not something a system can search or reason over at scale.",
    solution:
      "A document-intelligence pipeline: incoming documents go through OCR/extraction (Tesseract, PDFPlumber), get chunked, embedded (OpenAI embeddings), and stored in Qdrant for cosine-similarity search — feeding a RAG workflow built on Google ADK / AI workflows that the backend APIs and business logic query directly.",
    role: "Backend Developer, with some frontend work (bug fixes and a new frontend module)",
    architecture: {
      kind: "pipeline",
      steps: [
        { label: "Document intake", detail: "Stored in S3" },
        { label: "OCR / extraction", detail: "Tesseract + PDFPlumber" },
        { label: "Chunking" },
        { label: "Embeddings", detail: "OpenAI embeddings" },
        { label: "Vector storage", detail: "Qdrant" },
        { label: "Similarity search", detail: "Cosine similarity" },
        { label: "RAG workflow", detail: "Google ADK / AI workflows" },
      ],
      notes: ["Ingestion runs through Celery so it doesn't block API requests."],
    },
    technologies: [
      "python",
      "fastapi",
      "google-adk",
      "llm-integration",
      "tesseract-ocr",
      "pdfplumber",
      "qdrant",
      "openai-embeddings",
      "celery",
      "s3",
      "postgresql",
    ],
    highlights: [
      "End-to-end RAG pipeline: OCR → chunking → embeddings → Qdrant → cosine-similarity retrieval",
      "Google ADK-based AI workflows over extracted document data",
      "Celery-driven background processing so document ingestion doesn't block the API",
      "Backend APIs, business workflows, and state management around the pipeline — plus some frontend bug-fixing and a new frontend module",
    ],
    challenges: [
      "Keeping a multi-stage async pipeline (OCR → embeddings → vector storage) consistent and observable, since a failure at any stage has to be retryable without corrupting downstream state.",
    ],
    links: {
      github: { url: null, label: "GitHub", isPrivate: true },
    },
  },
  {
    id: "haut",
    slug: "haut",
    episodeNumber: 5,
    episodeLabel: "EP 05",
    episodeTitle: "Running the Floor",
    title: "HAUT",
    positioning: "Club & Pub Management / Hospitality Operations Platform",
    theme: "The backend running an entire venue — floor to kitchen to ledger.",
    problem:
      "Hospitality venues (clubs and pubs) needed a single system to run bookings, POS, kitchen operations, inventory, purchasing, staff, and billing instead of stitching together disconnected tools.",
    solution:
      "A backend-driven hospitality operations platform covering venue and outlet management, bookings, POS, KDS, QR ordering, inventory, purchasing, GRN, recipes and recipe costing, employees, billing, payments, discounts, and reporting/analytics — with role-based access control enforced throughout.",
    role: "Backend Developer",
    architecture: {
      kind: "modules",
      groups: [
        {
          title: "Venue & Access",
          items: ["Venue management", "Outlet management", "Employee management", "RBAC"],
        },
        { title: "Front of House", items: ["Bookings", "Tables", "QR ordering", "POS"] },
        {
          title: "Back of House",
          items: ["KDS (kitchen display system)", "Order routing"],
        },
        {
          title: "Inventory & Supply",
          items: ["Inventory", "Purchasing", "GRN", "Recipes", "Recipe costing"],
        },
        { title: "Commerce", items: ["Billing", "Payments", "Discounts"] },
        { title: "Insight", items: ["Reports", "Analytics"] },
      ],
      requestFlow: [
        { label: "Client / POS / Mobile" },
        { label: "FastAPI" },
        { label: "RBAC / Business Logic" },
        { label: "PostgreSQL" },
      ],
    },
    technologies: [
      "python",
      "fastapi",
      "postgresql",
      "asyncpg",
      "redis",
      "pydantic",
      "jwt",
      "pytest",
      "httpx",
    ],
    highlights: [
      "Backend spanning venue, outlet, POS, KDS, inventory, purchasing, and finance in one system",
      "Async FastAPI + PostgreSQL, with Redis alongside for supporting workloads",
      "RBAC-driven access control across venue, outlet, and employee roles",
      "REST API layer built for real POS / KDS / QR-ordering client integrations",
    ],
    challenges: [
      "Designing a single RBAC and business-logic layer flexible enough to serve venue management, POS, kitchen operations, and finance/reporting without collapsing into a pile of special cases.",
    ],
    links: {
      github: { url: null, label: "GitHub", isPrivate: true },
    },
  },
  {
    id: "van-sales-erp",
    slug: "van-sales-distribution-erp",
    episodeNumber: 7,
    episodeLabel: "EP 07",
    episodeTitle: "The Deep Build",
    title: "Van Sales & Distribution ERP",
    positioning: "Multi-Tenant FMCG Distribution ERP",
    theme:
      "The architecture episode — migrations, tests, and a bug that took real diagnosis.",
    problem:
      "FMCG distributors running van-sales operations across multiple branches needed a backend that enforces tenant isolation, role-based permissions, and a real operational lifecycle (purchasing → van loading → route execution → sales) instead of a flat CRUD system.",
    solution:
      "A modular, layered-monolith FastAPI backend: multi-tenant and multi-branch from the schema up, with a 5-tier / 16-role permission model, explicit state machines for order and route lifecycles, full audit logging, and modules covering auth, purchasing, inventory, van loading, routes, sales orders, and promotions.",
    role: "Backend Developer (freelance)",
    architecture: {
      kind: "evidence",
      metrics: [
        { label: "Database migrations", value: "18" },
        { label: "Automated tests", value: "176+" },
        { label: "System roles", value: "16" },
        { label: "Permission tiers", value: "5" },
        { label: "Business-domain modules", value: "9" },
      ],
      requestFlow: [
        { label: "Multi-Tenant" },
        { label: "RBAC" },
        { label: "Domain Modules" },
        { label: "Async SQLAlchemy" },
        { label: "PostgreSQL" },
      ],
      notes: [
        "Modular layered-monolith architecture",
        "Multi-tenant, multi-branch from the schema up",
        "Explicit state machines for order and route lifecycles",
        "Full audit logging across tenant boundaries",
      ],
    },
    technologies: [
      "python",
      "fastapi",
      "postgresql",
      "sqlalchemy",
      "asyncpg",
      "alembic",
      "pydantic",
      "jwt",
      "argon2",
      "totp-2fa",
      "s3",
      "redis",
      "pytest",
      "httpx",
      "ruff",
      "mypy",
    ],
    highlights: [
      "18 database migrations, 176+ automated tests (pytest + pytest-asyncio) against real HTTP + PostgreSQL integration",
      "16 system roles under a 5-tier permission model, enforced with explicit RBAC",
      "Diagnosed and fixed a systemic async SQLAlchemy MissingGreenlet issue",
      "JWT auth with Argon2 password hashing and TOTP-based 2FA",
      "Explicit state machines for order and route lifecycles, with full audit logging",
    ],
    challenges: [
      "A systemic async MissingGreenlet failure in SQLAlchemy's async session handling was surfacing intermittently across endpoints — traced it to a session-lifecycle / greenlet-context mismatch and fixed it at the root instead of patching individual call sites.",
    ],
    links: {
      github: { url: null, label: "GitHub", isPrivate: true },
    },
  },
  {
    id: "viblets",
    slug: "viblets",
    episodeNumber: 4,
    episodeLabel: "EP 04",
    episodeTitle: "Teaching an Agent to Sell",
    title: "Viblets",
    positioning: "AI / Agentic Marketing Automation Platform",
    theme: "An agent that onboards a business and wires up its marketing data.",
    problem:
      "Businesses running marketing on Facebook needed a way to onboard their customer/business data and connect it to their Facebook Business assets without a manual, error-prone setup process.",
    solution:
      "An agent-based workflow, built on Google ADK, that takes in customer and business data, persists it, walks the customer through connecting their Facebook account, and retrieves their Facebook Business Accounts and associated business details — turning a manual onboarding sequence into an automated one.",
    role: "Backend & agent-workflow engineering",
    architecture: {
      kind: "pipeline",
      steps: [
        { label: "Customer data intake" },
        { label: "AI Agent", detail: "Google ADK orchestrates the workflow" },
        { label: "Persist", detail: "FastAPI + PostgreSQL" },
        { label: "Connect Facebook account", detail: "OAuth handoff" },
        { label: "Fetch Facebook Business Accounts" },
        { label: "Fetch associated business details" },
        { label: "Automated marketing workflow" },
      ],
    },
    technologies: [
      "python",
      "fastapi",
      "postgresql",
      "google-adk",
      "llm-integration",
      "facebook-business-api",
    ],
    highlights: [
      "Google ADK agent orchestrating a multi-step business-onboarding flow",
      "FastAPI backend persisting customer/business data to PostgreSQL",
      "Facebook Business API integration for account and business-detail retrieval",
      "Built as a repeatable automated workflow, not a one-off script",
    ],
    challenges: [
      "Coordinating a multi-step agent workflow — data intake, external OAuth, then multiple dependent API calls — so each step stays resilient and store-consistent.",
    ],
    links: {
      github: { url: null, label: "GitHub", isPrivate: true },
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
