import { motion } from "framer-motion";
import {
  findOption,
  BODY_TYPES,
  SKIN_TONES,
  HAIR_COLORS,
  OUTFITS,
  DEFAULT_CHARACTER,
} from "../../utils/characterOptions";

// ---------------------------------------------------------------------
// Character — the ONE pixel-art hero rig used everywhere in the app:
// Character Creation preview, Dashboard, Workout Preview, and the live
// Workout screen. Every screen renders this exact same component with
// the same skeleton and the same coordinate system; only the `pose`
// prop (and the customization `data`) differ.
//
// WHY THE OLD CHARACTER FELL APART
// The previous implementation (ExerciseAnimation.jsx) drew a fresh copy
// of the head/torso/arms/legs for every single exercise, using a
// separate <svg viewBox> and hand-typed pixel coordinates each time. On
// top of that, an outer "BodyScale" wrapper applied a non-uniform SVG
// scale() to stretch the whole rig for Lean/Mighty body types, while
// each limb's rotation used a hard-coded CSS `transformOrigin: "40px
// 80px"` pixel string. CSS transform-origin for SVG elements is always
// resolved in the *root* <svg> viewBox's flat coordinate space,
// regardless of any ancestor scale/translate — so the moment a limb
// sat inside that scaled ancestor, its rotation pivot no longer lined
// up with where the limb actually was on screen. The joint would rotate
// around the wrong point and visibly rip away from the body — worse for
// Lean/Mighty than Athletic, and worse the longer a rep animation ran.
//
// THE FIX
// - One shared skeleton, defined once, in one flat coordinate system
//   (`layout` below). Body-type sizing (torso/arm width) is baked
//   directly into that layout's numbers — there is no ancestor
//   scale() anywhere in this file.
// - Every joint (hip, shoulder, elbow) is an actual anchor point in
//   that same flat coordinate system. A joint's <motion.g> always uses
//   that exact point for both where it's drawn AND its
//   `transformOrigin`, so rotating/scaling a limb can never drift from
//   its attachment point, for any body type.
// - Limbs are nested where they're physically nested (forearm is a
//   child of the upper arm, which is a child of the shoulder, which is
//   a child of the torso/spine) so moving a parent joint (e.g. the
//   torso hinging forward for a deadlift) automatically carries its
//   children with it — nothing is ever a sibling rectangle that has to
//   be manually kept in sync.
// - Every pose (idle, every exercise, celebrate) is just a set of
//   rotate/translate/scale keyframes applied to these same joints —
//   never a new rectangle layout.
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

export const IDLE_POSE = "idle";
export const CELEBRATE_POSE = "celebrate";

// ---- shared skeleton geometry ------------------------------------------
// One canvas, one set of measurements, reused for literally every pose.
const CANVAS = 200;
const CX = 100;

const HEAD_SIZE = 30;
const HEAD_Y = 20; // head top
const NECK_H = 6;
const TORSO_H = 52;
const UPPER_ARM_LEN = 24;
const FOREARM_LEN = 22;
const LEG_LEN = 50;
const FOOT_H = 8;
const LEG_GAP = 4;
const GROUND_Y = 176;

function usePalette(data) {
  const source = { ...DEFAULT_CHARACTER, ...(data || {}) };
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
    armWidth: body.armWidth,
  };
}

// Every joint anchor, derived once from body-type width — the single
// source of truth every part of the rig below draws from and rotates
// around. Nothing here depends on any outer CSS/SVG scale.
function getLayout(palette) {
  const torsoW = palette.torsoWidth;
  const armW = palette.armWidth;
  const torsoX = CX - torsoW / 2;
  const torsoY = HEAD_Y + HEAD_SIZE + NECK_H; // torso top
  const hipY = torsoY + TORSO_H; // torso bottom == hip joint == leg top
  const legW = (torsoW - LEG_GAP) / 2;
  const leftLegX = torsoX;
  const rightLegX = torsoX + legW + LEG_GAP;
  const shoulderY = torsoY + 4;
  const leftShoulderX = torsoX;
  const rightShoulderX = torsoX + torsoW;

  return {
    torsoW,
    armW,
    torsoX,
    torsoY,
    hipY,
    legW,
    leftLegX,
    rightLegX,
    leftHipX: leftLegX + legW / 2,
    rightHipX: rightLegX + legW / 2,
    shoulderY,
    leftShoulderX,
    rightShoulderX,
    elbowY: shoulderY + UPPER_ARM_LEN,
    leftElbowX: leftShoulderX - armW / 2,
    rightElbowX: rightShoulderX + armW / 2,
    headX: CX - HEAD_SIZE / 2,
    headY: HEAD_Y,
  };
}

