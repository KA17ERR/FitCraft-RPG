import "dotenv/config";

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
const isRunDirectly = import.meta.url === `file://${process.argv[1]}`;

const PORT = process.env.PORT || 5000;

if (isRunDirectly) {
  app.listen(PORT, () => {
    console.log(`FitCraft backend running on http://localhost:${PORT}`);
  });
}

export default app;
