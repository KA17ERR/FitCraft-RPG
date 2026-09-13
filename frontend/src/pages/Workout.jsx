import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useCharacter } from "../context/CharacterContext";
import PixelButton from "../components/PixelButton";
import PixelCard from "../components/PixelCard";
import Badge from "../components/Badge";
import GameNav from "../components/GameNav";
import ExerciseAnimation from "../components/ExerciseAnimation";
import EmptyState from "../components/EmptyState";
import QuestCompleteModal from "../components/QuestCompleteModal";
import EmoteUnlockModal from "../components/EmoteUnlockModal";
import EmotesPanel from "../components/EmotesPanel";
import { EMOTES, DEFAULT_UNLOCKED_EMOTE_IDS } from "../utils/emotes";
import {
  DumbbellIcon,
  FlameIcon,
  ShieldIcon,
  StarIcon,
  SwordIcon,
  XPIcon,
  CheckIcon,
  ChartIcon,
  EyeIcon,
} from "../components/icons/PixelIcons";

// ---------------------------------------------------------------------
// Frontend-only mock data. Nothing here is persisted — completing an
// exercise or starting a workout just updates local component state and
// pops a toast so the screen feels alive.
// ---------------------------------------------------------------------

const TODAYS_WORKOUT = {
  title: "Push Day: Upper Body Power",
  category: "Strength",
  difficulty: "medium",
  estMinutes: 35,
  estCalories: 280,
};

const CATEGORIES = [
  { key: "all", label: "All", icon: StarIcon },
  { key: "strength", label: "Strength", icon: SwordIcon },
  { key: "cardio", label: "Cardio", icon: FlameIcon },
  { key: "core", label: "Core", icon: ShieldIcon },
  { key: "mobility", label: "Mobility", icon: ChartIcon },
];

const CATEGORY_BADGE = {
  strength: "danger",
  cardio: "gold",
  core: "xp",
  mobility: "accent",
};

// `coins` mirrors `xp` as another frontend-only mock reward value — no
// backend/economy wired up yet, just numbers to drive the completion
// celebration and the progress summary.
const INITIAL_EXERCISES = [
  { id: "pushups", name: "Push-Ups", category: "strength", sets: 4, reps: "12", xp: 15, coins: 6, completed: true, animationKey: "pushup" },
  { id: "squats", name: "Squats", category: "strength", sets: 4, reps: "15", xp: 15, coins: 6, completed: false, animationKey: "squat" },
  { id: "deadlifts", name: "Deadlifts", category: "strength", sets: 4, reps: "6", xp: 20, coins: 10, completed: false, animationKey: "deadlift" },
  { id: "benchpress", name: "Bench Press", category: "strength", sets: 3, reps: "8", xp: 20, coins: 10, completed: false, animationKey: "bench-press" },
  { id: "rows", name: "Dumbbell Rows", category: "strength", sets: 3, reps: "10", xp: 15, coins: 6, completed: true },
  { id: "curls", name: "Bicep Curls", category: "strength", sets: 3, reps: "12", xp: 10, coins: 4, completed: false, animationKey: "bicep-curl" },
  { id: "plank", name: "Plank Hold", category: "core", sets: 3, reps: "45 sec", xp: 10, coins: 4, completed: false, animationKey: "plank" },
  { id: "situps", name: "Sit-Ups", category: "core", sets: 3, reps: "15", xp: 10, coins: 4, completed: false },
  { id: "running", name: "Running", category: "cardio", sets: 1, reps: "10 min", xp: 25, coins: 12, completed: false, animationKey: "running" },
  { id: "jumprope", name: "Jump Rope", category: "cardio", sets: 1, reps: "5 min", xp: 20, coins: 8, completed: false },
  { id: "stretch", name: "Shoulder Stretch", category: "mobility", sets: 2, reps: "30 sec", xp: 5, coins: 2, completed: false },
];

