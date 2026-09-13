import { motion } from "framer-motion";
import { cx } from "../utils/cx";
import LoadingDots from "./LoadingDots";

const VARIANT_STYLES = {
  primary: "bg-accent border-accent-light text-[#fffffe] hover:bg-[#57e078] hover:shadow-[0_0_0_3px_rgba(62,207,95,0.3)]",
  secondary:
    "bg-panel-raised border-border-light text-[#fffffe] hover:bg-[#28356b] hover:shadow-[0_0_0_3px_rgba(108,124,192,0.25)]",
  gold: "bg-gold border-[#ffe9b0] text-[#3a2a00] hover:bg-[#ffdb85] hover:shadow-[0_0_0_3px_rgba(255,209,102,0.35)]",
  ghost: "bg-transparent border-border text-muted hover:text-[#fffffe] hover:border-border-light",
};

const SIZE_STYLES = {
  sm: "px-3 py-1.5 text-[10px]",
  md: "px-4 py-3 text-xs",
  lg: "px-6 py-4 text-sm",
};

export default function PixelButton({
  children,
  type = "button",
  onClick,
  disabled,
  loading = false,
  variant = "primary",
  size = "md",
  icon = null,
  fullWidth = true,
  className = "",
}) {
  const isDisabled = disabled || loading;

  return (
    <div className={cx("relative", fullWidth ? "w-full" : "inline-block", className)}>
      {/* offset shadow layer, ducks down when pressed */}
      <div
        aria-hidden="true"
        className="pixel-corners-sm absolute inset-0 translate-x-1 translate-y-1 bg-black/50"
      />
      <motion.button
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        whileHover={isDisabled ? {} : { x: -1, y: -1 }}
        whileTap={isDisabled ? {} : { x: 1, y: 1, scale: 0.98 }}
        transition={{ duration: 0.08 }}
        className={cx(
          "pixel-corners-sm relative flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-0.5 border-4 text-center font-heading font-bold uppercase tracking-wider transition-[background-color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size]
        )}
      >
        {loading ? <LoadingDots size={size === "sm" ? "sm" : "md"} /> : icon}
        {children}
      </motion.button>
    </div>
  );
}
