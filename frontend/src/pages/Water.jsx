import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useWater } from "../context/WaterContext";
import PixelButton from "../components/PixelButton";
import PixelCard from "../components/PixelCard";
import Badge from "../components/Badge";
import GameNav from "../components/GameNav";
import WaterBottle from "../components/WaterBottle";
import { WaterDropIcon, PlusIcon, TrophyIcon } from "../components/icons/PixelIcons";

// ---------------------------------------------------------------------
// Water total lives in WaterContext (shared with the Dashboard quick
// action) so both surfaces always agree, persist the same way, and never
// reset except at the start of a new calendar day.
// ---------------------------------------------------------------------

const ADD_AMOUNTS = [250, 500, 750];

export default function Water() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { consumed, dailyGoal: DAILY_GOAL_ML, addWater: addWaterAmount, resetToday: resetWaterToday } = useWater();

  const percent = (consumed / DAILY_GOAL_ML) * 100;
  const goalReached = consumed >= DAILY_GOAL_ML;
  const cups = (consumed / 250).toFixed(1);
  const goalCups = Math.round(DAILY_GOAL_ML / 250);

  function addWater(amount) {
    const justReached = consumed < DAILY_GOAL_ML && consumed + amount >= DAILY_GOAL_ML;
    addWaterAmount(amount);
    showToast({
      title: justReached ? "Daily Goal Reached!" : `+${amount}ml Logged`,
      description: justReached ? "You've hit your hydration goal today." : "Stay hydrated, stay strong.",
      type: justReached ? "xp" : "default",
    });
  }

  function resetToday() {
    resetWaterToday();
    showToast({ title: "Water Log Reset", description: "Starting fresh for today.", type: "default" });
  }

  return (
    <div className="relative z-10 min-h-screen px-4 py-6 pb-16 text-[#fffffe] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4">
          <p className="font-heading text-[9px] uppercase tracking-widest text-muted">FitCraft RPG</p>
          <h1 className="pixel-text-shadow font-heading text-base text-[#fffffe] sm:text-lg">
            {user?.username ? `${user.username}'s Water Tracker` : "Water Tracker"}
          </h1>
        </header>

        <GameNav />

        <PixelCard variant="accent" className="mb-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.14),transparent_55%)]"
          />
          <div className="relative z-10 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="mx-auto h-44 w-28 sm:h-56 sm:w-36">
              <WaterBottle percent={percent} className="h-full w-full" />
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="default" size="md" icon={<WaterDropIcon size={12} />}>
                  Daily Goal: {DAILY_GOAL_ML.toLocaleString()}ml
                </Badge>
                {goalReached && (
                  <Badge variant="success" size="md" icon={<TrophyIcon size={12} />}>
                    Goal Reached
                  </Badge>
                )}
              </div>

              <h2 className="pixel-text-shadow mb-1 font-heading text-2xl text-[#fffffe]">
                {consumed.toLocaleString()}
                <span className="text-sm text-muted"> / {DAILY_GOAL_ML.toLocaleString()}ml</span>
              </h2>
              <p className="mb-4 text-sm text-muted">
                {cups} of {goalCups} cups today
              </p>

              <div className="mb-5 border-2 border-border bg-ink/60 p-3 pixel-corners-sm">
                <div className="mb-1.5 flex items-center justify-between font-heading text-[9px] uppercase tracking-widest text-muted">
                  <span>Hydration Progress</span>
                  <span className="text-accent-light">{Math.min(100, Math.round(percent))}%</span>
                </div>
                <div className={`h-3 w-full overflow-hidden border-2 border-border bg-ink pixel-corners-sm ${goalReached ? "animate-glow-pulse-blue" : ""}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, percent)}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#7dd3fc]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {ADD_AMOUNTS.map((amount) => (
                  <PixelButton
                    key={amount}
                    variant="secondary"
                    size="sm"
                    icon={<PlusIcon size={12} />}
                    onClick={() => addWater(amount)}
                  >
                    {amount}ml
                  </PixelButton>
                ))}
              </div>

              <div className="mt-3 w-full sm:w-40">
                <PixelButton variant="ghost" size="sm" onClick={resetToday}>
                  Reset Today
                </PixelButton>
              </div>
            </div>
          </div>
        </PixelCard>
      </div>
    </div>
  );
}
