import { useAuth } from "../context/AuthContext";
import { useProgression } from "../context/ProgressionContext";
import PixelCard from "../components/PixelCard";
import Badge from "../components/Badge";
import StatCard from "../components/StatCard";
import XPBar from "../components/XPBar";
import GameNav from "../components/GameNav";
import {
  ScaleIcon,
  TargetIcon,
  TrophyIcon,
  FlameIcon,
  ChartIcon,
  DumbbellIcon,
} from "../components/icons/PixelIcons";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

// ---------------------------------------------------------------------
// Level/XP/streak come from ProgressionContext (real, per-user, persisted
// state — same source Dashboard uses). The weight/consistency charts
// below remain frontend-only mock data: there's no weight-logging or
// workout-history feature built yet for them to read from.
// ---------------------------------------------------------------------

const WEIGHT = { current: 78.4, goal: 72, start: 84.2, unit: "kg" };

const WEIGHT_HISTORY = [
  { week: "Wk 1", weight: 84.2 },
  { week: "Wk 2", weight: 83.5 },
  { week: "Wk 3", weight: 82.6 },
  { week: "Wk 4", weight: 81.4 },
  { week: "Wk 5", weight: 80.5 },
  { week: "Wk 6", weight: 79.6 },
  { week: "Wk 7", weight: 78.9 },
  { week: "Wk 8", weight: 78.4 },
];

const CONSISTENCY = [
  { week: "Wk 1", workouts: 3 },
  { week: "Wk 2", workouts: 4 },
  { week: "Wk 3", workouts: 4 },
  { week: "Wk 4", workouts: 5 },
  { week: "Wk 5", workouts: 4 },
  { week: "Wk 6", workouts: 6 },
  { week: "Wk 7", workouts: 5 },
  { week: "Wk 8", workouts: 6 },
];

const WEEKLY_TARGET = 6;
// "Longest streak" isn't tracked anywhere yet (only the current streak
// is real progression data), so it stays a mock placeholder for now.
const MOCK_LONGEST_STREAK = 14;

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="pixel-corners-sm border-2 border-border-light bg-panel-raised px-2.5 py-1.5 font-heading text-[9px] uppercase tracking-widest text-[#fffffe]">
      <p className="mb-0.5 text-muted">{label}</p>
      <p>
        {payload[0].value}
        {unit}
      </p>
    </div>
  );
}

function SectionHeading({ icon, title }) {
  return (
    <div className="mb-3 flex items-center gap-2 border-b-2 border-border pb-2">
      {icon}
      <h2 className="pixel-text-shadow font-heading text-xs uppercase tracking-widest text-[#fffffe] sm:text-sm">
        {title}
      </h2>
    </div>
  );
}

export default function Progress() {
  const { user } = useAuth();
  const { level, currentXP, xpToNextLevel, streak } = useProgression();
  const consistencyPct = Math.round(
    (CONSISTENCY[CONSISTENCY.length - 1].workouts / WEEKLY_TARGET) * 100
  );
  const totalLost = (WEIGHT.start - WEIGHT.current).toFixed(1);

  return (
    <div className="relative z-10 min-h-screen px-4 py-6 pb-16 text-[#fffffe] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4">
          <p className="font-heading text-[9px] uppercase tracking-widest text-muted">FitCraft RPG</p>
          <h1 className="pixel-text-shadow font-heading text-base text-[#fffffe] sm:text-lg">
            {user?.username ? `${user.username}'s Progress` : "Progress"}
          </h1>
        </header>

        <GameNav />

        {/* Stat cards */}
        <section className="mb-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={<ScaleIcon size={18} />}
              label="Current Weight"
              value={`${WEIGHT.current} ${WEIGHT.unit}`}
              sublabel={`-${totalLost} ${WEIGHT.unit} so far`}
              accent="accent"
            />
            <StatCard
              icon={<TargetIcon size={18} />}
              label="Goal Weight"
              value={`${WEIGHT.goal} ${WEIGHT.unit}`}
              sublabel={`${(WEIGHT.current - WEIGHT.goal).toFixed(1)} ${WEIGHT.unit} to go`}
              accent="xp"
            />
            <StatCard
              icon={<FlameIcon size={18} />}
              label="Current Streak"
              value={`${streak} days`}
              sublabel={`Longest: ${MOCK_LONGEST_STREAK} days`}
              accent="hp"
            />
            <StatCard
              icon={<TrophyIcon size={18} />}
              label="Consistency"
              value={`${consistencyPct}%`}
              sublabel={`${CONSISTENCY[CONSISTENCY.length - 1].workouts}/${WEEKLY_TARGET} this week`}
              accent="gold"
            />
          </div>
        </section>

        {/* XP progression */}
        <section className="mb-6">
          <SectionHeading icon={<DumbbellIcon size={18} />} title="XP Progression" />
          <PixelCard variant="panel">
            <XPBar level={level} currentXP={currentXP} xpToNextLevel={xpToNextLevel} />
          </PixelCard>
        </section>

        {/* Weight trend chart */}
        <section className="mb-6">
          <SectionHeading icon={<ChartIcon size={18} />} title="Weight Trend" />
          <PixelCard variant="panel">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-muted">Last 8 weeks</p>
              <Badge variant="xp" size="sm">
                Goal: {WEIGHT.goal} {WEIGHT.unit}
              </Badge>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WEIGHT_HISTORY} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#3f4d81" strokeDasharray="2 2" />
                  <XAxis dataKey="week" tick={{ fill: "#8891b8", fontSize: 10 }} axisLine={{ stroke: "#3f4d81" }} tickLine={false} />
                  <YAxis
                    domain={["dataMin - 2", "dataMax + 2"]}
                    tick={{ fill: "#8891b8", fontSize: 10 }}
                    axisLine={{ stroke: "#3f4d81" }}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip unit={` ${WEIGHT.unit}`} />} />
                  <ReferenceLine y={WEIGHT.goal} stroke="#fde047" strokeDasharray="4 4" />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3ecf5f"
                    strokeWidth={2}
                    dot={{ fill: "#86efac", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </PixelCard>
        </section>

        {/* Workout consistency chart */}
        <section>
          <SectionHeading icon={<TrophyIcon size={18} />} title="Workout Consistency" />
          <PixelCard variant="panel">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-muted">Workouts per week</p>
              <Badge variant="success" size="sm">
                Target: {WEEKLY_TARGET}/week
              </Badge>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CONSISTENCY} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#3f4d81" strokeDasharray="2 2" />
                  <XAxis dataKey="week" tick={{ fill: "#8891b8", fontSize: 10 }} axisLine={{ stroke: "#3f4d81" }} tickLine={false} />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#8891b8", fontSize: 10 }}
                    axisLine={{ stroke: "#3f4d81" }}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip unit=" workouts" />} />
                  <ReferenceLine y={WEEKLY_TARGET} stroke="#fde047" strokeDasharray="4 4" />
                  <Bar dataKey="workouts" fill="#3ecf5f" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PixelCard>
        </section>
      </div>
    </div>
  );
}
