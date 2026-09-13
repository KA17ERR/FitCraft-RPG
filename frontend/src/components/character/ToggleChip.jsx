import { motion } from "framer-motion";
import { cx } from "../../utils/cx";
import { CheckIcon } from "../icons/PixelIcons";

/**
 * ToggleChip — a small pixel-cornered chip that toggles on/off
 * independently of its siblings (unlike OptionCard's single-select radio
 * behavior). Used for accessories, where a hero can wear any combination.
 */
export default function ToggleChip({ icon, label, selected = false, onToggle }) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.1 }}
      className={cx(
        "pixel-corners-sm flex items-center gap-1.5 border-2 px-2.5 py-1.5 font-heading text-[9px] uppercase tracking-widest transition-colors",
        selected
          ? "border-accent bg-accent/20 text-accent-light"
          : "border-border bg-panel text-muted hover:border-border-light hover:text-[#fffffe]"
      )}
    >
      {selected ? <CheckIcon size={12} /> : icon}
      {label}
    </motion.button>
  );
}
