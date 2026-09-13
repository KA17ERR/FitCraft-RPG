import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// NOTE: This is a lightweight JSON-file persistence layer for LOCAL
// DEVELOPMENT ONLY. Netlify Functions run in an ephemeral, read-only-ish
// filesystem, so this driver must never be used in production — see
// userStore.js, which only ever dynamically imports this module outside
// Netlify's Blobs context.
//
// __dirname/DB_PATH are resolved lazily, inside dbPath(), rather than at
// module top-level. This module is only ever loaded when it will actually
// be used (real local `node`/`nodemon`), so import.meta.url is always
// valid here — but computing it lazily means this module can never crash
// merely by being imported, only if something genuinely tries to read or
// write the local db file.
function dbPath() {
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
