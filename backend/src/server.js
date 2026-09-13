import "dotenv/config";
import { pathToFileURL } from "node:url";

import app from "./app.js";

// This file is the LOCAL DEVELOPMENT entry point only.
//
// The Netlify Function (netlify/functions/api.js) imports `app.js`
// directly and wraps it with serverless-http — it never imports this
// file, so app.listen() is never called in production.
//
// The guard below is a second line of defense: app.listen() only runs
// when this file is executed directly (e.g. `node src/server.js` or
// `npm run dev`), not when it's imported from somewhere else.
//
// NOTE: comparing `import.meta.url` against a hand-built
// `file://${process.argv[1]}` string breaks on Windows — Windows gives
// process.argv[1] as a raw path like `C:\...\server.js` (backslashes,
// no `file:///` prefix or drive-letter slash), which never matches the
// properly-encoded URL Node puts in import.meta.url. That silently
// made this guard always false on Windows, so app.listen() never ran
// and the process just exited. pathToFileURL() normalizes the argv
// path the same way Node built import.meta.url, so the comparison
// works on Windows, macOS, and Linux alike.
const isRunDirectly = import.meta.url === pathToFileURL(process.argv[1]).href;

const PORT = process.env.PORT || 5000;

if (isRunDirectly) {
  app.listen(PORT, () => {
    console.log(`FitCraft backend running on http://localhost:${PORT}`);
  });
}

export default app;