// ---- small pure-render helpers ------------------------------------------

function Head({ x, y, palette }) {
  const w = HEAD_SIZE;
  const { skin, hair, hairstyle, accessories } = palette;
  const has = (a) => accessories.includes(a);
  const bandX = x - 1;
  const bandY = y + 6;
  const bandW = w + 2;

  return (
    <>
      {hairstyle === "ponytail" && <rect x={x + w - 2} y={y + 10} width={8} height={26} fill={hair} />}
      <rect x={x} y={y} width={w} height={w} fill={skin} />
      {hairstyle !== "bald" && <rect x={bandX} y={y - 4} width={bandW} height={12} fill={hair} />}
      {hairstyle === "long" && (
        <>
          <rect x={x - 3} y={y + 6} width={7} height={32} fill={hair} />
          <rect x={x + w - 4} y={y + 6} width={7} height={32} fill={hair} />
        </>
      )}
      {hairstyle === "mohawk" && <rect x={x + w / 2 - 5} y={y - 14} width={10} height={16} fill={hair} />}
      {has("headband") && <rect x={bandX} y={bandY} width={bandW} height={5} fill="#ffd166" />}
      {has("glasses") && (
        <>
          <rect x={x + 5} y={y + 15} width={9} height={6} fill="#20242f" />
          <rect x={x + w - 14} y={y + 15} width={9} height={6} fill="#20242f" />
          <rect x={x + 14} y={y + 17} width={4} height={2} fill="#20242f" />
        </>
      )}
    </>
  );
}

function Cape({ palette, torsoX, torsoY, torsoW }) {
  if (!palette.accessories.includes("cape")) return null;
  return <rect x={torsoX - 8} y={torsoY - 2} width={torsoW + 16} height={TORSO_H + 34} fill={palette.secondary} opacity="0.85" />;
}

// A single leg (thigh + attached foot). `origin` is the exact point this
// leg's motion pivots around (hip for a swinging leg, ankle for a
// compressing one) — always one of this rig's real joint coordinates,
// never a guessed pixel value, so it can never drift off the body.
function Leg({ x, top, w, origin, palette, animate, transition }) {
  return (
    <motion.g style={{ transformOrigin: `${origin.x}px ${origin.y}px` }} animate={animate} transition={transition}>
      <rect x={x} y={top} width={w} height={LEG_LEN} fill={palette.secondary} />
      <rect x={x - 1} y={top + LEG_LEN} width={w + 2} height={FOOT_H} fill={palette.boot} />
    </motion.g>
  );
}

// One arm: shoulder joint -> upper arm -> elbow joint (nested inside the
// shoulder group) -> forearm/hand. The elbow is a CHILD of the shoulder
// group, so bending the elbow while the shoulder also swings composes
// correctly — the forearm can never separate from the upper arm.
function Arm({ side, shoulderX, shoulderY, armW, palette, hasGloves, shoulderAnim, elbowAnim, grip }) {
  const sign = side === "left" ? -1 : 1;
  const upperX = side === "left" ? shoulderX - armW : shoulderX;
  const elbowX = shoulderX + (sign * armW) / 2;
  const elbowY = shoulderY + UPPER_ARM_LEN;
  const forearmX = elbowX - armW / 2;

  return (
    <motion.g
      style={{ transformOrigin: `${shoulderX}px ${shoulderY}px` }}
      animate={shoulderAnim.animate}
      transition={shoulderAnim.transition}
    >
      <rect x={upperX} y={shoulderY} width={armW} height={UPPER_ARM_LEN} fill={palette.skin} />
      <rect x={upperX} y={shoulderY} width={armW} height={10} fill={palette.secondary} />

      <motion.g
        style={{ transformOrigin: `${elbowX}px ${elbowY}px` }}
        animate={elbowAnim.animate}
        transition={elbowAnim.transition}
      >
        <rect x={forearmX} y={elbowY} width={armW} height={FOREARM_LEN} fill={palette.skin} />
        {hasGloves && (
          <rect x={forearmX - 1} y={elbowY + FOREARM_LEN - 10} width={armW + 2} height={10} fill={palette.primary} />
        )}
        {grip && (
          <rect x={forearmX - 2} y={elbowY + FOREARM_LEN - 4} width={armW + 4} height={8} fill="#8891b8" />
        )}
      </motion.g>
    </motion.g>
  );
}

