import { motion } from "framer-motion";
import { findOption, BODY_TYPES, SKIN_TONES, HAIR_COLORS, OUTFITS, DEFAULT_CHARACTER } from "../utils/characterOptions";

// ---------------------------------------------------------------------
// ExerciseAnimation
//
// A small, original, SVG + Framer Motion "rig" that shows the player's
// ACTUAL customized hero (body type, skin tone, hair color + hairstyle,
// outfit, accessories) performing a specific exercise. Each supported
// exercise gets its own simple, clearly-readable pose with several
// animated joints, drawn from flat rects in the same palette/hairstyle/
// accessory system as the character customizer (CharacterPreview /
// characterOptions.jsx), so it reads as "your hero training" rather than
// a generic stick figure or a disconnected pile of shapes.
//
// Every part of a given pose is drawn inside one continuous, connected
// skeleton (legs meet the hips, hips meet the torso, torso meets the
// head) — nothing is a separate floating piece. Body-type differences
// (lean/athletic/mighty) are expressed as a uniform width/thickness
// scale of that one skeleton, so proportions stay consistent instead of
// drifting parts apart.
//
// No third-party art of any kind — every shape below is an original
// <rect>, and every motion is a plain SVG transform animated by
// Framer Motion.
// ---------------------------------------------------------------------

export const EXERCISE_KEYS = [
  "squat",
  "pushup",
  "bicep-curl",
  "bench-press",
  "deadlift",
  "plank",
  "running",
];

export const EXERCISE_LABELS = {
  squat: "Squat",
  pushup: "Push-Up",
  "bicep-curl": "Bicep Curl",
  "bench-press": "Bench Press",
  deadlift: "Deadlift",
  plank: "Plank",
  running: "Running",
};

// Non-exercise poses the same rig system supports — used by the embedded
// workout flow for the resting/idle stance and the post-set celebration.
export const IDLE_POSE = "idle";
export const CELEBRATE_POSE = "celebrate";

function usePalette(character) {
  const source = { ...DEFAULT_CHARACTER, ...(character || {}) };
  const body = findOption(BODY_TYPES, source.bodyType) || BODY_TYPES[1];
  const skin = findOption(SKIN_TONES, source.skinTone)?.hex || SKIN_TONES[2].hex;
  const hair = findOption(HAIR_COLORS, source.hairColor)?.hex || HAIR_COLORS[1].hex;
  const outfit = findOption(OUTFITS, source.outfit) || OUTFITS[0];
  return {
    skin,
    hair,
    primary: outfit.primary,
    secondary: outfit.secondary,
    boot: "#20242f",
    hairstyle: source.hairstyle || "short",
    accessories: source.accessories || [],
    torsoWidth: body.torsoWidth,
  };
}

// Baseline torso width ("athletic") that every rig's hand-tuned geometry
// below was drawn against. Other body types scale the whole skeleton
// uniformly from this, so a "mighty" hero reads visibly broader and a
// "lean" hero visibly slimmer without every rig needing bespoke numbers.
const BASE_TORSO_WIDTH = 42;

/**
 * BodyScale — wraps a rig's fully-drawn, connected skeleton in a single
 * uniform scale so body-type customization comes through without ever
 * moving one part independently of the others (which is what would risk
 * "disconnected" limbs). `axis` picks which dimension represents body
 * width for that rig's orientation: standing rigs scale horizontally
 * (x), rigs lying on the ground scale vertically (y, i.e. thickness).
 */
function BodyScale({ palette, axis = "x", originX = 50, originY = 90, children }) {
  const factor = palette.torsoWidth / BASE_TORSO_WIDTH;
  const sx = axis === "x" ? factor : 1;
  const sy = axis === "y" ? factor : 1;
  return (
    <g transform={`translate(${originX} ${originY}) scale(${sx} ${sy}) translate(${-originX} ${-originY})`}>
      {children}
    </g>
  );
}

/**
 * Head — draws the head plus whichever hairstyle/accessories the hero has
 * equipped (bald/short/long/mohawk/ponytail, headband, glasses), scaled
 * to whatever head box (x, y, w, h) the calling rig is using. Centralized
 * here so every pose's hair/accessories stay in sync with the character
 * customizer instead of each rig re-implementing its own subset.
 */
