import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// NOTE: This is a lightweight JSON-file persistence layer.
//
// Local dev (`node`/`nodemon`): reads/writes the real file at
// backend/src/data/db.json, exactly as before.
//
// Deployed Netlify Function: a Function's own source directory is bundled
// read-only at runtime (this is true regardless of path-resolution method —
// Lambda mounts the deployment package read-only), and backend/src/data/db.json
// is git-ignored besides, so a fresh git-based Netlify build never has that
// file on disk to begin with. /tmp is the one path Lambda/Netlify Functions
// guarantee is writable, so that's where this driver reads/writes whenever
// it detects it's actually running inside a Function invocation. The file is
// created there on first use (see readDb()), starting from an empty user
// list — this keeps signup/login working for the demo, with the known
// tradeoff that data doesn't survive a cold start; see userStore.blobs.js
// for the durable, Netlify Blobs-backed driver intended for a later round.
//
// AWS_LAMBDA_FUNCTION_NAME is set by the Lambda runtime for every real
// invocation (cold or warm) of a Netlify Function, and is never set for a
// plain `node src/server.js` / `nodemon` process — so local dev always takes
// the branch below that resolves import.meta.url, which is only ever safe
// to do in that real-ESM context.
//
// This matters because esbuild's ESM->CommonJS conversion for Netlify
// Functions does NOT preserve import.meta.url (it evaluates to `undefined`
// in the bundled output), which is exactly what made fileURLToPath() throw
// `TypeError [ERR_INVALID_ARG_TYPE]` before: dbPath() used to call it
// unconditionally, including inside the bundled Function. Guarding it behind
// the Lambda check below means that line simply never executes in
// production, so the broken value it would produce there never matters.
function dbPath() {
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return "/tmp/db.json";
  }
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.join(__dirname, "db.json");
}

function readDb() {
  const DB_PATH = dbPath();
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDb(db) {
  fs.writeFileSync(dbPath(), JSON.stringify(db, null, 2));
}

// Async wrappers so this driver's interface matches userStore.blobs.js
// exactly — callers (auth.routes.js) always `await` regardless of driver.

export async function findUserByEmail(email) {
  const db = readDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id) {
  const db = readDb();
  return db.users.find((u) => u.id === id);
}

export async function createUser({ id, username, email, passwordHash, createdAt }) {
  const db = readDb();
  const user = { id, username, email, passwordHash, createdAt };
  db.users.push(user);
  writeDb(db);
  return user;
}
