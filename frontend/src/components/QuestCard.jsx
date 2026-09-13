import { motion, AnimatePresence } from "framer-motion";
import PixelCard from "./PixelCard";
import PixelButton from "./PixelButton";
import Badge from "./Badge";
import FloatingReward from "./FloatingReward";
import { CoinIcon, XPIcon, CheckIcon, LockIcon } from "./icons/PixelIcons";
import { cx } from "../utils/cx";

const DIFFICULTY_VARIANT = {
  easy: "success",
  medium: "xp",
  hard: "accent",
  epic: "gold",
};

/**
 * QuestCard — represents a single fitness "quest" (a workout/activity) with
 * its rewards, difficulty, and status.
 *
 * status: "active" | "completed" | "locked"
 * celebrate: set true for one render right after this card flips to
 *   "completed" to play a brief glow + floating reward animation. The
 *   parent owns clearing it back to false (e.g. after a timeout).
 */
export default function QuestCard({
  title,
  description,
  difficulty = "easy",
  xpReward = 0,
  coinReward = 0,
  status = "active",
  actionLabel = "Start Quest",
  onAction,
  celebrate = false,
  className = "",
}) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";

  return (
    <motion.div layout transition={{ duration: 0.25, ease: "easeOut" }}>
      <PixelCard
        variant={isCompleted ? "raised" : "panel"}
        interactive={!isLocked}
        className={cx(isLocked && "opacity-60", celebrate && "animate-glow-pulse", className)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <Badge variant={DIFFICULTY_VARIANT[difficulty]} size="sm">
                {difficulty}
              </Badge>
              <AnimatePresence>
                {isCompleted && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    <Badge variant="success" size="sm" icon={<CheckIcon size={10} />}>
                      Completed
                    </Badge>
                  </motion.span>
                )}
              </AnimatePresence>
              {isLocked && (
                <Badge variant="default" size="sm" icon={<LockIcon size={10} />}>
                  Locked
                </Badge>
              )}
            </div>
            <h3 className="truncate font-heading text-sm text-[#fffffe]">{title}</h3>
          </div>

          {isLocked && (
            <motion.div
              animate={{ rotate: [0, -4, 4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <LockIcon size={22} />
            </motion.div>
          )}
        </div>

        {description && <p className="mt-2 text-sm leading-snug text-muted">{description}</p>}

        <div className="relative mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 font-heading text-xs">
            {xpReward > 0 && (
              <span className="relative flex items-center gap-1 text-xp-light">
                <XPIcon size={16} />+{xpReward}
                <FloatingReward show={celebrate} amount={xpReward} type="xp" className="left-0 -top-1" />
              </span>
            )}
            {coinReward > 0 && (
              <span className="relative flex items-center gap-1 text-gold">
                <CoinIcon size={16} className={celebrate ? "animate-coin-flip" : ""} />+{coinReward}
                <FloatingReward show={celebrate} amount={coinReward} type="coin" className="left-0 -top-1" />
              </span>
            )}
          </div>

          {onAction && !isCompleted && (
            <div className="w-auto">
              <PixelButton
                size="sm"
                fullWidth={false}
                variant={isLocked ? "ghost" : "primary"}
                disabled={isLocked}
                onClick={onAction}
              >
                {isLocked ? "Locked" : actionLabel}
              </PixelButton>
            </div>
          )}
        </div>
      </PixelCard>
    </motion.div>
  );
}