function Head({ x, y, w, h = w, palette }) {
  const { skin, hair, hairstyle, accessories } = palette;
  const has = (a) => accessories.includes(a);
  const bandX = x - 2;
  const bandY = y - Math.round(h * 0.18);
  const bandW = w + 4;
  const bandH = Math.max(5, Math.round(h * 0.4));

  return (
    <>
      {hairstyle === "ponytail" && (
        <rect
          x={x + w - 1}
          y={y + Math.round(h * 0.3)}
          width={Math.max(4, Math.round(w * 0.28))}
          height={Math.round(h * 1.0)}
          fill={hair}
        />
      )}
      <rect x={x} y={y} width={w} height={h} fill={skin} />
      {hairstyle !== "bald" && <rect x={bandX} y={bandY} width={bandW} height={bandH} fill={hair} />}
      {hairstyle === "long" && (
        <>
          <rect x={x - Math.round(w * 0.12)} y={y + Math.round(h * 0.25)} width={Math.max(3, Math.round(w * 0.2))} height={Math.round(h * 1.1)} fill={hair} />
          <rect x={x + w - Math.round(w * 0.08)} y={y + Math.round(h * 0.25)} width={Math.max(3, Math.round(w * 0.2))} height={Math.round(h * 1.1)} fill={hair} />
        </>
      )}
      {hairstyle === "mohawk" && (
        <rect
          x={x + w / 2 - Math.round(w * 0.17)}
          y={y - Math.round(h * 0.55)}
          width={Math.max(4, Math.round(w * 0.34))}
          height={Math.round(h * 0.55)}
          fill={hair}
        />
      )}
      {has("headband") && (
        <rect x={bandX} y={y + Math.round(h * 0.3)} width={bandW} height={Math.max(3, Math.round(h * 0.16))} fill="#ffd166" />
      )}
      {has("glasses") && (
        <>
          <rect x={x + Math.round(w * 0.15)} y={y + Math.round(h * 0.45)} width={Math.max(3, Math.round(w * 0.3))} height={Math.max(3, Math.round(h * 0.22))} fill="#20242f" />
          <rect x={x + w - Math.round(w * 0.45)} y={y + Math.round(h * 0.45)} width={Math.max(3, Math.round(w * 0.3))} height={Math.max(3, Math.round(h * 0.22))} fill="#20242f" />
        </>
      )}
    </>
  );
}

// Standing rigs (squat, curl, deadlift, running, idle, celebrate) all
// share this exact skeleton layout — only the motion differs — so a cape
// draws identically behind the torso in every one of them.
function Cape({ palette }) {
  if (!palette.accessories.includes("cape")) return null;
  return <rect x="24" y="42" width="52" height="76" fill={palette.secondary} opacity="0.85" />;
}

// Standing rigs' torso+neck+head, extracted into one component so every
// standing pose (squat, curl, deadlift, running, idle, celebrate) draws
// this joint from the exact same coordinates. Previously each rig repeated
// its own copy of the torso+head rects with a bare 10px vertical gap
// between the head's bottom edge and the torso's top edge and nothing
// filling it — the "head floating above the body" bug. Adding the neck
// rect here (and only here) closes that gap everywhere at once and makes
// it impossible for a rig to drift out of sync with the others.
function UpperBody({ palette }) {
  const torsoX = 32;
  const torsoY = 44;
  const torsoW = 36;
  const torsoH = 42;
  const headX = 38;
  const headY = 10;
  const headW = 24; // Head defaults h = w
  const headBottom = headY + headW;
  const neckW = 10;
  const neckX = torsoX + torsoW / 2 - neckW / 2;

  return (
    <>
      {/* neck — bridges the head's bottom edge to the torso's top edge so
          they read as one connected figure instead of two floating parts */}
      <rect x={neckX} y={headBottom} width={neckW} height={torsoY - headBottom} fill={palette.skin} />
      <rect x={torsoX} y={torsoY} width={torsoW} height={torsoH} fill={palette.primary} />
      <rect x={torsoX + torsoW / 2 - 2} y={torsoY} width={4} height={torsoH} fill={palette.secondary} />
      <Head x={headX} y={headY} w={headW} palette={palette} />
    </>
  );
}

