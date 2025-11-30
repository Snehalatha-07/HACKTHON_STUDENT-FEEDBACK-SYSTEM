# Student Feedback Server (dev)

This is a minimal backend scaffold for local development. It uses SQLite for local persistence and exposes a few endpoints useful for the frontend demo.

Quick start (from `server/`):

1. Install dependencies:

```powershell
npm install
```

2. Start the server:

```powershell
npm start
```

The server will listen on `http://localhost:4000` by default.

Available endpoints:
- `GET /api/forms` — list forms
- `POST /api/forms` — create a form
- `GET /api/responses` — list responses (aggregated answers)
- `POST /api/responses` — submit a response
- `POST /api/dev/seed` — create demo course/form/responses (body: `{ count: <number> }`)

Seeding from the CLI (after server is running):

```powershell
node seed.js 200
```

Notes:
- For production use, replace SQLite with Postgres and harden auth and exports.
