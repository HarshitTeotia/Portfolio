import type { Project } from "./types";

/** Primary case studies first; existing route slugs and episode numbers are preserved.
 * Facts reviewed against the November 13, 2026 brief. Viblets retains its existing narrative. */
export const projects: Project[] = [
  {
    id: "vrozart-finance",
    slug: "vrozart-finance",
    episodeNumber: 6,
    episodeLabel: "EP 06",
    episodeTitle: "Reading Between the Lines",
    title: "MSME Lending & AI-Powered Loan Management Platform",
    positioning: "Backend Engineering / Applied AI & Document Intelligence",
    theme:
      "Loan application APIs, financial-document retrieval, and an investigation into LLM data integrity.",
    problem:
      "MSME loan applications combine structured application information with uploaded financial documents. The backend needs to validate business workflows and make document information retrievable for AI-assisted responses.",
    solution:
      "A FastAPI and PostgreSQL application with React modules, Google ADK conversational flows, and a document pipeline using OCR/PDF extraction, chunking, metadata, embeddings, Qdrant retrieval, and RAG. Celery and AWS S3 support document processing and storage.",
    role: "Python Developer — backend APIs, document/AI workflow integration, and React contributions",
    architecture: {
      kind: "pipeline",
      steps: [
        {
          label: "Document intake",
          detail: "Stored in S3",
        },
        {
          label: "OCR / extraction",
          detail: "Tesseract + PDFPlumber",
        },
        {
          label: "Chunking",
        },
        {
          label: "Embeddings",
          detail: "Document embeddings",
        },
        {
          label: "Vector storage",
          detail: "Qdrant",
        },
        {
          label: "Similarity search",
          detail: "Vector retrieval",
        },
        {
          label: "RAG workflow",
          detail: "Google ADK / AI workflows",
        },
      ],
      notes: [
        "Document processing uses Celery; uploaded files are stored in AWS S3.",
        "Architecture overview of the workflow; security mitigations are proposals, not verified deployed controls.",
      ],
    },
    technologies: [
      "python",
      "fastapi",
      "postgresql",
      "react",
      "google-adk",
      "qdrant",
      "celery",
      "s3",
      "tesseract-ocr",
      "pdfplumber",
      "rest-apis",
      "llm-integration",
      "rag",
      "openai-embeddings",
    ],
    highlights: [
      "Developed and integrated backend APIs for loan applications and financial-document workflows.",
      "Worked with Tesseract OCR and PDFPlumber to extract uploaded financial-document content.",
      "Supported chunking, metadata handling, embeddings, Qdrant vector retrieval, and RAG-based information retrieval.",
      "Worked with Google ADK conversational flows for structured loan application information.",
      "Contributed application validation and business rules, React modules, and frontend/backend work involving approximately 40+ API integrations.",
    ],
    challenges: [
      "Keeping document extraction, retrieval, and application validation distinct: an LLM-generated financial response should be checked against its source rather than treated as authoritative business data.",
    ],
    links: {
      github: {
        url: null,
        label: "GitHub",
        isPrivate: true,
      },
      demo: {
        url: null,
        label: "Watch project demo",
      },
    },
    investigation: {
      title: "Prompt-Injection Investigation",
      findings: [
        "Reproduced and analyzed a document-grounded LLM/RAG failure during testing: instructions embedded in a PDF influenced the generated financial response.",
        "In an anonymized test example, the original income figure was INR 3 LPA, while the manipulated output reported INR 15 LPA. This demonstrated a data-integrity risk in the document workflow.",
        "Identified the trust-boundary problem between untrusted document content and application instructions. Proposed safer retrieval-grounding, instruction separation, and source validation approaches.",
        "The confirmed work was investigation, reproduction, and proposed mitigations. Deployment of safeguards and a complete fix have not been verified.",
      ],
    },
    lessons: [
      "Treat retrieved text as untrusted data, with a clear separation from application instructions.",
      "Validate financial outputs against source evidence and backend business rules; fluent generated text is not proof of correctness.",
    ],
  },
  {
    id: "van-sales-erp",
    slug: "van-sales-distribution-erp",
    episodeNumber: 7,
    episodeLabel: "EP 07",
    episodeTitle: "The Deep Build",
    title: "Van Sales & Distribution ERP",
    positioning: "Multi-Tenant Backend Engineering / ERP Systems",
    theme:
      "Nine business modules, 16 system roles, 18 migrations, and 176+ automated tests.",
    problem:
      "Distribution operations need connected inventory, purchasing, credit, van loading, route, and accounting workflows with consistent permissions and business validation.",
    solution:
      "A modular, multi-tenant FastAPI backend backed by PostgreSQL and asynchronous SQLAlchemy, with JWT/RBAC, Alembic migrations, approval workflows, validation, audit logging, and Pytest coverage.",
    role: "Backend Developer",
    architecture: {
      kind: "evidence",
      metrics: [
        {
          label: "Database migrations",
          value: "18",
        },
        {
          label: "Automated tests",
          value: "176+",
        },
        {
          label: "System roles",
          value: "16",
        },
        {
          label: "Business-domain modules",
          value: "9",
        },
      ],
      requestFlow: [
        {
          label: "Multi-Tenant",
        },
        {
          label: "RBAC",
        },
        {
          label: "Domain Modules",
        },
        {
          label: "Async SQLAlchemy",
        },
        {
          label: "PostgreSQL",
        },
      ],
      notes: [
        "Modular multi-tenant backend",
        "Approval workflows, validation, and audit logging",
        "Nine business modules supported by database migrations and automated tests",
      ],
    },
    technologies: [
      "python",
      "fastapi",
      "postgresql",
      "sqlalchemy",
      "alembic",
      "pytest",
      "rest-apis",
      "jwt",
      "rbac",
    ],
    highlights: [
      "Contributed across nine business modules: inventory, purchasing, goods receipt, pricing, customer credit, van loading, routes, inventory ledger, and accounting workflows.",
      "Worked on authorization and RBAC across 16 system roles.",
      "Contributed approval workflows, business validation, and audit logging.",
      "Worked with 18 Alembic database migrations and developed and executed an automated suite containing 176+ tests.",
      "Investigated and resolved an asynchronous SQLAlchemy MissingGreenlet problem.",
    ],
    challenges: [
      "Diagnosed and resolved an asynchronous SQLAlchemy MissingGreenlet failure. This reinforced the importance of checking async ORM behavior alongside API workflows.",
    ],
    links: {
      github: {
        url: null,
        label: "GitHub",
        isPrivate: true,
      },
    },
    lessons: [
      "Test permission boundaries, approval transitions, and database changes alongside individual endpoints.",
    ],
  },
  {
    id: "haut",
    slug: "haut",
    episodeNumber: 5,
    episodeLabel: "EP 05",
    episodeTitle: "Running the Floor",
    title: "HAUT: Hospitality Booking & Operations Platform",
    positioning: "Hospitality Operations / Backend Systems",
    theme:
      "One backend supporting bookings, POS, kitchen displays, QR ordering, and billing.",
    problem:
      "Venue operations require connected booking, order, kitchen, inventory, and billing workflows, with consistent access control and validation across several client applications.",
    solution:
      "FastAPI backend services with PostgreSQL, Redis, and Pydantic, supporting venue bookings, POS and billing, kitchen displays and order management, QR ordering, and inventory-related operational modules.",
    role: "Backend Developer",
    architecture: {
      kind: "modules",
      groups: [
        {
          title: "Venue & Access",
          items: ["Bookings", "Venue operations", "Authentication / RBAC"],
        },
        {
          title: "Ordering",
          items: ["POS", "QR ordering", "Order management"],
        },
        {
          title: "Kitchen",
          items: ["Kitchen display system", "Order workflows"],
        },
        {
          title: "Operations",
          items: ["Inventory workflows", "Billing"],
        },
      ],
      requestFlow: [
        {
          label: "Client / POS / Mobile",
        },
        {
          label: "FastAPI",
        },
        {
          label: "RBAC / Business Logic",
        },
        {
          label: "PostgreSQL",
        },
      ],
    },
    technologies: [
      "python",
      "fastapi",
      "postgresql",
      "redis",
      "pydantic",
      "rest-apis",
      "rbac",
    ],
    highlights: [
      "Contributed backend services for bookings and venue operations.",
      "Worked on POS and billing workflows and supported kitchen display and order management functionality.",
      "Worked with QR ordering, inventory-related workflows, and operational modules.",
      "Contributed authentication, RBAC, validation, and integrations used by frontend, POS, and KDS clients.",
    ],
    challenges: [
      "Supporting several operational workflows through one backend while keeping permissions, input validation, and client integrations consistent.",
    ],
    links: {
      github: {
        url: null,
        label: "GitHub",
        isPrivate: true,
      },
    },
    lessons: [
      "Operational clients need clear API contracts and consistent validation across booking, ordering, kitchen, and billing workflows.",
    ],
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
        {
          label: "Customer data intake",
        },
        {
          label: "AI Agent",
          detail: "Google ADK orchestrates the workflow",
        },
        {
          label: "Persist",
          detail: "FastAPI + PostgreSQL",
        },
        {
          label: "Connect Facebook account",
          detail: "OAuth handoff",
        },
        {
          label: "Fetch Facebook Business Accounts",
        },
        {
          label: "Fetch associated business details",
        },
        {
          label: "Automated marketing workflow",
        },
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
      github: {
        url: null,
        label: "GitHub",
        isPrivate: true,
      },
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