const LOOP = { duration: 1.6, repeat: Infinity, ease: "easeInOut" };
const HOLD_TIMES = [0, 0.4, 0.6, 1];

// ---- Squat --------------------------------------------------------------
// Legs compress (scaleY from the feet) while the torso sinks down and
// rises back up — the clearest, most literal read of "squat".
function SquatRig({ palette, playing }) {
  const legAnim = playing ? { scaleY: [1, 0.6, 0.6, 1] } : { scaleY: 1 };
  const torsoAnim = playing ? { y: [0, 20, 20, 0] } : { y: 0 };
  const transition = playing ? { ...LOOP, times: HOLD_TIMES } : { duration: 0.2 };
  const gloves = palette.accessories.includes("gloves");

  return (
    <svg viewBox="0 0 100 140" className="h-full w-full" role="img" aria-label="Squat animation">
      <BodyScale palette={palette} axis="x">
        <rect x="10" y="128" width="80" height="4" fill="#20242f" />

        {/* legs — scale from the feet so they compress upward into a squat */}
        <motion.g style={{ transformOrigin: "50px 128px" }} animate={legAnim} transition={transition}>
          <rect x="34" y="86" width="12" height="42" fill={palette.secondary} />
          <rect x="54" y="86" width="12" height="42" fill={palette.secondary} />
          <rect x="32" y="122" width="16" height="8" fill={palette.boot} />
          <rect x="52" y="122" width="16" height="8" fill={palette.boot} />
        </motion.g>

        {/* torso + head + arms sink down with the squat, arms reach forward for balance */}
        <motion.g animate={torsoAnim} transition={transition}>
          <Cape palette={palette} />
          <rect x="22" y="60" width="16" height="30" fill={palette.skin} />
          <rect x="62" y="60" width="16" height="30" fill={palette.skin} />
          <rect x="20" y="60" width="18" height="10" fill={palette.primary} />
          <rect x="62" y="60" width="18" height="10" fill={palette.primary} />
          {gloves && (
            <>
              <rect x="21" y="80" width="18" height="10" fill={palette.primary} />
              <rect x="61" y="80" width="18" height="10" fill={palette.primary} />
            </>
          )}

          <UpperBody palette={palette} />
        </motion.g>
      </BodyScale>
    </svg>
  );
}

// ---- Push-Up --------------------------------------------------------------
// A horizontal figure planted on hands and toes; the body lowers toward
// the floor as the forearms bend, then presses back up.
function PushUpRig({ palette, playing }) {
  const bodyAnim = playing ? { y: [0, 12, 12, 0] } : { y: 0 };
  const armAnim = playing ? { rotate: [-6, 34, 34, -6] } : { rotate: -6 };
  const transition = playing ? { ...LOOP, times: HOLD_TIMES } : { duration: 0.2 };

  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" role="img" aria-label="Push-up animation">
      <BodyScale palette={palette} axis="y" originX={80} originY={84}>
        <rect x="10" y="88" width="140" height="4" fill="#20242f" />

        {/* fixed hand + toe contact points */}
        <rect x="34" y="80" width="10" height="8" fill={palette.boot} />
        <rect x="118" y="84" width="8" height="6" fill={palette.skin} />

        {/* upper arm is fixed at the shoulder/ground contact; forearm bends at the elbow */}
        <motion.g style={{ transformOrigin: "40px 80px" }} animate={armAnim} transition={transition}>
          <rect x="36" y="46" width="9" height="34" fill={palette.skin} />
        </motion.g>

        {/* body: legs, torso, head — moves down/up as the arms bend/extend */}
        <motion.g animate={bodyAnim} transition={transition}>
          <rect x="60" y="52" width="58" height="14" fill={palette.secondary} />
          <rect x="30" y="50" width="34" height="16" fill={palette.primary} />
          <Head x={12} y={46} w={20} palette={palette} />
        </motion.g>
      </BodyScale>
    </svg>
  );
}

