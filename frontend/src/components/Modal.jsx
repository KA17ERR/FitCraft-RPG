import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PixelCard from "./PixelCard";
import { cx } from "../utils/cx";

/**
 * Modal — pixel-framed dialog. Controlled component: render it always and
 * toggle `isOpen`; it handles its own enter/exit animation and unmounts
 * itself from the DOM when closed.
 */
export default function Modal({ isOpen, onClose, title, children, className = "" }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className={cx("w-full max-w-md", className)}
          >
            <PixelCard variant="raised" className="w-full" initial={false}>
              <div className="flex items-start justify-between gap-3">
                {title && (
                  <h2 className="pixel-text-shadow min-w-0 flex-1 break-words font-heading text-base text-[#fffffe]">
                    {title}
                  </h2>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="pixel-corners-sm flex h-7 w-7 shrink-0 items-center justify-center border-2 border-border bg-ink font-heading text-xs text-muted transition-colors hover:border-accent hover:text-accent-light"
                >
                  X
                </button>
              </div>
              <div className="mt-3">{children}</div>
            </PixelCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
