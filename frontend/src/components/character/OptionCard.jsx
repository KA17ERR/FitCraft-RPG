import { motion } from "framer-motion";
import { cx } from "../../utils/cx";
import { CheckIcon } from "../icons/PixelIcons";

/**
 * OptionCard — a selectable RPG-style card used throughout character
 * creation (fitness experience, fitness goal, and future steps like
 * class/customization picks). Behaves like a radio option: pass
 * `selected` + `onSelect`, group several under one `name` via the parent's
 * state rather than native radio inputs so the pixel styling stays fully
 * custom.
 */
export default function OptionCard({
  icon,
  title,
  description,
  selected = false,
  onSelect,
  className = "",
}) {
  return (
    <div className={cx("relative", className)}>
      <div
        aria-hidden="true"
        className={cx(
          "pixel-corners-sm absolute inset-0 translate-x-1 translate-y-1 bg-black/50",
          selected && "bg-accent-dark/60"
        )}
      />
      <motion.button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onSelect}
        whileHover={{ x: -1, y: -1 }}
        whileTap={{ x: 1, y: 1 }}
        transition={{ duration: 0.08 }}
        className={cx(
          "pixel-corners-sm relative flex w-full items-center gap-3 border-4 p-3 text-left transition-colors duration-150",
          selected
            ? "border-accent bg-accent/15"
            : "border-border bg-panel hover:bg-panel-raised hover:border-border-light"
        )}
      >
        {icon && (
          <div
            className={cx(
              "flex h-10 w-10 shrink-0 items-center justify-center border-2 pixel-corners-sm",
              selected ? "border-accent-light bg-accent/25" : "border-border bg-ink"
            )}
          >
            {icon}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p
            className={cx(
              "font-heading text-xs uppercase tracking-widest",
              selected ? "text-accent-light" : "text-[#fffffe]"
            )}
          >
            {title}
          </p>
          {description && <p className="mt-1 text-sm leading-snug text-muted">{description}</p>}
        </div>

        <div
          className={cx(
            "flex h-6 w-6 shrink-0 items-center justify-center border-2 pixel-corners-sm",
            selected ? "border-accent-light bg-accent text-[#fffffe]" : "border-border bg-ink"
          )}
        >
          {selected && <CheckIcon size={14} />}
        </div>
      </motion.button>
    </div>
  );
}
