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
//
// IMPORTANT: userStore.file.js resolves its db.json path via
// `fileURLToPath(import.meta.url)`. That's correct and safe when Node runs
// it directly as a real ES module (local dev), but esbuild's ESM->CommonJS
// conversion for Netlify Functions does not reliably preserve import.meta.url,
// which made that call receive `undefined` and throw
// `TypeError [ERR_INVALID_ARG_TYPE]` — at MODULE LOAD time, crashing every
// request (including /api/health) even though production never calls the
// file driver. A static `import * as fileStore from "./userStore.file.js"`
// would evaluate that file's top-level code unconditionally on every cold
// start, so we import it dynamically instead, and only when it will
// actually be used (i.e. never inside a deployed Netlify Function).

import * as blobsStore from "./userStore.blobs.js";

function useBlobs() {
  return Boolean(process.env.NETLIFY_BLOBS_CONTEXT);
}

let fileStorePromise = null;
function loadFileStore() {
  // Cached + lazy: only ever imported outside Netlify's Blobs context
  // (i.e. real local `node`/`nodemon`), where import.meta.url is always valid.
  if (!fileStorePromise) {
    fileStorePromise = import("./userStore.file.js");
  }
  return fileStorePromise;
}

async function activeDriver() {
  return useBlobs() ? blobsStore : loadFileStore();
}

export async function findUserByEmail(email) {
  const driver = await activeDriver();
  return driver.findUserByEmail(email);
}

export async function findUserById(id) {
  const driver = await activeDriver();
  return driver.findUserById(id);
}

export async function createUser(user) {
  const driver = await activeDriver();
  return driver.createUser(user);
}
