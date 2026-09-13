import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PixelCard from "./PixelCard";
import PixelButton from "./PixelButton";
import ExerciseCharacter from "./ExerciseCharacter";
import { TrophyIcon, StarIcon, XPIcon, CoinIcon } from "./icons/PixelIcons";

const BURST_ICONS = [StarIcon, StarIcon, StarIcon, StarIcon, StarIcon, StarIcon];

/**
 * QuestCompleteModal — reusable "exercise complete" celebration overlay.
 *
 * Controlled component (isOpen/onClose), same shape as LevelUpModal, but
 * tuned for the everyday "you just finished a set" moment rather than a
 * rare milestone: a trophy + star burst, a cheering character, and the
 * XP/coin reward lines popping in. Meant to be mounted once per screen and
 * reused for every exercise completion (pass in that exercise's own
 * name/xp/coins each time).
 *
 * Auto-dismisses after `autoCloseMs` (pass 0 to disable) but can always be
 * closed early via the button or by clicking the backdrop — both paths
 * just call `onClose`, so cancelling the celebration never affects the
 * exercise's completed state, which lives in the parent.
 */
export default function QuestCompleteModal({
  isOpen,
  onClose,
  title = "Quest Complete!",
  exerciseName,
  xp = 0,
  coins = 0,
  autoCloseMs = 3600,
}) {
  useEffect(() => {
    if (!isOpen || !autoCloseMs) return undefined;
    const timer = setTimeout(() => onClose?.(), autoCloseMs);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[75] flex items-center justify-center bg-black/80 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm"
          >
            {/* radiating star burst behind the card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              {BURST_ICONS.map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.4, 1, 0.4],
                    x: [0, Math.cos((i / BURST_ICONS.length) * Math.PI * 2) * 100],
                    y: [0, Math.sin((i / BURST_ICONS.length) * Math.PI * 2) * 100],
                  }}
                  transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.3, ease: "easeOut" }}
                  className="absolute text-gold"
                >
                  <Icon size={14} />
                </motion.div>
              ))}
            </div>

            <PixelCard variant="accent" className="relative text-center pixel-scanlines">
              {/* character celebration */}
              <div className="mx-auto mb-1 h-24 w-20">
                <ExerciseCharacter celebrate className="h-full w-full" />
              </div>

              <motion.div
                initial={{ scale: 0.6, rotate: -8 }}
                animate={{ scale: [1, 1.1, 1], rotate: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mx-auto mb-3 flex h-14 w-14 items-center justify-center border-4 border-accent-light bg-ink pixel-corners"
              >
                <TrophyIcon size={28} />
              </motion.div>

              <p className="pixel-text-shadow font-heading text-lg uppercase text-accent-light sm:text-xl">
                {title}
              </p>
              {exerciseName && <p className="mt-1 truncate text-sm text-muted">{exerciseName}</p>}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                {xp > 0 && (
                  <motion.span
                    initial={{ opacity: 0, y: 8, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 400, damping: 18 }}
                    className="flex items-center gap-1.5 font-heading text-sm text-xp-light"
                  >
                    <XPIcon size={18} />+{xp} XP
                  </motion.span>
                )}
                {coins > 0 && (
                  <motion.span
                    initial={{ opacity: 0, y: 8, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 18 }}
                    className="flex items-center gap-1.5 font-heading text-sm text-gold"
                  >
                    <CoinIcon size={18} />+{coins} COINS
                  </motion.span>
                )}
              </div>

              <div className="mt-5">
                <PixelButton variant="primary" onClick={onClose}>
                  Nice!
                </PixelButton>
              </div>
            </PixelCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