// ---- animation helpers ---------------------------------------------------
// Every pose is expressed with these two tiny helpers so the same
// component tree above is reused for idle, every exercise, and celebrate
// — only the numbers passed in change.
function kf(playing, active, rest) {
  return playing ? active : rest;
}
function still(value = 0) {
  return { animate: { rotate: value }, transition: { duration: 0.2 } };
}
const LOOP = { duration: 1.6, repeat: Infinity, ease: "easeInOut" };
const HOLD_TIMES = [0, 0.4, 0.6, 1];

const SQUAT_SCALE = 0.62;
const SQUAT_DROP = LEG_LEN * (1 - SQUAT_SCALE);

/**
 * Character — renders the hero defined by `data` in the given `pose`.
 *
 * Props:
 *  - data: { bodyType, skinTone, hairColor, hairstyle, outfit, accessories }
 *  - pose: "idle" | "celebrate" | any EXERCISE_KEYS entry
 *  - playing: whether the pose's rep/loop animation runs (default true).
 *      When false the rig holds a neutral resting frame for that pose.
 *  - className: sizing/positioning is left to the caller.
 */
export default function Character({ data, pose = IDLE_POSE, playing = true, className = "" }) {
  const palette = usePalette(data);
  const layout = getLayout(palette);
  const gloves = palette.accessories.includes("gloves");
  const {
    torsoW,
    armW,
    torsoX,
    torsoY,
    hipY,
    legW,
    leftLegX,
    rightLegX,
    leftHipX,
    rightHipX,
    shoulderY,
    leftShoulderX,
    rightShoulderX,
    headX,
    headY,
  } = layout;

  const lying = pose === "pushup" || pose === "bench-press" || pose === "plank";
  // Orientation only — every pose reuses the exact same standing
  // skeleton; "lying" poses simply tilt the whole rig -90° around the
  // hip joint. Because the hip is fixed at (CX, hipY), the character
  // ends up lying flat, centered, with no repositioning math needed.
  const rootRotate = lying ? -90 : 0;

  // ---- per-pose joint keyframes ----
  let spineAnim = { animate: { y: 0, rotate: 0 }, transition: { duration: 0.2 } };
  let leftLegAnim = still(0);
  let rightLegAnim = still(0);
  let leftLegOrigin = { x: leftHipX, y: hipY };
  let rightLegOrigin = { x: rightHipX, y: hipY };
  let leftShoulderAnim = still(0);
  let rightShoulderAnim = still(0);
  let leftElbowAnim = still(0);
  let rightElbowAnim = still(0);
  let extraProps = null;
  // Whole-body vertical travel — 0 for every pose except "jump", where
  // the entire rig (legs included) actually leaves the ground instead of
  // just the upper body bobbing. Applied on the same root group that
  // already carries the lying/standing rotate, so it composes with that
  // for free instead of needing a second wrapping group.
  let rootYAnim = { animate: { y: 0 }, transition: { duration: 0.2 } };

  if (pose === "idle") {
    spineAnim = {
      animate: { y: kf(playing, [0, -3, 0], 0) },
      transition: playing ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 },
    };
  } else if (pose === "squat") {
    const t = playing ? { ...LOOP, times: HOLD_TIMES } : { duration: 0.2 };
    spineAnim = { animate: { y: kf(playing, [0, SQUAT_DROP, SQUAT_DROP, 0], 0) }, transition: t };
    leftLegOrigin = { x: leftHipX, y: hipY + LEG_LEN };
    rightLegOrigin = { x: rightHipX, y: hipY + LEG_LEN };
    leftLegAnim = { animate: { scaleY: kf(playing, [1, SQUAT_SCALE, SQUAT_SCALE, 1], 1) }, transition: t };
    rightLegAnim = { animate: { scaleY: kf(playing, [1, SQUAT_SCALE, SQUAT_SCALE, 1], 1) }, transition: t };
    leftShoulderAnim = { animate: { rotate: kf(playing, [0, -55, -55, 0], 0) }, transition: t };
    rightShoulderAnim = { animate: { rotate: kf(playing, [0, -55, -55, 0], 0) }, transition: t };
  } else if (pose === "bicep-curl") {
    const t = playing ? { ...LOOP, times: HOLD_TIMES } : { duration: 0.2 };
    leftShoulderAnim = still(-6);
    leftElbowAnim = { animate: { rotate: kf(playing, [10, -130, -130, 10], 10) }, transition: t };
    rightShoulderAnim = still(6);
  } else if (pose === "deadlift") {
    const t = playing ? { ...LOOP, times: HOLD_TIMES } : { duration: 0.2 };
    spineAnim = { animate: { rotate: kf(playing, [0, -50, -50, 0], 0) }, transition: t };
    leftShoulderAnim = still(4);
    rightShoulderAnim = still(-4);
    extraProps = { grip: true };
  } else if (pose === "running") {
    const t = playing ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 };
    spineAnim = {
      animate: { y: kf(playing, [0, -5, 0, -5, 0], 0) },
      transition: playing ? { duration: 0.3, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 },
    };
    leftLegAnim = { animate: { rotate: kf(playing, [25, -30, 25], 0) }, transition: t };
    rightLegAnim = { animate: { rotate: kf(playing, [-30, 25, -30], 0) }, transition: t };
    leftShoulderAnim = { animate: { rotate: kf(playing, [-30, 25, -30], 0) }, transition: t };
    rightShoulderAnim = { animate: { rotate: kf(playing, [25, -30, 25], 0) }, transition: t };
  } else if (pose === "celebrate") {
    const t = playing ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 };
    spineAnim = { animate: { y: kf(playing, [0, -16, 0, -12, 0], 0) }, transition: t };
    leftShoulderAnim = { animate: { rotate: kf(playing, [10, -168, -168, 10], 10) }, transition: t };
    rightShoulderAnim = { animate: { rotate: kf(playing, [-10, 168, 168, -10], -10) }, transition: t };
  } else if (pose === "pushup") {
    const t = playing ? { ...LOOP, times: HOLD_TIMES } : { duration: 0.2 };
    // The rig is authored standing up, then the whole root group is
    // tilted -90° to lie flat (see `rootRotate` above). A nested
    // <motion.g>'s own translate is resolved in that same pre-rotation
    // coordinate space before the root's rotation is applied on top of
    // it — so a translate along this group's local "y" (which reads as
    // vertical when standing) ends up rotated 90° and reads as a
    // horizontal slide once lying down. To make the chest actually
    // travel toward/away from the floor while lying (not slide
    // lengthwise), the lowering motion here animates local "x", which
    // the root's -90° rotation turns into true screen-vertical travel.
    spineAnim = { animate: { x: kf(playing, [0, -14, -14, 0], 0) }, transition: t };
    leftShoulderAnim = still(85);
    rightShoulderAnim = still(-85);
    leftElbowAnim = { animate: { rotate: kf(playing, [0, 55, 55, 0], 0) }, transition: t };
    rightElbowAnim = { animate: { rotate: kf(playing, [0, -55, -55, 0], 0) }, transition: t };
    leftLegAnim = still(0);
    rightLegAnim = still(0);
  } else if (pose === "bench-press") {
    const t = playing ? { ...LOOP, times: HOLD_TIMES } : { duration: 0.2 };
    leftShoulderAnim = still(88);
    rightShoulderAnim = still(-88);
    leftElbowAnim = { animate: { rotate: kf(playing, [90, 5, 5, 90], 90) }, transition: t };
    rightElbowAnim = { animate: { rotate: kf(playing, [-90, -5, -5, -90], -90) }, transition: t };
    leftLegAnim = still(-115);
    rightLegAnim = still(115);
    extraProps = { grip: true };
  } else if (pose === "plank") {
    const t = playing ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 };
    // Same local-x-becomes-screen-vertical reasoning as the push-up
    // above: a tiny hip sag/rise while holding the plank, resolved so
    // it reads as up/down rather than a lengthwise slide.
    spineAnim = { animate: { x: kf(playing, [0, 1.5, 0, -1.5, 0], 0) }, transition: t };
    leftShoulderAnim = still(88);
    rightShoulderAnim = still(-88);
    leftElbowAnim = still(90);
    rightElbowAnim = still(-90);
    leftLegAnim = still(0);
    rightLegAnim = still(0);
  } else if (pose === "thumbs-up") {
    // One arm swings up from the shoulder until it's pointing straight
    // overhead, elbow held nearly straight — the clearest "thumbs up!"
    // read this rig's blocky joints can give. The other arm stays put.
    const t = playing ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 };
    spineAnim = { animate: { y: kf(playing, [0, -2, 0], 0) }, transition: t };
    leftShoulderAnim = still(6);
    rightShoulderAnim = { animate: { rotate: kf(playing, [20, -155, -155, 20], -155) }, transition: { ...t, times: HOLD_TIMES } };
    rightElbowAnim = { animate: { rotate: kf(playing, [0, -15, -15, 0], -15) }, transition: { ...t, times: HOLD_TIMES } };
  } else if (pose === "flex") {
    // Both forearms curl in toward the shoulders, upper arms held close
    // to the body — a tight double-bicep-curl silhouette, distinct from
    // Muscle Pose's arms-out-to-the-sides stance below.
    const t = playing ? { ...LOOP, times: HOLD_TIMES } : { duration: 0.2 };
    spineAnim = { animate: { scale: kf(playing, [1, 1.05, 1.05, 1], 1) }, transition: t };
    leftShoulderAnim = still(-10);
    rightShoulderAnim = still(10);
    leftElbowAnim = { animate: { rotate: kf(playing, [10, -125, -125, 10], -125) }, transition: t };
    rightElbowAnim = { animate: { rotate: kf(playing, [-10, 125, 125, -10], 125) }, transition: t };
  } else if (pose === "victory") {
    // Both arms raised in a narrower overhead "V", held mostly still —
    // a triumphant stance rather than Celebration's big energetic hop.
    const t = playing ? { duration: 1.3, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 };
    spineAnim = { animate: { y: kf(playing, [0, -3, 0], 0) }, transition: t };
    leftShoulderAnim = { animate: { rotate: kf(playing, [10, -135, -135, 10], -135) }, transition: { ...t, times: HOLD_TIMES } };
    rightShoulderAnim = { animate: { rotate: kf(playing, [-10, 135, 135, -10], 135) }, transition: { ...t, times: HOLD_TIMES } };
  } else if (pose === "muscle-pose") {
    // Classic double-biceps bodybuilder stance: elbows out to the sides
    // at shoulder height, forearms bent up, torso puffed with a slow
    // pump. Sharing the bench-press-style "arms out" shoulder angle but
    // with the forearms driven up instead of straight, so it reads as a
    // flex rather than a lying press.
    const t = playing ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 };
    spineAnim = { animate: { scale: kf(playing, [1, 1.1, 1], 1) }, transition: t };
    leftShoulderAnim = still(-88);
    rightShoulderAnim = still(88);
    leftElbowAnim = { animate: { rotate: kf(playing, [-95, -80, -95], -90) }, transition: t };
    rightElbowAnim = { animate: { rotate: kf(playing, [95, 80, 95], 90) }, transition: t };
  } else if (pose === "jump") {
    // A real jump: the whole rig (legs included) leaves the ground via
    // rootYAnim, knees tuck up mid-air, and the arms swing up for
    // momentum — not just the upper body bobbing in place.
    const t = playing ? { duration: 0.7, repeat: Infinity, ease: "easeOut" } : { duration: 0.2 };
    rootYAnim = { animate: { y: kf(playing, [0, -34, 0], 0) }, transition: t };
    leftLegAnim = { animate: { rotate: kf(playing, [0, 32, 0], 0) }, transition: t };
    rightLegAnim = { animate: { rotate: kf(playing, [0, 32, 0], 0) }, transition: t };
    leftShoulderAnim = { animate: { rotate: kf(playing, [10, -70, 10], 10) }, transition: t };
    rightShoulderAnim = { animate: { rotate: kf(playing, [-10, 70, -10], -10) }, transition: t };
  } else if (pose === "happy-dance") {
    // A side-to-side two-step: legs kick out in alternating directions,
    // arms pump opposite the legs, hips sway — a distinctly different
    // rhythm/shape from Running's forward sprint lean.
    const t = playing ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 };
    spineAnim = {
      animate: { y: kf(playing, [0, -6, 0, -6, 0], 0), rotate: kf(playing, [-5, 5, -5, 5, -5], 0) },
      transition: playing ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 },
    };
    leftLegAnim = { animate: { rotate: kf(playing, [18, -18, 18], 0) }, transition: t };
    rightLegAnim = { animate: { rotate: kf(playing, [-18, 18, -18], 0) }, transition: t };
    leftShoulderAnim = { animate: { rotate: kf(playing, [-35, 35, -35], 0) }, transition: t };
    rightShoulderAnim = { animate: { rotate: kf(playing, [35, -35, 35], 0) }, transition: t };
  }

  return (
    <svg viewBox={`0 0 ${CANVAS} ${CANVAS}`} className={className} role="img" aria-label={`Character — ${pose}`}>
      <rect x={CANVAS / 2 - 45} y={GROUND_Y} width={90} height={4} fill="#20242f" opacity={lying ? 0 : 1} />

      <motion.g
        style={{ transformOrigin: `${CX}px ${hipY}px` }}
        animate={{ rotate: rootRotate, y: rootYAnim.animate.y }}
        transition={{ rotate: { duration: 0.3 }, y: rootYAnim.transition }}
      >
        <Leg
          x={leftLegX}
          top={hipY}
          w={legW}
          origin={leftLegOrigin}
          palette={palette}
          animate={leftLegAnim.animate}
          transition={leftLegAnim.transition}
        />
        <Leg
          x={rightLegX}
          top={hipY}
          w={legW}
          origin={rightLegOrigin}
          palette={palette}
          animate={rightLegAnim.animate}
          transition={rightLegAnim.transition}
        />

        {/* Spine: torso + neck + head + both arms, all one connected
            group anchored at the hip so a hinge (deadlift) or a sink
            (squat) or a bob (idle/running) carries every part above
            the waist together — never independently. */}
        <motion.g
          style={{ transformOrigin: `${CX}px ${hipY}px` }}
          animate={spineAnim.animate}
          transition={spineAnim.transition}
        >
          <Cape palette={palette} torsoX={torsoX} torsoY={torsoY} torsoW={torsoW} />

          <Arm
            side="left"
            shoulderX={leftShoulderX}
            shoulderY={shoulderY}
            armW={armW}
            palette={palette}
            hasGloves={gloves}
            shoulderAnim={leftShoulderAnim}
            elbowAnim={leftElbowAnim}
            grip={Boolean(extraProps?.grip)}
          />
          <Arm
            side="right"
            shoulderX={rightShoulderX}
            shoulderY={shoulderY}
            armW={armW}
            palette={palette}
            hasGloves={gloves}
            shoulderAnim={rightShoulderAnim}
            elbowAnim={rightElbowAnim}
            grip={Boolean(extraProps?.grip)}
          />

          {/* neck bridges the head's bottom edge to the torso's top
              edge — always the same two numbers, so they can never
              drift apart into a floating head. */}
          <rect x={CX - 5} y={headY + HEAD_SIZE} width={10} height={torsoY - (headY + HEAD_SIZE)} fill={palette.skin} />
          <rect x={torsoX} y={torsoY} width={torsoW} height={TORSO_H} fill={palette.primary} />
          <rect x={CX - 2} y={torsoY} width={4} height={TORSO_H} fill={palette.secondary} />
          <Head x={headX} y={headY} palette={palette} />
        </motion.g>
      </motion.g>
    </svg>
  );
}
