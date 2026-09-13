import { memo } from "react";
import GymBackground from "./GymBackground";

/**
 * RPGWorldBackground — the single, global "living gym" background for every
 * authenticated screen in FitCraft (Dashboard, Workout, Nutrition, Water,
 * Progress, Character, Shop, Emotes, and any future screen behind auth).
 *
 * Architecture:
 *   - Mounted exactly once, at the top of the authenticated app in App.jsx —
 *     NOT inside Dashboard, and NOT re-mounted per-page. Because it lives
 *     above the router's page-transition tree instead of inside any single
 *     route's element, it never unmounts or resets while navigating between
 *     authenticated pages; only the foreground page content swaps out.
 *   - `fixed inset-0` + low z-index (z-0): sits behind literally everything
 *     else in the app. Pages render their own content at a higher z-index
 *     (see the shared page-shell pattern: `relative z-10`, no opaque
 *     `bg-*` on the outer wrapper) so the world shows through the gaps
 *     between panels instead of being covered by a second, duplicate
 *     background.
 *   - `pointer-events-none` + `aria-hidden`: purely decorative, never
 *     intercepts clicks/taps and is invisible to assistive tech.
 *   - Reuses <GymBackground>, which is itself just a `viewBox` SVG with
 *     `preserveAspectRatio="xMidYMax slice"`, so it losslessly covers any
 *     viewport size — phone, tablet, or desktop — with no image assets and
 *     no layout cost.
 *
 * Do NOT import this into individual pages. If a page needs to render
 * behind the world background, it gets that for free just by living inside
 * the authenticated layout in App.jsx.
 */
function RPGWorldBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-ink">
      <GymBackground className="h-full w-full" />

      {/* Readability scrim — a flat dark tint plus a slightly heavier
          vignette at the edges, so header text, nav, and any empty space
          between panels stay legible without every page needing its own
          overlay (that job now lives here, once, globally). */}
      <div className="pointer-events-none absolute inset-0 bg-ink/55" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(11,14,26,0.75)_100%)]" />
    </div>
  );
}

export default memo(RPGWorldBackground);
