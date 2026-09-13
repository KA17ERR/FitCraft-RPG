// Storage driver.
//
// For this round, the JSON-file driver (userStore.file.js) is the one
// active store, in both local dev and on Netlify — see that file for how
// it stays safe (and writable) once bundled into a Netlify Function.
//
// This used to switch to userStore.blobs.js (Netlify Blobs) whenever
// process.env.NETLIFY_BLOBS_CONTEXT was set, falling back to the file
// driver otherwise. In practice NETLIFY_BLOBS_CONTEXT was never set for
// this site, so every deployed request silently fell back to the file
// driver anyway — while still paying for the extra indirection, and while
// leaving the file driver's own bug (see git history / userStore.file.js)
// completely unexercised by anyone assuming Blobs was in use. Rather than
// depend on that env var to decide which store is "live", the JSON driver
// is now used unconditionally, so there's exactly one, predictable code
// path to reason about and test. userStore.blobs.js is left in place,
// unused, for a later round when durable cross-invocation storage is
// actually needed.
export { findUserByEmail, findUserById, createUser } from "./userStore.file.js";
