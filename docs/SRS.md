# Software Requirements Specification (SRS)

Last updated: 2025-11-29

## 1. Introduction

Purpose: This SRS describes the functional and non-functional requirements for the Student Feedback System — a lightweight web application that allows institutions to create feedback forms, collect student responses, and provide admin analytics and exports.

Scope: The system supports two primary user roles: Admin (create/manage forms, view/export responses, analytics) and Student (fill forms, quick feedback). The initial implementation is a client-side SPA (React + Vite) using localStorage for persistence for demo purposes; a production deployment will use a backend API and a relational database.

Definitions:
- Feedback Form: A set of questions (scale, multiple choice, free text) assigned to a course or instructor.
- Response: A submitted set of answers from a student for a specific form.

## 2. Stakeholders

- Administrators: create forms, view responses, analyze results, export data.
- Students: complete feedback forms and submit responses.
- Developers / Integrators: deploy app, connect to backend, integrate with LMS/SSO.

## 3. Overall Description

3.1 Product perspective
- Frontend: React SPA (Vite) with modular components (Form builder, Responses table, Admin Analytics, Charts). Router provides pages for admin and student flows.
- Backend (production target): REST API or GraphQL for CRUD on users, forms, responses, courses; authentication; CSV/PNG export endpoints.
- Storage: Relational DB (Postgres recommended) with normalized schema for forms, questions, responses, answers, users, courses, audit logs.

3.2 Assumptions and Dependencies
- Initial demo uses localStorage; production requires an API and DB.
- Optional integrations: SSO via SAML/OAuth2, LMS-gradebook export.

## 4. Functional Requirements

Each functional requirement uses the format FR-<number>.

- FR-001: Authentication
  - Admin users can log in and access admin pages. (Demo: simple client-side mock; Prod: OAuth2/SAML or database-backed auth)

- FR-002: Form Management
  - Admins can create, edit, duplicate, and delete feedback forms.
  - Support question types: Likert/scale, multiple-choice, short text, long text.

- FR-003: Assignments
  - Admins assign forms to courses and optionally to an instructor or cohort.

- FR-004: Student Submission
  - Students can view assigned forms and submit responses.
  - Form validation enforces required questions.

- FR-005: Quick Feedback
  - Students can submit a short free-text feedback item (compact form) without choosing a form.

- FR-006: Responses Listing & Search
  - Admins can view a paginated table of responses with filters: form, course, date range, text search.
  - Admin can export filtered responses to CSV.

- FR-007: Analytics & Charts
  - Admins can view aggregated metrics: responses by course, average ratings, per-question distributions.
  - Charts support keyboard accessibility, tooltips, percent displays, and click-to-filter behavior.
  - Charts can be exported to PNG and SVG.

- FR-008: Data Seeding (Dev)
  - Developers can seed demo responses locally for testing analytics.

- FR-009: Audit Logging
  - Record admin actions (create/edit/publish forms, export events) with user and timestamp. (Backend requirement)

## 5. Non-functional Requirements

- NFR-001: Performance
  - Admin analytics views render charts for datasets up to 50k responses with client-side aggregation or server-side pagination/aggregation.

- NFR-002: Security
  - Use HTTPS for production.
  - Protect admin endpoints with authentication and role-based access control.
  - Sanitize and escape CSV/HTML exports to prevent injection.

- NFR-003: Privacy
  - Allow anonymized responses; support enable/disable PII collection.
  - Implement data retention policies and deletion endpoints.

- NFR-004: Accessibility
  - Conform to WCAG 2.1 AA for interactive admin pages and charts (keyboard operable, aria labels, focus management).

- NFR-005: Maintainability
  - Modular React components and a context/reducer pattern for state. Clear separation between UI and data-layer.

## 6. Data Model Summary

High-level entities (production):
- User (id, name, email, role)
- Course (id, code, title)
- Form (id, title, description, active, assignedCourseId)
- Question (id, formId, type, prompt, options, required)
- Response (id, formId, courseId, userId (nullable), submittedAt)
- Answer (id, responseId, questionId, value)
- AuditLog (id, userId, action, payload, timestamp)

Note: The repo contains a local sample data and a `docs/erd_and_schema.md` with recommended Postgres DDL.

## 7. API Surface (example)

These are example endpoints for a production backend. Auth protected routes require valid token/session.

- POST /api/auth/login — authenticate user
- GET /api/forms — list forms (with filters)
- POST /api/forms — create form (admin)
- GET /api/forms/:id — get form details and questions
- POST /api/responses — submit a response (student)
- GET /api/responses — list responses (admin, supports filters & pagination)
- GET /api/responses/export?format=csv — export filtered responses as CSV
- GET /api/analytics/forms/:id/summary — aggregated metrics per form (server-side aggregation)
- POST /api/dev/seed — dev-only seed (protected or disabled in prod)

## 8. Security & Privacy Requirements

- Encrypt data at rest and in transit.
- RBAC: Admin-only routes for form management, export, seeding, and audit logs.
- Data minimization: avoid collecting unnecessary PII; allow anonymous responses.
- Rate limiting on submission endpoints to mitigate spam.

## 9. Acceptance Criteria

- AC-001: An admin can create a form, assign it to a course, and see it in the forms list.
- AC-002: A student can submit a form and the response appears in the responses table.
- AC-003: Admin analytics display meaningful aggregated metrics after seeding at least 50 responses per course.
- AC-004: CSV export contains UTF-8 safe values, proper escaping, and matches the applied filters.
- AC-005: Charts are keyboard accessible (Enter/Space activate bars) and have tooltips announced to screen readers.

## 10. Deployment Considerations

- For production, use Node.js backend with Postgres. Host frontend on static hosting (Vercel/Netlify) or serve via backend.
- Use environment-specific configuration for DB credentials, SSO providers, and storage.

## 11. Next Steps

- Review and confirm acceptance criteria with stakeholders.
- Implement backend API and DB migration scripts for production.
- Add e2e tests (Playwright) for critical flows: form creation, submit response, export, analytics filters.

---

If you'd like, I can now:
- Generate Mermaid flow diagrams for the architecture and API flows.
- Produce PNG wireframe mockups of any of the screens in `docs/wireframes.md` (tell me which screen to render).
- Create DB migration SQL files from `docs/erd_and_schema.md`.
