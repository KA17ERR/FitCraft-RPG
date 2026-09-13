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

- User accounts are persisted to a small JSON file (`backend/src/data/db.json`, gitignored)
  behind a single `userStore.js` module. It's intentionally isolated so swapping in a real
  database later won't touch any routes or business logic.
- No gameplay features (quests, XP, stats) are implemented yet — this round is scaffolding
  and authentication only, per spec.
- The JWT is the only thing kept in `localStorage`; it is not used as an application database.

## What's next

Round 2+ will layer in the actual RPG mechanics: quest logging, XP/leveling, character stats,
and reward systems on top of this authenticated shell.
