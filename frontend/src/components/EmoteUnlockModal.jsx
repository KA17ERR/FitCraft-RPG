import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PixelCard from "./PixelCard";
import PixelButton from "./PixelButton";
import ExerciseCharacter from "./ExerciseCharacter";
import { StarIcon } from "./icons/PixelIcons";

const BURST_ICONS = [StarIcon, StarIcon, StarIcon, StarIcon];

/**
 * EmoteUnlockModal — reusable "new emote unlocked" celebration overlay.
 *
 * Controlled component (isOpen/onClose), same family as LevelUpModal and
 * QuestCompleteModal: a small star burst, the character playing back the
 * newly-unlocked emote's own `pose`, its name, and its icon badge. Pass
 * the emote object itself (`{ id, name, icon, pose }`) as `emote`.
 *
 * Auto-dismisses after `autoCloseMs` (pass 0 to disable) but can also be
 * closed early via the button or backdrop click.
 */
export default function EmoteUnlockModal({ isOpen, onClose, emote, autoCloseMs = 3200 }) {
  useEffect(() => {
    if (!isOpen || !autoCloseMs) return undefined;
    const timer = setTimeout(() => onClose?.(), autoCloseMs);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, onClose]);

  const Icon = emote?.icon;

  return (
    <AnimatePresence>
      {isOpen && emote && (
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
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              {BURST_ICONS.map((BurstIcon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.4, 1, 0.4],
                    x: [0, Math.cos((i / BURST_ICONS.length) * Math.PI * 2) * 90],
                    y: [0, Math.sin((i / BURST_ICONS.length) * Math.PI * 2) * 90],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.4, ease: "easeOut" }}
                  className="absolute text-accent-light"
                >
                  <BurstIcon size={14} />
                </motion.div>
              ))}
            </div>

            <PixelCard variant="accent" className="relative text-center pixel-scanlines">
              {/* the newly-unlocked emote, performed live by the shared character */}
              <div className="mx-auto mb-2 h-24 w-20">
                <ExerciseCharacter pose={emote.pose} className="h-full w-full" />
              </div>

              <p className="pixel-text-shadow font-heading text-lg uppercase text-accent-light sm:text-xl">
                New Emote Unlocked!
              </p>

              <div className="mx-auto mt-3 flex w-fit items-center gap-2 border-2 border-border bg-ink px-3 py-1.5 pixel-corners-sm">
                {Icon && <Icon size={18} />}
                <span className="font-heading text-xs uppercase tracking-widest text-[#fffffe]">
                  {emote.name}
                </span>
              </div>

              <p className="mt-3 text-sm text-muted">Find it any time in your Emotes.</p>

              <div className="mt-5">
                <PixelButton variant="primary" onClick={onClose}>
                  Sweet!
                </PixelButton>
              </div>
            </PixelCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
