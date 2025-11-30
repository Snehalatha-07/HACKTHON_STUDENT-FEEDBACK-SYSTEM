# System Architecture — Student Feedback System

```mermaid
graph LR
  subgraph Frontend
    A[React + Vite SPA]\n    A -->|REST / GraphQL| B(Backend API)
  end

  subgraph Backend
    B(Backend API) --> C[(PostgreSQL)]
    B --> D[(Redis / Cache)]
    B --> E[(Object Storage - S3)]
    B --> F[(Background Worker)]
    F --> G[(Message Queue - RabbitMQ / SQS)]
    F --> H[(Analytics / NLP Service)]
  end

  subgraph Integrations
    B --> I[SSO / Identity Provider (SAML/OAuth2)]
    B --> J[LMS (Moodle/Canvas)]
    B --> K[Email / SMS Provider]
  end

  subgraph Ops
    B --> L[Monitoring (Prometheus / Grafana)]
    B --> M[CI/CD (GitHub Actions)]
  end

  classDef infra fill:#f9f,stroke:#333,stroke-width:1px;
  class C,D,E,F,G,H infra;
```

## Overview

- Frontend: React + Vite single-page application (current repo). Responsible for UI, client-side routing, charts and form builder.
- Backend API: Node.js (Express / Fastify) or Python (FastAPI) exposing REST or GraphQL endpoints for CRUD operations, auth, and analytics ingestion.
- Database: PostgreSQL for relational data (users, courses, forms, responses). Use migrations (Knex, TypeORM, Prisma).
- Cache: Redis for sessions, rate-limiting, and caching aggregated analytics.
- Object Storage: S3-compatible for attachments, exports (CSV/PDF), and image assets.
- Background Workers: process heavy tasks like CSV exports, report generation, NLP sentiment analysis.
- Message Queue: SQS or RabbitMQ to decouple long-running jobs.
- Integrations: SSO via OAuth2/SAML for campus auth; LMS integration via LTI or API; Email/SMS for notifications.
- Observability: Prometheus/Grafana for metrics and logging; Sentry for error tracking.

## Deployment Recommendations

- Frontend: Deploy to Vercel, Netlify, or static hosting behind CDN.
- Backend: Containerized services on AWS ECS/Fargate, Google Cloud Run, or Kubernetes.
- Database: Managed Postgres (RDS, Cloud SQL) with automated backups and read replicas if needed.
- Secrets: Use AWS Parameter Store or HashiCorp Vault.

## Security Considerations

- Enforce HTTPS everywhere.\n- Use OAuth2 / SAML for SSO and role-based access control.\n- Encrypt sensitive data at rest (database-level encryption) and in transit.\n- Follow privacy controls for anonymous vs identified feedback (opt-in, retention policies).\n
## Technology Choices (suggested)

- Frontend: React (current), TypeScript, Tailwind or CSS modules.\n- Backend: Node.js + Fastify or Express with TypeScript.\n- DB: PostgreSQL.\n- Auth: OAuth2 / OpenID Connect, optional 2FA using TOTP.\n- NLP: Python microservice using HuggingFace / spaCy for sentiment.

---

If you want, I can produce this diagram as an SVG file and a one-page PDF for architecture review.