// ---- Bicep Curl -----------------------------------------------------------
// Standing figure, static except one arm: the forearm (with a small
// dumbbell) curls up toward the shoulder, then lowers back down.
function BicepCurlRig({ palette, playing }) {
  const curlAnim = playing ? { rotate: [8, -128, -128, 8] } : { rotate: 8 };
  const transition = playing ? { ...LOOP, times: HOLD_TIMES } : { duration: 0.2 };
  const gloves = palette.accessories.includes("gloves");

  return (
    <svg viewBox="0 0 100 140" className="h-full w-full" role="img" aria-label="Bicep curl animation">
      <BodyScale palette={palette} axis="x">
        <rect x="10" y="128" width="80" height="4" fill="#20242f" />

        {/* standing legs (static) */}
        <rect x="34" y="86" width="12" height="42" fill={palette.secondary} />
        <rect x="54" y="86" width="12" height="42" fill={palette.secondary} />
        <rect x="32" y="122" width="16" height="8" fill={palette.boot} />
        <rect x="52" y="122" width="16" height="8" fill={palette.boot} />

        <Cape palette={palette} />

        {/* static arm (non-curling side) */}
        <rect x="62" y="60" width="16" height="30" fill={palette.skin} />
        <rect x="62" y="60" width="18" height="10" fill={palette.primary} />
        {gloves && <rect x="61" y="80" width="18" height="10" fill={palette.primary} />}

        {/* torso + head (static) */}
        <UpperBody palette={palette} />

        {/* upper arm fixed at the shoulder */}
        <rect x="22" y="60" width="16" height="20" fill={palette.skin} />
        <rect x="20" y="60" width="18" height="8" fill={palette.primary} />

        {/* forearm + dumbbell curl about the elbow */}
        <motion.g style={{ transformOrigin: "30px 80px" }} animate={curlAnim} transition={transition}>
          <rect x="24" y="80" width="12" height="26" fill={palette.skin} />
          <rect x="20" y="103" width="20" height="7" fill="#8891b8" />
          {gloves && <rect x="23" y="94" width="14" height="10" fill={palette.primary} />}
        </motion.g>
      </BodyScale>
    </svg>
  );
}

// ---- Bench Press ------------------------------------------------------------
// Side view of the character lying on a bench with knees bent; the
// barbell presses up away from the chest, then lowers back down.
function BenchPressRig({ palette, playing }) {
  const pressAnim = playing ? { y: [8, -20, -20, 8] } : { y: 8 };
  const transition = playing ? { ...LOOP, times: HOLD_TIMES } : { duration: 0.2 };

  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" role="img" aria-label="Bench press animation">
      <BodyScale palette={palette} axis="y" originX={80} originY={84}>
        {/* bench */}
        <rect x="18" y="76" width="120" height="8" fill="#5c4632" />
        <rect x="26" y="84" width="6" height="10" fill="#3a2c1f" />
        <rect x="120" y="84" width="6" height="10" fill="#3a2c1f" />

        {/* bent legs, feet on the floor */}
        <rect x="112" y="54" width="14" height="22" fill={palette.secondary} />
        <rect x="120" y="40" width="14" height="18" fill={palette.secondary} />
        <rect x="128" y="34" width="10" height="8" fill={palette.boot} />

        {/* torso lying on the bench + head */}
        <rect x="46" y="58" width="66" height="18" fill={palette.primary} />
        <Head x={24} y={56} w={24} h={22} palette={palette} />

        {/* upper arms fixed at the shoulder, elbows out to the sides */}
        <rect x="52" y="40" width="10" height="20" fill={palette.skin} />
        <rect x="86" y="40" width="10" height="20" fill={palette.skin} />

        {/* forearms + barbell press straight up from the chest */}
        <motion.g animate={pressAnim} transition={transition}>
          <rect x="52" y="20" width="10" height="22" fill={palette.skin} />
          <rect x="86" y="20" width="10" height="22" fill={palette.skin} />
          <rect x="42" y="14" width="72" height="6" fill="#8891b8" />
          <rect x="38" y="12" width="6" height="10" fill="#5c6b9a" />
          <rect x="112" y="12" width="6" height="10" fill="#5c6b9a" />
        </motion.g>
      </BodyScale>
    </svg>
  );
}

