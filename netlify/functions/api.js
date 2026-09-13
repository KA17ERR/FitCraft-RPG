import serverless from "serverless-http";
import app from "../../backend/src/app.js";

// This wraps the EXISTING Express app (routes, middleware, error handling —
// all untouched) so it can run inside a single Netlify Function.
//
// netlify.toml redirects /api/* to this function while preserving the
// original request path (e.g. "/api/auth/login"), which matches exactly
// what backend/src/app.js already expects — no route rewriting needed.
export const handler = serverless(app);
