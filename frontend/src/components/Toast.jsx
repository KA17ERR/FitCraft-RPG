import { motion } from "framer-motion";
import { CoinIcon, XPIcon, CheckIcon, HeartIcon } from "./icons/PixelIcons";
import { cx } from "../utils/cx";

const ICONS = {
  xp: <XPIcon size={18} />,
  coin: <CoinIcon size={18} />,
  success: <CheckIcon size={18} />,
  hp: <HeartIcon size={18} />,
};

const BORDER_BY_TYPE = {
  xp: "border-xp",
  coin: "border-gold",
  success: "border-success",
  hp: "border-hp",
  default: "border-border-light",
};

const BAR_BY_TYPE = {
  xp: "bg-xp",
  coin: "bg-gold",
  success: "bg-success",
  hp: "bg-hp",
  default: "bg-border-light",
};

/**
 * Toast — a single pixel-framed notification (e.g. "+50 XP", "Quest
 * Complete!"). Rendered and stacked by ToastProvider; can also be used
 * standalone if a one-off inline notification is ever needed. When
 * `duration` is passed (and > 0) a thin bar drains along the bottom edge
 * so the person can see roughly how long it has left before it dismisses
 * itself.
 */
export default function Toast({
  title,
  description,
  type = "default",
  duration = 0,
  onDismiss,
  className = "",
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cx("relative", className)}
    >
      <div
        aria-hidden="true"
        className="pixel-corners-sm absolute inset-0 translate-x-1 translate-y-1 bg-black/50"
      />
      <div
        className={cx(
          "pixel-corners-sm relative flex items-start gap-2 overflow-hidden border-4 bg-panel px-3 py-2.5",
          BORDER_BY_TYPE[type] || BORDER_BY_TYPE.default
        )}
      >
        <motion.span
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.05 }}
          className="mt-0.5 shrink-0"
        >
          {ICONS[type]}
        </motion.span>
        <div className="min-w-0">
          <p className="truncate font-heading text-[10px] uppercase tracking-widest text-[#fffffe]">{title}</p>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="ml-auto shrink-0 font-heading text-[10px] text-muted transition-colors hover:text-[#fffffe]"
          >
            X
          </button>
        )}

        {duration > 0 && (
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            style={{ transformOrigin: "left" }}
            className={cx("absolute inset-x-0 bottom-0 h-0.5", BAR_BY_TYPE[type] || BAR_BY_TYPE.default)}
          />
        )}
      </div>
    </motion.div>
  );
}
