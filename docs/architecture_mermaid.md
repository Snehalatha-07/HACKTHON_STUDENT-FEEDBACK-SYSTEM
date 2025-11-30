```mermaid
graph LR
  subgraph Frontend
    A[React SPA (Vite)]
    A -->|REST/GraphQL| B[Backend API]
  end

  subgraph Backend
    B[Backend API]
    B --> C[(Postgres / SQLite)]
    B --> D[Auth Provider (OAuth2 / SSO)]
    B --> E[Storage: Object Storage (S3) for Exports]
  end

  subgraph Integrations
    F[LMS / SIS]
    G[Email Service]
  end

  B --> F
  B --> G

  style A fill:#f9f,stroke:#333,stroke-width:1px
  style B fill:#bbf,stroke:#333,stroke-width:1px
  style C fill:#bfb,stroke:#333,stroke-width:1px
  style F fill:#ffd,stroke:#333,stroke-width:1px
```

Notes:
- Frontend: React SPA served by Vite in dev; built static assets deployed to CDN or static hosting.
- Backend: Node.js/Express or similar exposing a REST/GraphQL API; runs DB migrations and provides CSV/PNG export endpoints.
- DB: Postgres recommended for production; SQLite acceptable for local dev and demos.
- Integrations: SSO/OAuth2 for admin auth; LMS integration for gradebook or roster syncing; S3 for storing exported files.
