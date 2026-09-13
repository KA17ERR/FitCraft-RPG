import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// NOTE: This is a lightweight JSON-file persistence layer for LOCAL
// DEVELOPMENT ONLY. Netlify Functions run in an ephemeral, read-only-ish
// filesystem, so this driver must never be used in production — see
// userStore.js, which picks this driver only when NOT running inside a
// Netlify Function.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "db.json");

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
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
