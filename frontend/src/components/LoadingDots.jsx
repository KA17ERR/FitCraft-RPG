import { cx } from "../utils/cx";

const SIZE_STYLES = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
};

/**
 * LoadingDots — three stepping pixel squares. Drop-in loading indicator
 * for buttons, panels, or full-screen loading states. Purely presentational.
 */
export default function LoadingDots({ size = "md", className = "" }) {
  return (
    <span className={cx("inline-flex items-center gap-1", className)} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cx("animate-loading-dot inline-block bg-current", SIZE_STYLES[size])}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
