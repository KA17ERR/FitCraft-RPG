import { motion } from "framer-motion";

const BOTTLE_W = 80;
const BOTTLE_H = 140;
const NECK_W = 26;
const NECK_H = 14;
const BODY_Y = NECK_H + 6;
const BODY_H = BOTTLE_H - BODY_Y - 4;
const BODY_X = 4;
const BODY_W = BOTTLE_W - BODY_X * 2;

/**
 * WaterBottle — original pixel-art bottle sprite. `percent` (0-100) drives
 * an animated water fill rising from the base. Purely presentational, no
 * data logic — the parent screen owns the actual ml counters.
 */
export default function WaterBottle({ percent = 0, className = "" }) {
  const pct = Math.max(0, Math.min(100, percent));
  const fillH = (BODY_H - 6) * (pct / 100);
  const fillY = BODY_Y + 3 + (BODY_H - 6 - fillH);

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${BOTTLE_W} ${BOTTLE_H}`}
        className="h-full w-full"
        shapeRendering="crispEdges"
        role="img"
        aria-label={`Water bottle ${Math.round(pct)}% full`}
      >
        {/* cap */}
        <rect x={BOTTLE_W / 2 - NECK_W / 2 - 2} y={0} width={NECK_W + 4} height={6} fill="#6c7cc0" />
        {/* neck */}
        <rect x={BOTTLE_W / 2 - NECK_W / 2} y={6} width={NECK_W} height={NECK_H} fill="#2a3660" stroke="#3f4d81" />

        {/* bottle outline / glass */}
        <rect x={BODY_X} y={BODY_Y} width={BODY_W} height={BODY_H} fill="#16213e" stroke="#3f4d81" strokeWidth="3" />

        {/* animated water fill, clipped to the bottle body */}
        <clipPath id="bottleClip">
          <rect x={BODY_X + 3} y={BODY_Y + 3} width={BODY_W - 6} height={BODY_H - 6} />
        </clipPath>
        <g clipPath="url(#bottleClip)">
          <motion.rect
            x={BODY_X + 3}
            width={BODY_W - 6}
            fill="#38bdf8"
            initial={false}
            animate={{ y: fillY, height: Math.max(fillH, 0) }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.rect
            x={BODY_X + 3}
            width={BODY_W - 6}
            height={4}
            fill="#7dd3fc"
            initial={false}
            animate={{ y: fillY }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </g>

        {/* measurement notches */}
        <rect x={BODY_X - 2} y={BODY_Y + BODY_H * 0.25} width={4} height={2} fill="#3f4d81" />
        <rect x={BODY_X - 2} y={BODY_Y + BODY_H * 0.5} width={4} height={2} fill="#3f4d81" />
        <rect x={BODY_X - 2} y={BODY_Y + BODY_H * 0.75} width={4} height={2} fill="#3f4d81" />

        {/* glass highlight */}
        <rect x={BODY_X + 4} y={BODY_Y + 4} width={4} height={BODY_H - 8} fill="#ffffff" opacity="0.08" />
      </svg>
    </div>
  );
}