function ExerciseCard({ exercise, onToggle, onPreview, isPreviewing }) {
  const { name, category, sets, reps, xp, completed, animationKey } = exercise;
  return (
    <PixelCard variant={completed ? "raised" : isPreviewing ? "accent" : "panel"} interactive>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge variant={CATEGORY_BADGE[category] || "default"} size="sm">
              {category}
            </Badge>
            {completed && (
              <Badge variant="success" size="sm" icon={<CheckIcon size={10} />}>
                Done
              </Badge>
            )}
            {isPreviewing && (
              <Badge variant="accent" size="sm" icon={<EyeIcon size={10} />}>
                Previewing
              </Badge>
            )}
          </div>
          <h3 className="truncate font-heading text-sm text-[#fffffe]">{name}</h3>
          <p className="mt-1 text-sm text-muted">
            {sets} sets &times; {reps}
          </p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-border bg-ink pixel-corners-sm">
          <DumbbellIcon size={16} />
        </div>
      </div>

      {/* Inline exercise demo — expands/collapses smoothly, and crossfades
          when switching to a different exercise's animation. */}
      <AnimatePresence initial={false}>
        {isPreviewing && animationKey && (
          <motion.div
            key="demo-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-2 border-border bg-ink/60 p-3 pixel-corners-sm">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={animationKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mx-auto h-32 w-32 sm:h-36 sm:w-36"
                >
                  <ExerciseAnimation exercise={animationKey} character={CHARACTER} isPlaying className="h-full w-full" />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1 font-heading text-xs text-xp-light">
          <XPIcon size={16} />+{xp}
        </span>
        <div className="flex items-center gap-2">
          {animationKey && (
            <div className="w-auto">
              <PixelButton
                size="sm"
                fullWidth={false}
                variant={isPreviewing ? "primary" : "ghost"}
                icon={<EyeIcon size={14} />}
                onClick={() => onPreview(exercise)}
              >
                {isPreviewing ? "Hide" : "Preview"}
              </PixelButton>
            </div>
          )}
          <div className="w-auto">
            <PixelButton
              size="sm"
              fullWidth={false}
              variant={completed ? "ghost" : "primary"}
              onClick={() => onToggle(exercise.id)}
            >
              {completed ? "Mark Undone" : "Mark Complete"}
            </PixelButton>
          </div>
        </div>
      </div>
    </PixelCard>
  );
}

export default function Workout() {
  const { user } = useAuth();
  const { showToast } = useToast();
  // Same saved build the Dashboard/Character Creator use, so this screen's
  // rig always matches the player's actual customization.
  const { character: CHARACTER } = useCharacter();
  const [exercises, setExercises] = useState(INITIAL_EXERCISES);
  const [category, setCategory] = useState("all");
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [previewExerciseId, setPreviewExerciseId] = useState(null);
  // Drives the reusable QuestCompleteModal — null when closed, otherwise
  // the reward details for whichever exercise was just completed.
  const [completionReward, setCompletionReward] = useState(null);
  // Emote unlock system — frontend state only. `unlockedEmoteIds` is the
  // player's collection so far; `activeEmoteId` is whichever emote is
  // playing on the Emotes stage. When a completion unlocks a new one, we
  // stash it in `pendingEmoteUnlock` and only reveal the announcement
  // once the QuestCompleteModal above has been dismissed, so the two
  // celebrations never fight for the screen at once.
  const [unlockedEmoteIds, setUnlockedEmoteIds] = useState(DEFAULT_UNLOCKED_EMOTE_IDS);
  const [activeEmoteId, setActiveEmoteId] = useState(DEFAULT_UNLOCKED_EMOTE_IDS[0] || null);
  const [pendingEmoteUnlock, setPendingEmoteUnlock] = useState(null);
  const [emoteUnlockAnnounce, setEmoteUnlockAnnounce] = useState(null);

  const completedCount = exercises.filter((e) => e.completed).length;
  const totalCount = exercises.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const earnedXP = exercises.filter((e) => e.completed).reduce((sum, e) => sum + e.xp, 0);
  const earnedCoins = exercises.filter((e) => e.completed).reduce((sum, e) => sum + (e.coins || 0), 0);

  const visibleExercises =
    category === "all" ? exercises : exercises.filter((e) => e.category === category);

  function toggleExercise(id) {
    setExercises((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e));
      const target = next.find((e) => e.id === id);
      if (target?.completed) {
        // Completing triggers the full celebration (modal handles the XP/
        // coin/character feedback) instead of just a toast.
        setCompletionReward({ name: target.name, xp: target.xp, coins: target.coins || 0 });

        // Also offer up the next locked emote, if any remain. It's queued
        // rather than shown immediately — see closeCompletionModal below.
        const nextLocked = EMOTES.find((em) => !unlockedEmoteIds.includes(em.id));
        if (nextLocked) {
          setUnlockedEmoteIds((prevUnlocked) => [...prevUnlocked, nextLocked.id]);
          setPendingEmoteUnlock(nextLocked);
        }
      } else {
        showToast({
          title: "Exercise Marked Undone",
          description: "You can complete it again anytime.",
          type: "default",
        });
      }
      return next;
    });
  }

  function closeCompletionModal() {
    setCompletionReward(null);
    if (pendingEmoteUnlock) {
      setEmoteUnlockAnnounce(pendingEmoteUnlock);
      setPendingEmoteUnlock(null);
    }
  }

  function handlePreview(exercise) {
    setPreviewExerciseId((current) => (current === exercise.id ? null : exercise.id));
  }

  function handleStartWorkout() {
    setWorkoutStarted((prev) => !prev);
    showToast({
      title: workoutStarted ? "Workout Paused" : "Workout Started!",
      description: workoutStarted ? "Resume whenever you're ready." : "Time to earn some XP out there.",
      type: workoutStarted ? "default" : "xp",
    });
  }

  return (
    <div className="relative z-10 min-h-screen px-4 py-6 pb-16 text-[#fffffe] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4">
          <p className="font-heading text-[9px] uppercase tracking-widest text-muted">FitCraft RPG</p>
          <h1 className="pixel-text-shadow font-heading text-base text-[#fffffe] sm:text-lg">
            {user?.username ? `${user.username}'s Workout` : "Workout"}
          </h1>
        </header>

        <GameNav />

        {/* Today's workout + pixel character visual */}
        <PixelCard variant="accent" className="mb-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(62,207,95,0.16),transparent_55%)]"
          />
          <div className="relative z-10 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="relative mx-auto flex h-48 w-32 items-end justify-center sm:h-60 sm:w-40">
              <div
                aria-hidden="true"
                className="absolute bottom-4 h-3 w-4/5 rounded-full bg-black/40 blur-[2px]"
              />
              <div className="absolute bottom-0 h-4 w-full border-2 border-border bg-panel-raised pixel-corners-sm" />
              <ExerciseAnimation
                exercise={workoutStarted ? "running" : "idle"}
                character={CHARACTER}
                isPlaying
                className="relative z-10 h-[92%] w-[85%]"
              />
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="danger" size="md">
                  {TODAYS_WORKOUT.difficulty}
                </Badge>
                <Badge variant="default" size="md">
                  {TODAYS_WORKOUT.category}
                </Badge>
                {workoutStarted && (
                  <Badge variant="success" size="md" icon={<FlameIcon size={12} />}>
                    In Progress
                  </Badge>
                )}
              </div>

              <h2 className="pixel-text-shadow mb-1 truncate font-heading text-lg text-[#fffffe] sm:text-xl">
                {TODAYS_WORKOUT.title}
              </h2>
              <p className="mb-4 text-sm text-muted">
                ~{TODAYS_WORKOUT.estMinutes} min &middot; ~{TODAYS_WORKOUT.estCalories} kcal &middot; {totalCount}{" "}
                exercises
              </p>

              <div className="mb-4 border-2 border-border bg-ink/60 p-3 pixel-corners-sm">
                <div className="mb-1.5 flex items-center justify-between font-heading text-[9px] uppercase tracking-widest text-muted">
                  <span>Workout Progress</span>
                  <span className="text-accent-light">{progressPct}%</span>
                </div>
                <div className={`h-3 w-full overflow-hidden border-2 border-border bg-ink pixel-corners-sm ${progressPct >= 100 ? "animate-glow-pulse" : ""}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-accent to-accent-light"
                  />
                </div>
                <p className="mt-1.5 text-sm text-muted">
                  {completedCount} of {totalCount} exercises &middot; +{earnedXP} XP &middot; +{earnedCoins}{" "}
                  coins earned
                </p>
              </div>

              <div className="w-full sm:w-56">
                <PixelButton
                  variant={workoutStarted ? "ghost" : "primary"}
                  icon={<DumbbellIcon size={16} />}
                  onClick={handleStartWorkout}
                >
                  {workoutStarted ? "Pause Workout" : "Start Workout"}
                </PixelButton>
              </div>
            </div>
          </div>
        </PixelCard>

        {/* Category filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c.key} type="button" onClick={() => setCategory(c.key)}>
              <span
                className={`pixel-corners-sm flex items-center gap-1.5 border-2 px-2.5 py-1.5 font-heading text-[9px] uppercase tracking-widest transition-colors ${
                  category === c.key
                    ? "border-accent bg-accent/20 text-accent-light"
                    : "border-border bg-panel text-muted hover:border-border-light hover:text-[#fffffe]"
                }`}
              >
                <c.icon size={12} />
                {c.label}
              </span>
            </button>
          ))}
        </div>

        {/* Exercise cards */}
        <section>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onToggle={toggleExercise}
                onPreview={handlePreview}
                isPreviewing={previewExerciseId === exercise.id}
              />
            ))}
          </div>
          {visibleExercises.length === 0 && (
            <EmptyState
              icon={<DumbbellIcon size={22} />}
              title="No Exercises Here"
              description="Nothing in this category today. Try a different filter or check back tomorrow's workout."
            />
          )}
        </section>

        <EmotesPanel
          emotes={EMOTES}
          unlockedIds={unlockedEmoteIds}
          activeEmoteId={activeEmoteId}
          onSelect={setActiveEmoteId}
        />
      </div>

      <QuestCompleteModal
        isOpen={!!completionReward}
        onClose={closeCompletionModal}
        exerciseName={completionReward?.name}
        xp={completionReward?.xp ?? 0}
        coins={completionReward?.coins ?? 0}
      />

      <EmoteUnlockModal
        isOpen={!!emoteUnlockAnnounce}
        emote={emoteUnlockAnnounce}
        onClose={() => setEmoteUnlockAnnounce(null)}
      />
    </div>
  );
}
