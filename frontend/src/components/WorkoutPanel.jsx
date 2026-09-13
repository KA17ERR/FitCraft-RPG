import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PixelButton from "./PixelButton";
import Badge from "./Badge";
import FloatingReward from "./FloatingReward";
import ExerciseAnimation from "./ExerciseAnimation";
import {
  DumbbellIcon,
  CheckIcon,
  XPIcon,
  FlameIcon,
  TrophyIcon,
  StarIcon,
} from "./icons/PixelIcons";

// ---------------------------------------------------------------------
// WorkoutPanel — the actual, playable workout session. Lives INSIDE the
// dashboard's hero panel (no separate preview page or modal): starting a
// workout swaps this in for the normal idle hero content, right there on
// the main screen, background gym scene still visible around it.
//
// Flow: exercise begins automatically (its animation is already playing
// the moment this mounts) -> "Complete Exercise" -> short celebration ->
// "Next Exercise" -> next exercise begins automatically -> ... -> a
// "Workout Complete" summary once every exercise is done.
// ---------------------------------------------------------------------

const WORKOUT_EXERCISES = [
  { id: "squat", name: "Squat", animationKey: "squat", sets: 4, reps: "15 reps", xp: 15 },
  { id: "pushup", name: "Push-Up", animationKey: "pushup", sets: 4, reps: "12 reps", xp: 15 },
  { id: "bicep-curl", name: "Bicep Curl", animationKey: "bicep-curl", sets: 3, reps: "12 reps", xp: 10 },
  { id: "bench-press", name: "Bench Press", animationKey: "bench-press", sets: 3, reps: "8 reps", xp: 20 },
  { id: "deadlift", name: "Deadlift", animationKey: "deadlift", sets: 4, reps: "6 reps", xp: 20 },
  { id: "plank", name: "Plank", animationKey: "plank", sets: 3, reps: "45 sec", xp: 10 },
  { id: "running", name: "Running", animationKey: "running", sets: 1, reps: "10 min", xp: 25 },
];

const CELEBRATE_MS = 1300;

