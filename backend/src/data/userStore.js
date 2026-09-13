// Storage driver dispatcher.
//
// - On Netlify (deployed Functions, or `netlify dev`), Netlify injects
//   NETLIFY_BLOBS_CONTEXT into the process automatically whenever Blobs
//   are configured for the site — we use that as the signal to use the
//   durable Netlify Blobs driver.
// - Everywhere else (plain `node src/server.js` / `npm run dev` locally)
//   we fall back to the simple JSON-file driver so local development
//   keeps working exactly as before, with zero extra setup.
//
// Both drivers expose the same async (findUserByEmail, findUserById,
// createUser) interface, so routes never need to know which one is active.

import * as fileStore from "./userStore.file.js";
import * as blobsStore from "./userStore.blobs.js";

function activeDriver() {
  return process.env.NETLIFY_BLOBS_CONTEXT ? blobsStore : fileStore;
}

export async function findUserByEmail(email) {
  return activeDriver().findUserByEmail(email);
}

export async function findUserById(id) {
  return activeDriver().findUserById(id);
}

export async function createUser(user) {
  return activeDriver().createUser(user);
}
