import { motion } from "framer-motion";
import PixelCard from "./PixelCard";
import PixelButton from "./PixelButton";
import { HeartIcon } from "./icons/PixelIcons";
import { cx } from "../utils/cx";

/**
 * ErrorState — shared "something went wrong" panel with an optional retry
 * action. Mirrors EmptyState's layout so the two read as a matched pair.
 */
export default function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  onRetry,
  retryLabel = "Try Again",
  className = "",
}) {
  return (
    <PixelCard variant="panel" className={cx("border-hp text-center", className)}>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mx-auto flex max-w-xs flex-col items-center py-2"
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center border-2 border-hp bg-hp/10 pixel-corners-sm text-hp">
          <HeartIcon size={22} />
        </div>
        <p className="font-heading text-xs uppercase tracking-widest text-[#fffffe]">{title}</p>
        {description && <p className="mt-1.5 text-sm leading-snug text-muted">{description}</p>}
        {onRetry && (
          <div className="mt-4 w-full max-w-[180px]">
            <PixelButton variant="secondary" size="sm" onClick={onRetry}>
              {retryLabel}
            </PixelButton>
          </div>
        )}
      </motion.div>
    </PixelCard>
  );
}
