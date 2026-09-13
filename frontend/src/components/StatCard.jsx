import { motion } from "framer-motion";
import PixelCard from "./PixelCard";
import { cx } from "../utils/cx";

const ACCENT_STYLES = {
  accent: "text-accent-light",
  gold: "text-gold",
  xp: "text-xp-light",
  success: "text-success",
  hp: "text-hp",
  default: "text-[#fffffe]",
};

/**
 * StatCard — a small panel for a single stat: an icon, a label, a big
 * value, and an optional trend/sub-label underneath.
 */
export default function StatCard({ icon, label, value, sublabel, accent = "default", className = "" }) {
  return (
    <PixelCard className={className} interactive>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-3"
      >
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-border bg-ink pixel-corners-sm">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-heading text-[9px] uppercase tracking-widest text-muted">{label}</p>
          <p className={cx("font-heading text-lg leading-tight", ACCENT_STYLES[accent])}>{value}</p>
          {sublabel && <p className="mt-0.5 truncate text-sm text-muted">{sublabel}</p>}
        </div>
      </motion.div>
    </PixelCard>
  );
}
