import { getStore } from "@netlify/blobs";

// Production persistence layer backed by Netlify Blobs.
//
// Netlify Functions are stateless/ephemeral, so writing to a local JSON
// file (see userStore.file.js) does not persist across invocations or
// deploys. Netlify Blobs gives us a simple, zero-infrastructure
// key/value store that *does* persist, scoped to the site.
//
// getStore() picks up its connection info automatically from the
// environment Netlify injects into every Function invocation (and into
// `netlify dev`) — no manual siteID/token wiring required.
//
// Layout:
//   email:<lowercased email>  -> full user record (JSON)
//   id:<user id>              -> lowercased email (index, for findUserById)

const STORE_NAME = "fitcraft-users";

function store() {
  return getStore(STORE_NAME);
}

export async function findUserByEmail(email) {
  const user = await store().get(`email:${email.toLowerCase()}`, { type: "json" });
  return user || undefined;
}

export async function findUserById(id) {
  const email = await store().get(`id:${id}`, { type: "text" });
  if (!email) return undefined;
  return findUserByEmail(email);
}

export async function createUser({ id, username, email, passwordHash, createdAt }) {
  const user = { id, username, email, passwordHash, createdAt };
  const key = `email:${email.toLowerCase()}`;

  await store().setJSON(key, user);
  await store().set(`id:${id}`, email.toLowerCase());

  return user;
}
