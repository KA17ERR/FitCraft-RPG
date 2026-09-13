import { memo } from "react";

/**
 * GymBackground — an entirely original, hand-drawn pixel/voxel gym scene
 * built from plain SVG rects (same technique as CharacterPreview — no
 * imported art, textures, or third-party assets of any kind, and nothing
 * resembling any existing game's blocks/characters/logos).
 *
 * Purely decorative (aria-hidden). It's a single <svg> with a `viewBox`, so
 * it scales losslessly to any container size with zero layout cost and no
 * images to download — cheap to render and cheap on the network.
 *
 * Five NPCs each loop a distinct, lightweight activity, all pure CSS
 * keyframe animations (no per-frame JS, so they're cheap on mobile and
 * keep animating smoothly across every authenticated page):
 *   - Lifting weights  — .animate-npc-lift    (~1.7s, fastest/repetitive)
 *   - Walking           — .animate-npc-walk   (~8s patrol, uneven pauses)
 *   - Running           — .animate-npc-run    (~3.2s, longer/quicker lane)
 *   - Stretching        — .animate-npc-stretch(~4.6s slow sway)
 *   - Resting           — .animate-npc-rest   (~5.2s, barely-there breath)
 * Different durations/positions/pause patterns are deliberate — they keep
 * the scene feeling alive instead of one loop copy-pasted five times. All
 * of it respects prefers-reduced-motion (see index.css).
 *
 * This is the scene itself; it doesn't know or care whether it's being
 * rendered full-viewport as the global app background (see
 * RPGWorldBackground, which is what every authenticated page actually
 * uses) or reused standalone elsewhere.
 *
 * Layout (viewBox 0 0 320 220), back-to-front:
 *   1. wall + floor
 *   2. wall decorations (poster, flag, window)
 *   3. back training area (squat rack, rack of plates)
 *   4. four background NPCs — lifting/walking/running/stretching
 *      (mid-ground, dim, so they never compete with foreground UI)
 *   5. foreground gym gear (bench, dumbbells) — plus the 5th NPC,
 *      resting, seated on the bench
 */