// ---- Deadlift ---------------------------------------------------------
// Standing figure that hinges forward at the hips to reach a barbell, then
// drives back upright — the defining "hip hinge" of a deadlift. The arms
// and bar are drawn inside the same rotating group as the torso, so they
// naturally sweep down toward the floor as the body bends forward.
function DeadliftRig({ palette, playing }) {
  const hingeAnim = playing ? { rotate: [0, -55, -55, 0] } : { rotate: 0 };
  const transition = playing ? { ...LOOP, times: HOLD_TIMES } : { duration: 0.2 };
  const handColor = palette.accessories.includes("gloves") ? palette.primary : "#5c6b9a";

  return (
    <svg viewBox="0 0 100 140" className="h-full w-full" role="img" aria-label="Deadlift animation">
      <BodyScale palette={palette} axis="x">
        <rect x="10" y="128" width="80" height="4" fill="#20242f" />

        {/* legs stay planted, only a slight straight stance */}
        <rect x="34" y="86" width="12" height="42" fill={palette.secondary} />
        <rect x="54" y="86" width="12" height="42" fill={palette.secondary} />
        <rect x="32" y="122" width="16" height="8" fill={palette.boot} />
        <rect x="52" y="122" width="16" height="8" fill={palette.boot} />

        {/* upper body + arms + barbell hinge forward from the hips together */}
        <motion.g style={{ transformOrigin: "50px 90px" }} animate={hingeAnim} transition={transition}>
          <Cape palette={palette} />
          <rect x="30" y="60" width="10" height="55" fill={palette.skin} />
          <rect x="60" y="60" width="10" height="55" fill={palette.skin} />
          <rect x="20" y="106" width="8" height="18" fill={handColor} />
          <rect x="72" y="106" width="8" height="18" fill={handColor} />
          <rect x="24" y="112" width="52" height="6" fill="#8891b8" />

          <UpperBody palette={palette} />
        </motion.g>
      </BodyScale>
    </svg>
  );
}

// ---- Plank --------------------------------------------------------------
// Plank is an isometric hold, not a repeating rep — so instead of forcing
// a fake up/down cycle, this shows a static forearm-plank pose with a
// small, fast "hold shake" in the hips. That's the simplified-but-
// recognizable read of a static exercise: still, effortful, clearly braced.
function PlankRig({ palette, playing }) {
  const holdAnim = playing ? { y: [0, -1.5, 0, 1.5, 0] } : { y: 0 };
  const transition = playing
    ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
    : { duration: 0.2 };

  return (
    <svg viewBox="0 0 160 90" className="h-full w-full" role="img" aria-label="Plank animation">
      <BodyScale palette={palette} axis="y" originX={80} originY={78}>
        <rect x="10" y="80" width="140" height="4" fill="#20242f" />

        {/* forearm planted on the ground (elbow under the shoulder) */}
        <rect x="34" y="58" width="9" height="16" fill={palette.skin} />
        <rect x="28" y="70" width="20" height="8" fill={palette.skin} />

        {/* toes */}
        <rect x="118" y="72" width="8" height="6" fill={palette.boot} />

        {/* straight-line body: legs, torso, head — subtle hold shake only */}
        <motion.g animate={holdAnim} transition={transition}>
          <rect x="60" y="52" width="58" height="12" fill={palette.secondary} />
          <rect x="30" y="50" width="34" height="14" fill={palette.primary} />
          <Head x={12} y={46} w={20} h={18} palette={palette} />
        </motion.g>
      </BodyScale>
    </svg>
  );
}