export default function WorkoutPanel({ character, onExit, onFinish, className = "" }) {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  // "active" — performing the current exercise
  // "celebrating" — just hit Complete Exercise, character celebrates
  // "completed" — celebration finished, waiting for "Next Exercise"
  // "finished" — every exercise done, workout summary shown
  const [phase, setPhase] = useState("active");
  const [reward, setReward] = useState(false);

  const total = WORKOUT_EXERCISES.length;
  const current = WORKOUT_EXERCISES[exerciseIndex];
  const completedCount = phase === "active" ? exerciseIndex : exerciseIndex + 1;
  const progressPct = Math.round((completedCount / total) * 100);
  const earnedXP = WORKOUT_EXERCISES.slice(0, completedCount).reduce((sum, e) => sum + e.xp, 0);

  const pose =
    phase === "celebrating" || phase === "finished"
      ? "celebrate"
      : phase === "completed"
        ? "idle"
        : current.animationKey;

  function handleComplete() {
    setPhase("celebrating");
    setReward(true);
    setTimeout(() => setReward(false), 1000);
    setTimeout(() => {
      setPhase(exerciseIndex === total - 1 ? "finished" : "completed");
    }, CELEBRATE_MS);
  }

  function handleNext() {
    setExerciseIndex((i) => Math.min(i + 1, total - 1));
    setPhase("active");
  }

  function handleFinish() {
    onFinish?.({ totalXP: earnedXP, exerciseCount: total });
  }

  return (
    <div className={`grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center ${className}`}>
      {/* Character, moved into the workout area — same hero panel, floor
          re-themed as a training mat so it reads as "in the workout zone"
          rather than just standing around. */}
      <div className="relative mx-auto flex h-56 w-36 items-end justify-center sm:h-72 sm:w-48">
        <div aria-hidden="true" className="absolute bottom-5 h-3 w-4/5 rounded-full bg-black/40 blur-[2px]" />
        <motion.div
          layout
          aria-hidden="true"
          className="absolute bottom-0 h-4 w-full border-2 border-accent bg-accent/25 pixel-corners-sm"
        />
        <motion.div
          key={pose}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 h-[92%] w-[85%]"
        >
          <ExerciseAnimation exercise={pose} character={character} isPlaying className="h-full w-full" />
        </motion.div>
      </div>

      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="accent" size="md" icon={<DumbbellIcon size={12} />}>
            Exercise {Math.min(exerciseIndex + 1, total)}/{total}
          </Badge>
          <Badge variant="xp" size="md" icon={<XPIcon size={12} />}>
            +{current.xp} XP
          </Badge>
          {phase !== "finished" && (
            <Badge variant="danger" size="md" icon={<FlameIcon size={12} />}>
              In Progress
            </Badge>
          )}
        </div>

        <AnimatePresence mode="wait">
          {phase === "finished" ? (
            <motion.div key="finished" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="pixel-text-shadow mb-1 flex items-center gap-2 truncate font-heading text-lg text-[#fffffe] sm:text-xl">
                <TrophyIcon size={22} /> Workout Complete!
              </h2>
              <p className="mb-4 text-sm text-muted">
                You cleared all {total} exercises and earned <span className="text-xp-light">+{earnedXP} XP</span>.
              </p>
            </motion.div>
          ) : (
            <motion.div key={current.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="pixel-text-shadow mb-1 truncate font-heading text-lg text-[#fffffe] sm:text-xl">
                {current.name}
              </h2>
              <p className="mb-4 text-sm text-muted">
                {current.sets} sets &times; {current.reps}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-4 border-2 border-border bg-ink/60 p-3 pixel-corners-sm">
          <div className="mb-1.5 flex items-center justify-between font-heading text-[9px] uppercase tracking-widest text-muted">
            <span>Workout Progress</span>
            <span className="text-accent-light">{progressPct}%</span>
          </div>
          <div className={`h-3 w-full overflow-hidden border-2 border-border bg-ink pixel-corners-sm ${progressPct >= 100 ? "animate-glow-pulse" : ""}`}>
            <motion.div
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-accent to-accent-light"
            />
          </div>
          <p className="relative mt-1.5 flex items-center gap-1.5 text-sm text-muted">
            {completedCount} of {total} exercises &middot; +{earnedXP} XP earned
            <FloatingReward show={reward} amount={current.xp} type="xp" className="left-32 -top-1" />
          </p>
        </div>

        {(phase === "celebrating" || phase === "completed") && (
          <div className="mb-3 flex items-center gap-2 border-2 border-success bg-success/10 px-3 py-2 pixel-corners-sm">
            <CheckIcon size={16} />
            <span className="font-heading text-[10px] uppercase tracking-widest text-success">
              {phase === "celebrating" ? "Nice work!" : "Set complete — ready for the next one?"}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          {phase === "active" && (
            <div className="w-full sm:w-56">
              <PixelButton variant="primary" icon={<CheckIcon size={16} />} onClick={handleComplete}>
                Complete Exercise
              </PixelButton>
            </div>
          )}
          {phase === "celebrating" && (
            <div className="w-full sm:w-56">
              <PixelButton variant="primary" disabled icon={<StarIcon size={16} />}>
                Nice!
              </PixelButton>
            </div>
          )}
          {phase === "completed" && (
            <div className="w-full sm:w-56">
              <PixelButton variant="primary" icon={<DumbbellIcon size={16} />} onClick={handleNext}>
                Next Exercise
              </PixelButton>
            </div>
          )}
          {phase === "finished" && (
            <div className="w-full sm:w-56">
              <PixelButton variant="gold" icon={<TrophyIcon size={16} />} onClick={handleFinish}>
                Claim Rewards
              </PixelButton>
            </div>
          )}
          {phase !== "finished" && (
            <div className="w-full sm:w-40">
              <PixelButton variant="ghost" onClick={onExit}>
                End Workout
              </PixelButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
