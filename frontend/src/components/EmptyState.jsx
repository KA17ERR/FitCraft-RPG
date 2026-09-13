import { motion } from "framer-motion";
import PixelCard from "./PixelCard";
import { cx } from "../utils/cx";

/**
 * EmptyState — shared "nothing here yet" panel for quest lists, meal logs,
 * exercise filters, etc. Keeps empty states visually consistent instead of
 * every page inventing its own plain paragraph.
 */
export default function EmptyState({ icon, title, description, action, className = "" }) {
  return (
    <PixelCard variant="panel" className={cx("text-center", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mx-auto flex max-w-xs flex-col items-center py-2"
      >
        {icon && (
          <div className="animate-pixel-pulse mb-3 flex h-12 w-12 items-center justify-center border-2 border-border bg-ink pixel-corners-sm text-muted">
            {icon}
          </div>
        )}
        {title && <p className="font-heading text-xs uppercase tracking-widest text-[#fffffe]">{title}</p>}
        {description && <p className="mt-1.5 text-sm leading-snug text-muted">{description}</p>}
        {action && <div className="mt-4 w-full max-w-[220px]">{action}</div>}
      </motion.div>
    </PixelCard>
  );
}
