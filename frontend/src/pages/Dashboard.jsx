import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useWater } from "../context/WaterContext";
import { useCharacter } from "../context/CharacterContext";
import { useProgression } from "../context/ProgressionContext";
import PixelButton from "../components/PixelButton";
import PixelCard from "../components/PixelCard";
import Badge from "../components/Badge";
import XPBar from "../components/XPBar";
import QuestCard from "../components/QuestCard";
import GameNav from "../components/GameNav";
import LevelUpModal from "../components/LevelUpModal";
import ExerciseAnimation from "../components/ExerciseAnimation";
import WorkoutPanel from "../components/WorkoutPanel";
import {
  CoinIcon,
  FlameIcon,
  StarIcon,
  SwordIcon,
  ShieldIcon,
  HeartIcon,
  DumbbellIcon,
  WaterDropIcon,
  AppleIcon,
  ChartIcon,
  QuestIcon,
} from "../components/icons/PixelIcons";

// ---------------------------------------------------------------------
// Level/XP/coins/streak all come from ProgressionContext now (per-user,
// persisted, initialized to Level 1 / 0 XP the first time an account is
// seen). Quests below are still frontend-only mock data for Round 2.
// ---------------------------------------------------------------------

// No real "fitness goal" source of truth is wired up yet (it isn't part
// of progression), so this stays a display-only fallback label.
const FALLBACK_FITNESS_GOAL = "Get Fit";

const INITIAL_STATS = [
  { key: "strength", label: "Strength", value: 72, icon: SwordIcon, accent: "hp" },
  { key: "endurance", label: "Endurance", value: 65, icon: FlameIcon, accent: "gold" },
  { key: "health", label: "Health", value: 88, icon: HeartIcon, accent: "success" },
  { key: "discipline", label: "Discipline", value: 54, icon: ShieldIcon, accent: "xp" },
];

const INITIAL_QUESTS = [
  {
    id: "workout",
    title: "Morning Workout",
    description: "Complete a 30-minute strength session.",
    difficulty: "medium",
    xpReward: 50,
    coinReward: 20,
    status: "active",
  },
  {
    id: "water",
    title: "Drink Water",
    description: "Reach 8 cups (2L) of water today. 5 / 8 logged so far.",
    difficulty: "easy",
    xpReward: 20,
    coinReward: 10,
    status: "active",
  },
  {
    id: "meals",
    title: "Log Meals",
    description: "Track breakfast, lunch, and dinner.",
    difficulty: "easy",
    xpReward: 30,
    coinReward: 15,
    status: "completed",
  },
  {
    id: "activity",
    title: "Daily Activity",
    description: "Hit 8,000 steps before midnight. 5,200 logged so far.",
    difficulty: "hard",
    xpReward: 60,
    coinReward: 25,
    status: "active",
  },
];

// "workout" and "food" navigate into their real, full-featured screens
// (Workout/Nutrition) instead of toasting a fake result — see
// handleQuickAction. "water" and "weight" have no dedicated flow to hand
// off to yet, so they keep the lightweight toast-only behavior.
const QUICK_ACTIONS = [
  {
    key: "workout",
    label: "Start Workout",
    icon: DumbbellIcon,
    variant: "primary",
  },
  {
    key: "food",
    label: "Log Food",
    icon: AppleIcon,
    variant: "secondary",
  },
  {
    key: "water",
    label: "Drink Water",
    icon: WaterDropIcon,
    variant: "secondary",
    toastTitle: "+1 Cup of Water",
    toastDescription: "Stay hydrated, stay strong.",
    toastType: "default",
  },
  {
    key: "weight",
    label: "Log Weight",
    icon: ChartIcon,
    variant: "ghost",
    toastTitle: "Weight Logged!",
    toastDescription: "Progress saved to your journal.",
    toastType: "default",
  },
];

const STAT_BAR_GRADIENT = {
  hp: "from-hp to-[#ff9d9d]",
  gold: "from-gold to-xp-light",
  success: "from-success to-accent-light",
  xp: "from-xp to-xp-light",
};

function SectionHeading({ icon, title, sublabel }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2 border-b-2 border-border pb-2">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="pixel-text-shadow font-heading text-xs uppercase tracking-widest text-[#fffffe] sm:text-sm">
          {title}
        </h2>
      </div>
      {sublabel && (
        <span className="font-heading text-[9px] uppercase tracking-widest text-muted">{sublabel}</span>
      )}
    </div>
  );
}