// ---- Running --------------------------------------------------------------
// Simplified run cycle: whole-leg "scissor" swing at the hip (no separate
// knee joint) with opposite-arm swing and a quick torso bob — a common,
// legible shorthand for running in small pixel sprites.
function RunningRig({ palette, playing }) {
  const runTransition = playing
    ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
    : { duration: 0.2 };
  const bobTransition = playing
    ? { duration: 0.3, repeat: Infinity, ease: "easeInOut" }
    : { duration: 0.2 };

  const leftLeg = playing ? { rotate: [25, -30, 25] } : { rotate: 0 };
  const rightLeg = playing ? { rotate: [-30, 25, -30] } : { rotate: 0 };
  const leftArm = playing ? { rotate: [-30, 25, -30] } : { rotate: 0 };
  const rightArm = playing ? { rotate: [25, -30, 25] } : { rotate: 0 };
  const bob = playing ? { y: [0, -5, 0, -5, 0] } : { y: 0 };
  const gloves = palette.accessories.includes("gloves");

  return (
    <svg viewBox="0 0 100 140" className="h-full w-full" role="img" aria-label="Running animation">
      <BodyScale palette={palette} axis="x">
        <rect x="10" y="128" width="80" height="4" fill="#20242f" />

        {/* legs scissor from the hip */}
        <motion.g style={{ transformOrigin: "40px 90px" }} animate={leftLeg} transition={runTransition}>
          <rect x="34" y="90" width="12" height="38" fill={palette.secondary} />
          <rect x="32" y="122" width="16" height="8" fill={palette.boot} />
        </motion.g>
        <motion.g style={{ transformOrigin: "60px 90px" }} animate={rightLeg} transition={runTransition}>
          <rect x="54" y="90" width="12" height="38" fill={palette.secondary} />
          <rect x="52" y="122" width="16" height="8" fill={palette.boot} />
        </motion.g>

        {/* torso + head + arms bob and swing opposite the legs */}
        <motion.g animate={bob} transition={bobTransition}>
          <Cape palette={palette} />
          <motion.g style={{ transformOrigin: "30px 62px" }} animate={leftArm} transition={runTransition}>
            <rect x="24" y="62" width="10" height="26" fill={palette.skin} />
            {gloves && <rect x="23" y="80" width="12" height="8" fill={palette.primary} />}
          </motion.g>
          <motion.g style={{ transformOrigin: "70px 62px" }} animate={rightArm} transition={runTransition}>
            <rect x="66" y="62" width="10" height="26" fill={palette.skin} />
            {gloves && <rect x="65" y="80" width="12" height="8" fill={palette.primary} />}
          </motion.g>

          <UpperBody palette={palette} />
        </motion.g>
      </BodyScale>
    </svg>
  );
}

// ---- Idle -----------------------------------------------------------------
// A resting stance — no exercise happening. Used before a workout starts
// and between exercises, so the hero looks alive on the dashboard rather
// than frozen.
function IdleRig({ palette, playing }) {
  const breatheAnim = playing ? { y: [0, -3, 0] } : { y: 0 };
  const transition = playing
    ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
    : { duration: 0.2 };
  const gloves = palette.accessories.includes("gloves");

  return (
    <svg viewBox="0 0 100 140" className="h-full w-full" role="img" aria-label="Idle animation">
      <BodyScale palette={palette} axis="x">
        <rect x="10" y="128" width="80" height="4" fill="#20242f" />

        <rect x="34" y="86" width="12" height="42" fill={palette.secondary} />
        <rect x="54" y="86" width="12" height="42" fill={palette.secondary} />
        <rect x="32" y="122" width="16" height="8" fill={palette.boot} />
        <rect x="52" y="122" width="16" height="8" fill={palette.boot} />

        <motion.g animate={breatheAnim} transition={transition}>
          <Cape palette={palette} />
          <rect x="22" y="60" width="16" height="30" fill={palette.skin} />
          <rect x="62" y="60" width="16" height="30" fill={palette.skin} />
          <rect x="20" y="60" width="18" height="10" fill={palette.primary} />
          <rect x="62" y="60" width="18" height="10" fill={palette.primary} />
          {gloves && (
            <>
              <rect x="21" y="80" width="18" height="10" fill={palette.primary} />
              <rect x="61" y="80" width="18" height="10" fill={palette.primary} />
            </>
          )}

          <UpperBody palette={palette} />
        </motion.g>
      </BodyScale>
    </svg>
  );
}

