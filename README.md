# FitCraft RPG

A fitness tracker disguised as a pixel-art RPG. Real workouts become quests — XP, levels,
stats, and character progression are on the way. **Round 1** lays the foundation: a polished
frontend shell and working signup/login/logout authentication.

## Stack

- **Frontend:** React + Vite, Tailwind CSS, Framer Motion, React Router
- **Backend:** Node.js + Express, JWT auth, bcrypt password hashing

## Project structure

```
FITCRAFT/
├── frontend/   React app (http://localhost:5173)
├── backend/    Express API (http://localhost:5000)
├── package.json   Root orchestrator (runs both via concurrently)
└── README.md
```

## Getting started

### 1. Install dependencies

From the project root:

```bash
npm run install:all
```

This installs the root, `backend/`, and `frontend/` dependencies in one go.

### 2. Configure environment variables

Both apps ship with `.env.example` files already copied to `.env` with working defaults for
local development. If you ever need to reset them:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Backend `.env`:

| Variable         | Description                                  |
| ---------------- | --------------------------------------------- |
| `PORT`           | Port the API listens on (default `5000`)      |
| `JWT_SECRET`      | Secret used to sign JWTs — already randomized |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`)                 |
| `CORS_ORIGIN`    | Allowed frontend origin for CORS              |

Frontend `.env`:

| Variable       | Description                     |
| -------------- | -------------------------------- |
| `VITE_API_URL` | Base URL of the backend API      |

### 3. Run the app

From the project root, in **one terminal**:

```bash
npm run dev
```

This starts both servers concurrently:

- Frontend → http://localhost:5173
- Backend → http://localhost:5000

### 4. Verify it's working

- Visit http://localhost:5173 — you'll be redirected to the login screen.
- Create an account, then log in and out to confirm the auth flow works end to end.
- Check the API directly: `curl http://localhost:5000/api/health`

## Auth API

| Method | Route               | Description                          | Auth required |
| ------ | -------------------- | ------------------------------------- | -------------- |
| GET    | `/api/health`         | Health check                          | No             |
| POST   | `/api/auth/signup`   | Create an account                     | No             |
| POST   | `/api/auth/login`    | Log in, returns a JWT                 | No             |
| POST   | `/api/auth/logout`   | Logout (client discards the token)    | Yes            |
| GET    | `/api/auth/me`       | Get the current authenticated user    | Yes            |

Authenticated requests send `Authorization: Bearer <token>`.

## Notes on this round

- User accounts are persisted behind a single `userStore.js` module with two interchangeable
  drivers, selected automatically at runtime:
  - **Local dev:** `userStore.file.js` — a small JSON file (`backend/src/data/db.json`, gitignored).
  - **Netlify (deployed, or `netlify dev`):** `userStore.blobs.js` — [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/),
    which actually persists across requests/deploys, unlike the local filesystem.
  It's intentionally isolated so swapping in a real database later won't touch any routes or
  business logic.
- No gameplay features (quests, XP, stats) are implemented yet — this round is scaffolding
  and authentication only, per spec.
- The JWT is the only thing kept in `localStorage`; it is not used as an application database.

## Deploying to Netlify (single site)

This repo deploys as **one** Netlify site: the frontend is served as static files, and the
Express backend runs as a single Netlify Function.

### How it fits together

- `netlify/functions/api.js` wraps the *existing* Express app (`backend/src/app.js`) with
  [`serverless-http`](https://www.npmjs.com/package/serverless-http) — no routes were rewritten.
- `netlify.toml` builds the frontend, publishes `frontend/dist`, and redirects `/api/*` to that
  function while preserving the original path (e.g. `/api/auth/login`), which is exactly what
  `app.js`'s routes already expect.
- `backend/src/server.js` is **local-dev only**. It's never imported by the Netlify Function, and
  it also guards `app.listen()` behind an "am I being run directly?" check as a second safety net.
- Because the frontend and API are served from the same Netlify site/domain in production,
  requests to `/api/*` are same-origin — no CORS configuration needed in production.

### One-time setup

1. Push this repo to GitHub/GitLab/Bitbucket and create a new Netlify site from it (or run
   `netlify init` / `netlify deploy` from the CLI). Netlify will read `netlify.toml`
   automatically — no manual build settings needed.
2. In **Site settings → Environment variables**, set:
   - `JWT_SECRET` — a long random string (never commit this or put it in `netlify.toml`)
   - `JWT_EXPIRES_IN` — e.g. `7d`
   - `CORS_ORIGIN` — your Netlify site URL (optional in production, since requests are same-origin;
     mainly useful if you ever call the API from a different origin)
   - `VITE_API_URL` — optional; defaults to `/api` automatically if left unset
3. Enable **Netlify Blobs** for the site (this is automatic/on-by-default for most plans — no
   manual provisioning needed; `NETLIFY_BLOBS_CONTEXT` is injected into Functions automatically).
4. Deploy. Netlify will run the `command` in `netlify.toml`, which installs root, `backend/`, and
   `frontend/` dependencies and builds the frontend.

### Local testing of the deployed shape

```bash
npm install -g netlify-cli   # if you don't have it
netlify dev
```

`netlify dev` serves the frontend, proxies `/api/*` to the bundled function locally, and injects
a working `NETLIFY_BLOBS_CONTEXT`, so you can exercise the exact same code path (Blobs included)
that runs in production — without deploying.

### Troubleshooting: native modules (bcrypt)

`bcrypt` ships a compiled native `.node` binary, not plain JS. esbuild's function bundler can't
statically inline that binary — it can only bundle regular JS/TS source. If bcrypt (or any other
native module) isn't set up correctly, the deployed function fails at *runtime* (not build time)
with `Runtime.ImportModuleError: Cannot find module 'bcrypt'`, because the bundler resolves
dependencies relative to the function file (`netlify/functions/api.js`), not the deeper backend
files that actually `import` them — so a package that only lives in `backend/node_modules`
(a sibling directory, not an ancestor of the function file) isn't found.

This is fixed with two changes that work together:

- `bcrypt` is listed in **root** `package.json` too (in addition to `backend/package.json`), so
  it installs into `node_modules` at the repo root — an ancestor directory the function bundler
  can actually resolve from.
- `netlify.toml`'s `[functions]` block sets `external_node_modules = ["bcrypt"]`, telling esbuild
  to leave `require("bcrypt")` as a real `require` call instead of trying to bundle it; Netlify
  then copies the real `bcrypt` package (binary included) into the deployed function bundle.

Password hashing/verification logic itself (`bcrypt.hash` / `bcrypt.compare` in
`backend/src/routes/auth.routes.js`) is untouched — this only fixes how the module is packaged
for deployment.

### Verifying auth after deploying

```bash
curl https://<your-site>.netlify.app/api/health

curl -X POST https://<your-site>.netlify.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"tester","email":"tester@example.com","password":"password123"}'

curl -X POST https://<your-site>.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tester@example.com","password":"password123"}'

# Use the token returned above:
curl https://<your-site>.netlify.app/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## What's next

Round 2+ will layer in the actual RPG mechanics: quest logging, XP/leveling, character stats,
and reward systems on top of this authenticated shell.
