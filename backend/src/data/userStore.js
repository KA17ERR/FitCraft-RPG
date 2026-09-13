import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// NOTE: This is a lightweight JSON-file persistence layer for Round 1 only.
// It is intentionally isolated behind this module so it can be swapped
// for a real database (Postgres/Mongo/etc.) later without touching routes.

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

export function findUserByEmail(email) {
  const db = readDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id) {
  const db = readDb();
  return db.users.find((u) => u.id === id);
}

export function createUser({ id, username, email, passwordHash, createdAt }) {
  const db = readDb();
  const user = { id, username, email, passwordHash, createdAt };
  db.users.push(user);
  writeDb(db);
  return user;
}