function StatBar({ label, value, icon: Icon, accent }) {
  return (
    <PixelCard interactive>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-border bg-ink pixel-corners-sm">
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-[8px] uppercase tracking-widest text-muted">{label}</p>
          <p className="font-heading text-sm text-[#fffffe]">
            {value}
            <span className="text-muted">/100</span>
          </p>
        </div>
      </div>
      <div className={`h-2.5 w-full overflow-hidden border-2 border-border bg-ink pixel-corners-sm ${value >= 100 ? "animate-glow-pulse" : ""}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${STAT_BAR_GRADIENT[accent] || STAT_BAR_GRADIENT.xp}`}
        />
      </div>
    </PixelCard>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { addWater } = useWater();
  // Same saved build the Character Creator and every in-game sprite read
  // from, so a customization change shows up here immediately.
  const { character } = useCharacter();
  const { level, currentXP, xpToNextLevel, coins, streak, dailyQuestStatuses, awardXP, setQuestStatus } =
    useProgression();
  const navigate = useNavigate();
  const [quests, setQuests] = useState(() =>
    INITIAL_QUESTS.map((q) => ({ ...q, status: dailyQuestStatuses[q.id] || q.status }))
  );
  const [celebratingId, setCelebratingId] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const player = { level, currentXP, xpToNextLevel, coins, streak, fitnessGoal: FALLBACK_FITNESS_GOAL };
  // Whether the embedded workout session is playing inside the hero panel
  // (see WorkoutPanel below). Starting a workout never navigates away or
  // opens a modal — it swaps the panel's own content in place, so the gym
  // world stays visible the whole time.
  const [workoutActive, setWorkoutActive] = useState(false);

  const completedCount = quests.filter((q) => q.status === "completed").length;
  const progressPct = Math.round((completedCount / quests.length) * 100);

  // Every quest — including "Morning Workout" — is completed the same
  // way, from its own QuestCard "Complete Quest" button. The actual
  // workout and food-logging play out on their own full screens (see
  // handleQuickAction below); this board is just the day's checklist.
  function handleQuestAction(quest) {
    setQuests((prev) => {
      const next = prev.map((q) => (q.id === quest.id ? { ...q, status: "completed" } : q));
      // If that was the last active quest, the board just went from "not
      // done" to "all done" — worth a bigger celebration than a toast.
      const allDone = next.every((q) => q.status === "completed");
      const wasAllDone = prev.every((q) => q.status === "completed");
      if (allDone && !wasAllDone) {
        setTimeout(() => setShowLevelUp(true), 900);
      }
      return next;
    });
    setQuestStatus(quest.id, "completed");

    awardXP(quest.xpReward, {
      coins: quest.coinReward,
      source: `quest:${quest.id}`,
      onLevelUp: () => setTimeout(() => setShowLevelUp(true), 900),
    });

    setCelebratingId(quest.id);
    setTimeout(() => setCelebratingId(null), 1400);

    showToast({
      title: "Quest Complete!",
      description: `+${quest.xpReward} XP, +${quest.coinReward} coins`,
      type: "xp",
      duration: 3200,
    });
  }

  // "Log Food" hands off to the full Nutrition screen (opening its Add
  // Food modal immediately so the hand-off feels continuous). "Start
  // Workout" no longer navigates anywhere — the workout plays out right
  // here in the hero panel (see WorkoutPanel below / handleStartWorkout).
  function handleQuickAction(action) {
    if (action.key === "workout") {
      handleStartWorkout();
      return;
    }
    if (action.key === "food") {
      navigate("/nutrition", { state: { openAddFood: true } });
      return;
    }
    if (action.key === "water") {
      // Same shared total the Water page reads/writes, so a cup logged
      // here shows up there too (and vice versa) with no drift.
      addWater(250);
    }
    showToast({
      title: action.toastTitle,
      description: action.toastDescription,
      type: action.toastType,
    });
  }

  // Swaps the hero panel from its idle stance into the live workout
  // session. The character "enters the workout area" via the panel's own
  // enter/exit transition below rather than a page change or overlay.
  function handleStartWorkout() {
    setWorkoutActive(true);
    showToast({
      title: "Workout Started!",
      description: "Time to earn some XP out there.",
      type: "xp",
    });
  }

  // "End Workout" — bail out early with no rewards, back to the idle hero.
  function handleWorkoutExit() {
    setWorkoutActive(false);
  }

  // "Claim Rewards" at the end of the workout — award the XP, mark the
  // Morning Workout quest complete (if it wasn't already), and return to
  // the idle hero panel.
  function handleWorkoutFinish({ totalXP = 0 } = {}) {
    awardXP(totalXP, {
      source: "workout",
      merge: (prev) => ({ workoutsCompleted: prev.workoutsCompleted + 1 }),
      onLevelUp: () => setTimeout(() => setShowLevelUp(true), 900),
    });

    setQuests((prev) => {
      const target = prev.find((q) => q.id === "workout");
      if (!target || target.status === "completed") return prev;
      return prev.map((q) => (q.id === "workout" ? { ...q, status: "completed" } : q));
    });
    setQuestStatus("workout", "completed");

    showToast({
      title: "Workout Complete!",
      description: `+${totalXP} XP earned. Great work, hero.`,
      type: "xp",
      duration: 3200,
    });

    setWorkoutActive(false);
  }

  return (
    <div className="relative z-10 min-h-screen px-4 py-6 pb-16 text-[#fffffe] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-heading text-[9px] uppercase tracking-widest text-muted">FitCraft RPG</p>
            <h1 className="pixel-text-shadow truncate font-heading text-base text-[#fffffe] sm:text-lg">
              Welcome back, {user?.username || "Hero"}!
            </h1>
          </div>
          <div className="w-28 shrink-0">
            <PixelButton variant="ghost" size="sm" onClick={logout}>
              Log Out
            </PixelButton>
          </div>
        </header>

        <GameNav />

        {/* Home base / hero panel — the strongest visual on the screen.
            The living gym scene lives once, globally, in RPGWorldBackground
            (see App.jsx), so this panel is just its normal opaque PixelCard
            — it stays visible behind/around this panel the whole time.
            "Start Workout" swaps this panel's own content from the idle
            status view straight into the live WorkoutPanel session (see
            handleStartWorkout) — never a navigation or an overlay — so the
            hero visibly steps into the workout right inside this same RPG
            world panel, then steps back out when the session ends. */}
        <PixelCard variant="accent" className="mb-6 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {workoutActive ? (
              <motion.div
                key="workout"
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -36 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <WorkoutPanel
                  character={character}
                  onExit={handleWorkoutExit}
                  onFinish={handleWorkoutFinish}
                />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, x: -36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 36 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center"
              >
                {/* Large pixel character, standing on the gym floor */}
                <div className="relative mx-auto flex h-56 w-36 items-end justify-center sm:h-72 sm:w-48">
                  <div
                    aria-hidden="true"
                    className="absolute bottom-5 h-3 w-4/5 rounded-full bg-black/40 blur-[2px]"
                  />
                  <div className="absolute bottom-0 h-4 w-full border-2 border-border bg-panel-raised pixel-corners-sm" />
                  <ExerciseAnimation
                    exercise="idle"
                    character={character}
                    className="relative z-10 h-[92%] w-[85%]"
                  />
                </div>

                {/* Player info */}
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="accent" size="md" icon={<StarIcon size={12} />}>
                      Lv. {player.level}
                    </Badge>
                    <Badge variant="gold" size="md" icon={<CoinIcon size={12} />}>
                      {player.coins.toLocaleString()}
                    </Badge>
                    <Badge variant="danger" size="md" icon={<FlameIcon size={12} />}>
                      {player.streak}-day streak
                    </Badge>
                  </div>

                  <h2 className="pixel-text-shadow mb-1 truncate font-heading text-lg text-[#fffffe] sm:text-xl">
                    {user?.username || "Hero"}
                  </h2>
                  <p className="mb-4 flex items-center gap-1.5 font-heading text-[10px] uppercase tracking-widest text-accent-light">
                    <QuestIcon size={12} /> Goal: {player.fitnessGoal}
                  </p>

                  <XPBar
                    level={player.level}
                    currentXP={player.currentXP}
                    xpToNextLevel={player.xpToNextLevel}
                    className="mb-4"
                  />

                  <div className="border-2 border-border bg-ink/60 p-3 pixel-corners-sm">
                    <div className="mb-1.5 flex items-center justify-between font-heading text-[9px] uppercase tracking-widest text-muted">
                      <span>Today&apos;s Progress</span>
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
                      {completedCount} of {quests.length} quests complete
                    </p>
                  </div>

                  <div className="mt-4 sm:w-56">
                    <PixelButton variant="primary" icon={<DumbbellIcon size={16} />} onClick={handleStartWorkout}>
                      Start Workout
                    </PixelButton>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </PixelCard>

        {/* Quest board */}
        <section className="mb-6">
          <SectionHeading
            icon={<QuestIcon size={18} />}
            title="Quest Board"
            sublabel={`${completedCount}/${quests.length} complete today`}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {quests.map((quest) => (
              <QuestCard
                key={quest.id}
                title={quest.title}
                description={quest.description}
                difficulty={quest.difficulty}
                xpReward={quest.xpReward}
                coinReward={quest.coinReward}
                status={quest.status}
                actionLabel="Complete Quest"
                celebrate={celebratingId === quest.id}
                onAction={quest.status === "completed" ? undefined : () => handleQuestAction(quest)}
              />
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-6">
          <SectionHeading icon={<SwordIcon size={18} />} title="Hero Stats" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INITIAL_STATS.map((stat) => (
              <StatBar key={stat.key} label={stat.label} value={stat.value} icon={stat.icon} accent={stat.accent} />
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <SectionHeading icon={<StarIcon size={18} />} title="Quick Actions" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {QUICK_ACTIONS.map((action) => (
              <PixelButton
                key={action.key}
                variant={action.variant}
                icon={<action.icon size={16} />}
                onClick={() => handleQuickAction(action)}
              >
                {action.label}
              </PixelButton>
            ))}
          </div>
        </section>
      </div>

      <LevelUpModal
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        title="Quest Board Cleared!"
        description="Every quest on today's board is complete. New quests will roll in tomorrow — keep the streak alive!"
      />
    </div>
  );
}
