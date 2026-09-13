import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cx } from "../utils/cx";
import { XPIcon } from "./icons/PixelIcons";

/**
 * XPBar — shows current level plus a segmented, animated progress fill
 * toward the next level. Pass either `percent` directly, or `currentXP` +
 * `xpToNextLevel` and the percent is derived for you.
 */
export default function XPBar({
  level = 1,
  currentXP = 0,
  xpToNextLevel = 100,
  percent,
  segments = 10,
  className = "",
}) {
  const pct =
    percent !== undefined
      ? Math.min(100, Math.max(0, percent))
      : Math.min(100, Math.max(0, (currentXP / xpToNextLevel) * 100));

  const isFull = pct >= 100;

  // Briefly highlight the bar whenever it gains progress, so an XP reward
  // reads as a moment rather than a silent width change.
  const [justGained, setJustGained] = useState(false);
  const prevPct = useRef(pct);
  useEffect(() => {
    if (pct > prevPct.current) {
      setJustGained(true);
      const t = setTimeout(() => setJustGained(false), 700);
      prevPct.current = pct;
      return () => clearTimeout(t);
    }
    prevPct.current = pct;
    return undefined;
  }, [pct]);

  return (
    <div className={cx("w-full", className)}>
      <div className="mb-1.5 flex items-center justify-between font-heading text-[10px] uppercase tracking-widest text-muted">
        <span className="flex items-center gap-1.5 text-[#fffffe]">
          <XPIcon size={14} />
          Level {level}
        </span>
        {percent === undefined && (
          <motion.span
            animate={justGained ? { scale: [1, 1.15, 1], color: ["#fde047", "#fef9c3", "#8891b8"] } : {}}
            transition={{ duration: 0.6 }}
            className="tabular-nums"
          >
            {currentXP} / {xpToNextLevel} XP
          </motion.span>
        )}
      </div>

      <div
        className={cx(
          "relative h-5 w-full border-2 border-border bg-ink pixel-corners-sm transition-shadow",
          isFull && "animate-glow-pulse"
        )}
      >
        {/* fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative h-full overflow-hidden bg-gradient-to-r from-xp to-xp-light"
        >
          <div className="animate-pixel-shimmer absolute inset-0 w-1/3 skew-x-12 bg-white/25" />
        </motion.div>

        {/* pixel segment dividers */}
        <div className="pointer-events-none absolute inset-0 flex">
          {Array.from({ length: segments }).map((_, i) => (
            <div key={i} className="flex-1 border-r-2 border-ink/60 last:border-r-0" />
          ))}
        </div>
      </div>
    </div>
  );
}
