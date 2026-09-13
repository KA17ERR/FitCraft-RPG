import { cx } from "../utils/cx";

const VARIANT_STYLES = {
  default: "bg-panel-raised border-border text-muted",
  accent: "bg-accent/20 border-accent text-accent-light",
  gold: "bg-gold/15 border-gold text-gold",
  success: "bg-success/15 border-success text-success",
  danger: "bg-hp/15 border-hp text-hp",
  xp: "bg-xp/15 border-xp text-xp-light",
};

const SIZE_STYLES = {
  sm: "px-1.5 py-0.5 text-[8px] gap-1",
  md: "px-2 py-1 text-[10px] gap-1.5",
};

/**
 * Badge — small pixel-cornered tag for difficulty ("EPIC"), status
 * ("COMPLETED"), or level ("LV. 12") labels.
 */
export default function Badge({ children, variant = "default", size = "md", icon = null, className = "" }) {
  return (
    <span
      className={cx(
        "pixel-corners-sm inline-flex items-center border-2 font-heading uppercase tracking-widest",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
