import { AnimatePresence, motion } from "framer-motion";
import PixelCard from "./PixelCard";
import PixelButton from "./PixelButton";
import { LevelUpIcon, StarIcon } from "./icons/PixelIcons";

const BURST_ICONS = [StarIcon, StarIcon, StarIcon, StarIcon];

/**
 * LevelUpModal — full-screen celebration overlay for the "you leveled up /
 * hit a milestone" moment. Controlled component, mirrors Modal's isOpen/
 * onClose API but with its own bigger, game-ier animation since this is
 * meant to be a rare, high-impact moment rather than routine chrome.
 */
export default function LevelUpModal({ isOpen, onClose, level, title = "Level Up!", description }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-4"
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
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {BURST_ICONS.map((Icon, i) => (
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
                  className="absolute text-xp"
                >
                  <Icon size={16} />
                </motion.div>
              ))}
            </div>

            <PixelCard variant="accent" className="relative text-center pixel-scanlines">
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, -4, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-3 flex h-16 w-16 items-center justify-center border-4 border-accent-light bg-ink pixel-corners"
              >
                <LevelUpIcon size={32} />
              </motion.div>

              <p className="pixel-text-shadow font-heading text-lg uppercase text-accent-light sm:text-xl">
                {title}
              </p>
              {level != null && (
                <p className="pixel-text-shadow mt-1 font-heading text-2xl text-[#fffffe]">Lv. {level}</p>
              )}
              {description && <p className="mt-3 text-sm leading-snug text-muted">{description}</p>}

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