// ---- Celebrate --------------------------------------------------------
// A short "set complete!" celebration: a little hop with both arms
// thrown up overhead, looping a couple of times before settling.
function CelebrateRig({ palette, playing }) {
  const jumpAnim = playing ? { y: [0, -16, 0, -12, 0] } : { y: 0 };
  const leftArmAnim = playing ? { rotate: [10, -168, -168, 10] } : { rotate: 10 };
  const rightArmAnim = playing ? { rotate: [-10, 168, 168, -10] } : { rotate: -10 };
  const transition = playing
    ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
    : { duration: 0.2 };
  const gloves = palette.accessories.includes("gloves");

  return (
    <svg viewBox="0 0 100 140" className="h-full w-full" role="img" aria-label="Celebration animation">
      <BodyScale palette={palette} axis="x">
        <rect x="10" y="128" width="80" height="4" fill="#20242f" />

        <motion.g animate={jumpAnim} transition={transition}>
          <rect x="34" y="86" width="12" height="42" fill={palette.secondary} />
          <rect x="54" y="86" width="12" height="42" fill={palette.secondary} />
          <rect x="32" y="122" width="16" height="8" fill={palette.boot} />
          <rect x="52" y="122" width="16" height="8" fill={palette.boot} />

          <Cape palette={palette} />

          <motion.g style={{ transformOrigin: "30px 60px" }} animate={leftArmAnim} transition={transition}>
            <rect x="22" y="60" width="16" height="30" fill={palette.skin} />
            <rect x="20" y="60" width="18" height="10" fill={palette.primary} />
            {gloves && <rect x="21" y="80" width="18" height="10" fill={palette.primary} />}
          </motion.g>
          <motion.g style={{ transformOrigin: "70px 60px" }} animate={rightArmAnim} transition={transition}>
            <rect x="62" y="60" width="16" height="30" fill={palette.skin} />
            <rect x="62" y="60" width="18" height="10" fill={palette.primary} />
            {gloves && <rect x="61" y="80" width="18" height="10" fill={palette.primary} />}
          </motion.g>

          <UpperBody palette={palette} />
        </motion.g>
      </BodyScale>
    </svg>
  );
}

const RIGS = {
  squat: SquatRig,
  pushup: PushUpRig,
  "bicep-curl": BicepCurlRig,
  "bench-press": BenchPressRig,
  deadlift: DeadliftRig,
  plank: PlankRig,
  running: RunningRig,
  idle: IdleRig,
  celebrate: CelebrateRig,
};

/**
 * ExerciseAnimation — renders the player's actual customized pixel-art
 * hero performing one of the supported exercises (or resting/celebrating).
 *
 * Props:
 *  - exercise: "squat" | "pushup" | "bicep-curl" | "bench-press" |
 *      "deadlift" | "plank" | "running" | "idle" | "celebrate"
 *  - character: the hero's saved customization data
 *      ({ bodyType, skinTone, hairColor, hairstyle, outfit, accessories })
 *      — the same shape used by CharacterPreview/CharacterCreate, so the
 *        rig matches the player's actual hero, not a generic stand-in.
 *  - isPlaying: whether the rep loop animates (default true). When false,
 *      the rig holds a neutral resting frame — useful if a parent wants to
 *      pause the demo without unmounting it.
 *  - className: sizing/positioning is left to the caller.
 */
export default function ExerciseAnimation({ exercise, character, isPlaying = true, className = "" }) {
  const palette = usePalette(character);
  const Rig = RIGS[exercise];

  if (!Rig) {
    if (import.meta.env.DEV) {
      console.warn(
        `ExerciseAnimation: unsupported exercise "${exercise}". Supported: ${[...EXERCISE_KEYS, IDLE_POSE, CELEBRATE_POSE].join(", ")}`
      );
    }
    return null;
  }

  return (
    <div className={className}>
      <Rig palette={palette} playing={isPlaying} />
    </div>
  );
}
