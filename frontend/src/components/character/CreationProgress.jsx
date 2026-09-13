import { motion } from "framer-motion";
import { cx } from "../../utils/cx";
import { CheckIcon } from "../icons/PixelIcons";

/**
 * CreationProgress — the step tracker across the top of Character Creation.
 * Pass the full ordered list of steps and the current index; steps before
 * the current one render as "completed" (checkmark), the current one is
 * highlighted, and later ones are dimmed/locked-looking.
 *
 * `steps` — array of { key, label, icon }. Designed to keep working as more
 * steps (customization, AI review, etc.) are appended in later rounds.
 */
export default function CreationProgress({ steps, currentIndex }) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {steps.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isLast = i === steps.length - 1;

          return (
            <div key={step.key} className={cx("flex items-center", !isLast && "flex-1")}>
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{ scale: isCurrent ? 1.08 : 1 }}
                  transition={{ duration: 0.25 }}
                  className={cx(
                    "pixel-corners-sm flex h-9 w-9 shrink-0 items-center justify-center border-2 font-heading text-xs",
                    isCompleted && "border-accent bg-accent text-[#fffffe]",
                    isCurrent && "border-accent-light bg-accent/20 text-accent-light",
                    !isCompleted && !isCurrent && "border-border bg-panel text-muted"
                  )}
                >
                  {isCompleted ? <CheckIcon size={16} /> : step.icon ?? i + 1}
                </motion.div>
                <span
                  className={cx(
                    "hidden font-heading text-[8px] uppercase tracking-widest sm:block",
                    isCurrent ? "text-accent-light" : "text-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div className="mx-1.5 h-1 flex-1 bg-border sm:mx-2">
                  <motion.div
                    initial={false}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full bg-accent"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-center font-heading text-[10px] uppercase tracking-widest text-muted sm:hidden">
        Step {currentIndex + 1} of {steps.length} — {steps[currentIndex]?.label}
      </p>
    </div>
  );
}
