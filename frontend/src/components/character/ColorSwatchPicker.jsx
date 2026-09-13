import { motion } from "framer-motion";
import { cx } from "../../utils/cx";
import { CheckIcon } from "../icons/PixelIcons";

/**
 * ColorSwatchPicker — a row of pixel-cornered color swatches used for
 * skin tone and hair color. Same controlled radio-like pattern as
 * OptionCard, just compact enough to lay out several per row.
 */
export default function ColorSwatchPicker({ label, options, value, onSelect, error }) {
  return (
    <div>
      <span className="mb-2 block font-heading text-[10px] uppercase tracking-widest text-muted">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={opt.value}
              onClick={() => onSelect(opt.value)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.1 }}
              className={cx(
                "pixel-corners-sm flex h-10 w-10 items-center justify-center border-2 transition-shadow",
                selected ? "border-accent-light ring-2 ring-accent ring-offset-2 ring-offset-panel" : "border-border"
              )}
              style={{ backgroundColor: opt.hex }}
            >
              {selected && <CheckIcon size={16} />}
            </motion.button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-hp">{error}</p>}
    </div>
  );
}
