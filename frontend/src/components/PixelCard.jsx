import { motion } from "framer-motion";
import { cx } from "../utils/cx";

/**
 * PixelCard — the base "panel" primitive of the design system.
 *
 * Renders a two-layer pixel-corner frame: a solid offset shadow layer behind
 * a bordered panel on top. This reads as a chunky pixel-art dialog box
 * instead of a soft SaaS card (no border-radius, no soft box-shadow blur).
 *
 * variant:
 *  - "panel"  (default) muted background, used for generic containers
 *  - "raised" slightly lighter background, used for hovered/active surfaces
 *  - "accent" crimson-bordered, used to draw attention (e.g. featured quest)
 */
export default function PixelCard({
  children,
  className = "",
  variant = "panel",
  interactive = false,
  as: Component = motion.div,
  ...rest
}) {
  const borderColor =
    variant === "accent"
      ? "border-accent"
      : variant === "raised"
        ? "border-border-light"
        : "border-border";

  const bg = variant === "raised" ? "bg-panel-raised" : "bg-panel";

  const defaultMotionProps =
    Component === motion.div
      ? {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3, ease: "easeOut" },
        }
      : {};

  return (
    <div className={cx("relative", className)}>
      {/* offset shadow layer */}
      <div
        aria-hidden="true"
        className="pixel-corners absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black/50"
      />
      {/* front panel */}
      <Component
        className={cx(
          "pixel-corners relative border-4 p-4",
          borderColor,
          bg,
          interactive &&
            "transition-[background-color,transform] duration-150 hover:-translate-y-0.5 hover:bg-panel-raised"
        )}
        {...defaultMotionProps}
        {...rest}
      >
        {children}
      </Component>
    </div>
  );
}