function GymBackground({ className = "" }) {
  return (
    <svg
      viewBox="0 0 320 220"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Wall + floor                                                      */}
      {/* ---------------------------------------------------------------- */}
      <rect x="0" y="0" width="320" height="150" fill="#141c33" />
      <rect x="0" y="150" width="320" height="70" fill="#0e1424" />
      {/* floor plank seams */}
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={`plank-${i}`} x={i * 40} y="150" width="2" height="70" fill="#1c2540" />
      ))}
      {/* floor tile highlight strip (training zone marking) */}
      <rect x="0" y="150" width="320" height="4" fill="#232f52" />

      {/* subtle wall panel seams */}
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={`wall-${i}`} x={i * 64} y="0" width="2" height="150" fill="#182140" opacity="0.6" />
      ))}

      {/* ---------------------------------------------------------------- */}
      {/* Window (top-left) — soft glow, adds depth without extra assets    */}
      {/* ---------------------------------------------------------------- */}
      <rect x="14" y="16" width="46" height="34" fill="#1f2b4d" stroke="#3f4d81" strokeWidth="2" />
      <rect x="14" y="16" width="46" height="34" fill="url(#gymWindowGlow)" opacity="0.5" />
      <rect x="35" y="16" width="4" height="34" fill="#3f4d81" />
      <rect x="14" y="31" width="46" height="4" fill="#3f4d81" />

      {/* ---------------------------------------------------------------- */}
      {/* Motivational wall poster (top-right)                              */}
      {/* ---------------------------------------------------------------- */}
      <rect x="254" y="14" width="40" height="52" fill="#1f2b4d" stroke="#3ecf5f" strokeWidth="2" />
      <rect x="260" y="22" width="28" height="4" fill="#86efac" />
      <rect x="260" y="30" width="20" height="3" fill="#8891b8" />
      <rect x="260" y="36" width="24" height="3" fill="#8891b8" />
      <rect x="264" y="46" width="16" height="14" fill="#ffd166" />

      {/* ---------------------------------------------------------------- */}
      {/* Banner flag — kept off dead-center so it never lands behind/on   */}
      {/* the hero's head once the sprite is centered in narrow layouts.   */}
      {/* ---------------------------------------------------------------- */}
      <rect x="206" y="6" width="4" height="26" fill="#6c7cc0" />
      <rect x="210" y="8" width="32" height="16" fill="#3ecf5f" />
      <polygon points="242,8 250,16 242,24" fill="#3ecf5f" />
      <rect x="216" y="12" width="4" height="4" fill="#0b0e1a" />
      <rect x="224" y="12" width="12" height="4" fill="#0b0e1a" />

      {/* ---------------------------------------------------------------- */}
      {/* Back-left: squat / power rack                                     */}
      {/* ---------------------------------------------------------------- */}
      <g>
        <rect x="18" y="88" width="6" height="62" fill="#3f4d81" />
        <rect x="70" y="88" width="6" height="62" fill="#3f4d81" />
        <rect x="18" y="88" width="58" height="6" fill="#3f4d81" />
        <rect x="18" y="108" width="58" height="4" fill="#6c7cc0" />
        {/* barbell resting in the rack */}
        <rect x="10" y="98" width="74" height="5" fill="#8891b8" />
        <rect x="10" y="96" width="8" height="9" fill="#20242f" />
        <rect x="76" y="96" width="8" height="9" fill="#20242f" />
      </g>

      {/* ---------------------------------------------------------------- */}
      {/* Back-right: weight plate storage rack                             */}
      {/* ---------------------------------------------------------------- */}
      <g>
        <rect x="238" y="94" width="52" height="56" fill="#1a2340" stroke="#3f4d81" strokeWidth="2" />
        {/* stacked plates, largest to smallest */}
        <rect x="244" y="100" width="10" height="42" fill="#ff5d5d" />
        <rect x="256" y="104" width="8" height="34" fill="#ffd166" />
        <rect x="266" y="108" width="7" height="26" fill="#86efac" />
        <rect x="275" y="106" width="8" height="30" fill="#8891b8" />
      </g>

      {/* ---------------------------------------------------------------- */}
      {/* Background NPCs — small, dim, mid-ground gym-goers, each running  */}
      {/* its own lightweight looping activity (lifting / walking /        */}
      {/* running / stretching — "resting" sits separately, below, on top  */}
      {/* of the foreground bench). Deliberately simplified/low-detail +   */}
      {/* lower opacity so they read as ambience, not a focal point, and   */}
      {/* never compete with foreground UI content sitting above this     */}
      {/* whole scene. Every NPC follows the same nesting convention:      */}
      {/*   outer <g transform="translate(x,y)">  — static home position   */}
      {/*     middle <g className="animate-npc-*"> — the activity loop     */}
      {/*       inner shapes (or another nested <g> for a second loop)     */}
      {/* Nesting composes cleanly because each animation lives on its own */}
      {/* element — a CSS animation on `transform` always replaces (never  */}
      {/* merges with) an element's own `transform` attribute or another   */}
      {/* animation on the *same* element, so position/patrol/bob/sway     */}
      {/* each get their own <g> rather than being combined on one.        */}
      {/* ---------------------------------------------------------------- */}
      <g opacity="0.55">
        {/* Lifting weights — stationary at a cable machine, back-left
            mid-ground. Body stays put; only the arm+cable assembly runs
            the rep cycle, on a ~1.7s loop (the fastest, most repetitive
            motion of the set, matching a weight-training tempo). */}
        <g transform="translate(96,118)">
          <g>
            <rect x="10" y="30" width="5" height="16" fill="#20242f" />
            <rect x="19" y="30" width="5" height="16" fill="#20242f" />
            <rect x="8" y="12" width="18" height="20" fill="#4a5a8f" />
            <rect x="10" y="0" width="14" height="14" fill="#c99b73" />
            <rect x="9" y="-3" width="16" height="5" fill="#3a2e26" />
          </g>
          {/* raised arm + cable — the actual "rep" */}
          <g className="animate-npc-lift">
            <rect x="24" y="8" width="12" height="4" fill="#c99b73" />
            <rect x="34" y="-6" width="3" height="18" fill="#6c7cc0" />
          </g>
        </g>

        {/* Simple cable machine stack the NPC is using (static — it's gym
            equipment, not a character) */}
        <g transform="translate(128,112)">
          <rect x="0" y="0" width="16" height="46" fill="#1a2340" stroke="#3f4d81" strokeWidth="2" />
          <rect x="4" y="4" width="8" height="4" fill="#ffd166" />
          <rect x="4" y="10" width="8" height="4" fill="#ffd166" />
          <rect x="4" y="16" width="8" height="4" fill="#ffd166" />
        </g>

        {/* Walking around the gym — patrols a short lane in the upper
            mid-ground, with an uneven pause at each end (via the keyframe
            timing, not JS randomness) so the loop doesn't read as a
            metronome. A nested idle-bob adds a footstep bounce. */}
        <g transform="translate(150,105)">
          <g className="animate-npc-walk">
            <g className="animate-npc-idle" style={{ animationDelay: "0.4s" }}>
              <rect x="4" y="30" width="5" height="14" fill="#20242f" />
              <rect x="15" y="32" width="5" height="14" fill="#20242f" />
              <rect x="3" y="12" width="18" height="20" fill="#c9971f" />
              <rect x="6" y="0" width="14" height="14" fill="#8a5a3b" />
              <rect x="5" y="-3" width="16" height="5" fill="#20242f" />
            </g>
          </g>
        </g>

        {/* Running — a longer, quicker lane closer to the floor line, with
            almost no pause at the ends. Noticeably faster (~3.2s) than the
            walker (~8s) so the two read as different paces, not the same
            loop at different offsets. */}
        <g transform="translate(100,140)">
          <g className="animate-npc-run">
            <g className="animate-npc-idle" style={{ animationDuration: "0.55s", animationDelay: "0.15s" }}>
              <rect x="3" y="22" width="5" height="12" fill="#182140" />
              <rect x="13" y="24" width="5" height="12" fill="#182140" />
              <rect x="2" y="6" width="17" height="16" fill="#6c7cc0" />
              <rect x="5" y="-6" width="13" height="12" fill="#c99b73" />
              <rect x="4" y="-9" width="15" height="4" fill="#20242f" />
            </g>
          </g>
        </g>

        {/* Stretching — stationary on a small mat, mid-ground center. A
            slow full-body sway (pivoting from the feet) reads as a hold
            stretch rather than a step, at roughly a third of the walker's
            pace. */}
        <g transform="translate(185,118)">
          {/* mat, static */}
          <rect x="-6" y="30" width="34" height="4" fill="#233054" opacity="0.8" />
          <g className="animate-npc-stretch">
            <rect x="4" y="18" width="5" height="14" fill="#20242f" />
            <rect x="13" y="18" width="5" height="14" fill="#20242f" />
            <rect x="3" y="4" width="18" height="16" fill="#8891b8" />
            <rect x="6" y="-8" width="14" height="14" fill="#c99b73" />
            <rect x="5" y="-11" width="16" height="5" fill="#3a2e26" />
            {/* arms reaching up */}
            <rect x="-2" y="-4" width="4" height="14" fill="#8891b8" />
            <rect x="22" y="-4" width="4" height="14" fill="#8891b8" />
          </g>
        </g>
      </g>

      {/* ---------------------------------------------------------------- */}
      {/* Foreground left: flat bench                                       */}
      {/* ---------------------------------------------------------------- */}
      <g>
        <rect x="14" y="176" width="66" height="12" fill="#2b3a63" stroke="#3f4d81" strokeWidth="2" />
        <rect x="18" y="188" width="6" height="14" fill="#1a2340" />
        <rect x="70" y="188" width="6" height="14" fill="#1a2340" />
        {/* dumbbell resting under the bench */}
        <rect x="30" y="200" width="24" height="5" fill="#8891b8" />
        <rect x="27" y="197" width="6" height="11" fill="#20242f" />
        <rect x="51" y="197" width="6" height="11" fill="#20242f" />
      </g>

      {/* ---------------------------------------------------------------- */}
      {/* Resting — seated on the flat bench above. Drawn after the bench   */}
      {/* (not inside the mid-ground NPC group) purely so it paints on top  */}
      {/* of the bench seat instead of behind it. The slowest, smallest     */}
      {/* loop of the set (~5s, ~1px) — barely-there breathing rather than  */}
      {/* an activity, since this NPC is meant to read as taking a break.   */}
      {/* ---------------------------------------------------------------- */}
      <g opacity="0.55" transform="translate(34,160)">
        <g className="animate-npc-rest">
          {/* bent, seated legs */}
          <rect x="-2" y="14" width="10" height="6" fill="#182140" />
          <rect x="12" y="14" width="10" height="6" fill="#182140" />
          <rect x="2" y="2" width="16" height="14" fill="#3f4d81" />
          <rect x="4" y="-10" width="13" height="13" fill="#c99b73" />
          <rect x="3" y="-13" width="15" height="4" fill="#20242f" />
        </g>
      </g>

      {/* ---------------------------------------------------------------- */}
      {/* Foreground right: dumbbell rack                                   */}
      {/* ---------------------------------------------------------------- */}
      <g>
        <rect x="238" y="182" width="60" height="8" fill="#2b3a63" stroke="#3f4d81" strokeWidth="2" />
        <rect x="238" y="190" width="6" height="20" fill="#1a2340" />
        <rect x="292" y="190" width="6" height="20" fill="#1a2340" />
        {/* three dumbbells of increasing size, left to right */}
        <g>
          <rect x="244" y="172" width="14" height="4" fill="#6c7cc0" />
          <rect x="242" y="169" width="4" height="10" fill="#20242f" />
          <rect x="254" y="169" width="4" height="10" fill="#20242f" />
        </g>
        <g>
          <rect x="261" y="169" width="16" height="5" fill="#86efac" />
          <rect x="259" y="165" width="5" height="13" fill="#20242f" />
          <rect x="272" y="165" width="5" height="13" fill="#20242f" />
        </g>
        <g>
          <rect x="280" y="166" width="18" height="6" fill="#ffd166" />
          <rect x="277" y="161" width="6" height="16" fill="#20242f" />
          <rect x="292" y="161" width="6" height="16" fill="#20242f" />
        </g>
      </g>

      {/* ---------------------------------------------------------------- */}
      {/* Small potted plant decoration (foreground, far left)              */}
      {/* ---------------------------------------------------------------- */}
      <g transform="translate(0,192)">
        <rect x="0" y="14" width="16" height="12" fill="#8a5a3b" />
        <rect x="2" y="0" width="4" height="16" fill="#3ecf5f" />
        <rect x="6" y="-4" width="4" height="18" fill="#4ade80" />
        <rect x="10" y="2" width="4" height="14" fill="#3ecf5f" />
      </g>

      {/* soft ambient glow so the whole scene reads as a cohesive room */}
      <rect x="0" y="0" width="320" height="220" fill="url(#gymAmbient)" opacity="0.35" />

      <defs>
        <radialGradient id="gymWindowGlow" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#86efac" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#86efac" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gymAmbient" cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#3ecf5f" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0b0e1a" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default memo(GymBackground);
