import { motion, AnimatePresence } from "framer-motion";
import { CoinIcon, XPIcon } from "./icons/PixelIcons";
import { cx } from "../utils/cx";

const STYLES = {
  xp: "text-xp-light",
  coin: "text-gold",
};

const ICONS = {
  xp: XPIcon,
  coin: CoinIcon,
};

/**
 * FloatingReward — a "+50" (xp) or "+20" (coin) label that pops up and
 * floats away. Render it absolutely-positioned inside a `relative`
 * container and toggle `show` (e.g. right after a quest completes); it
 * unmounts itself once the float-up animation finishes.
 */
export default function FloatingReward({ show, amount, type = "xp", className = "" }) {
  const Icon = ICONS[type];
  return (
    <AnimatePresence>
      {show && amount > 0 && (
        <motion.span
          key={`${type}-${amount}-${show}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: -22 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cx(
            "pointer-events-none absolute flex items-center gap-1 font-heading text-xs drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]",
            STYLES[type],
            className
          )}
        >
          <Icon size={14} />+{amount}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
