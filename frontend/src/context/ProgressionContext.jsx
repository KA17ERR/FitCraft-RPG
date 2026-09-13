import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { DEFAULT_UNLOCKED_EMOTE_IDS } from "../utils/emotes";

const ProgressionContext = createContext(null);

// Local calendar day (not UTC) — same helper WaterContext uses, so "a new
// day" for daily quests lines up with the user's clock.
function todayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Every brand-new account starts here. This is the ONLY place these
// numbers should be defined — Dashboard/Progress/Workout all read from
// this context instead of keeping their own hardcoded "mock player".
const DEFAULT_PROGRESSION = {
  level: 1,
  currentXP: 0,
  xpToNextLevel: 100,
  totalXPEarned: 0,
  coins: 50, // starting coins for a new hero
  streak: 0,
  exercisesCompleted: 0,
  workoutsCompleted: 0,
  unlockedEmoteIds: DEFAULT_UNLOCKED_EMOTE_IDS,
  // Fitness/progress history — a running log of XP-earning events
  // (exercise, workout, quest, ...). Capped so it can't grow forever.
  history: [],
  // Today's daily-quest completion, scoped to a calendar day so it rolls
  // over automatically instead of being reset by a page mount.
  dailyQuestDate: null,
  dailyQuestStatuses: {},
};

const MAX_HISTORY_ENTRIES = 200;

function storageKey(userId) {
  return `fitcraft_progression_${userId}`;
}

function readProgressionForUser(userId) {
  if (!userId) return DEFAULT_PROGRESSION;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) {
      // First time this user has ever been seen on this device — this is
      // the "account creation" moment for progression purposes. Persist
      // the defaults immediately so nothing else can race ahead of it.
      localStorage.setItem(storageKey(userId), JSON.stringify(DEFAULT_PROGRESSION));
      return DEFAULT_PROGRESSION;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROGRESSION, ...(parsed && typeof parsed === "object" ? parsed : {}) };
  } catch {
    return DEFAULT_PROGRESSION;
  }
}

/**
 * ProgressionProvider — the single source of truth for the logged-in
 * user's whole "journey": level/XP/total XP earned/coins/streak/
 * exercises & workouts completed/unlocked emotes/daily quest status/
 * a fitness history log. Persisted in localStorage keyed by user id
 * (same technique as CharacterContext and WaterContext), so:
 *   - a brand-new account always starts at the defaults above,
 *   - refreshing the browser or navigating away and back never loses
 *     progress (it's read from storage, not a plain JS variable),
 *   - logging out and back in as the same user restores their exact
 *     progression, and
 *   - a second account never sees the first account's numbers.
 *
 * All mutations go through `updateProgression` (a plain setState-style
 * updater) or `awardXP` (the one place XP/level-up/coin/history math
 * happens) so there is exactly one code path for "give the player XP" —
 * callers never re-implement the level-up loop themselves.
 */
export function ProgressionProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || null;

  const [loadedForUserId, setLoadedForUserId] = useState(userId);
  const [progression, setProgression] = useState(() => readProgressionForUser(userId));

  // Re-derive state during render whenever the signed-in user changes —
  // same pattern CharacterContext uses to avoid a frame of stale/mixed
  // data when switching accounts.
  if (userId !== loadedForUserId) {
    setLoadedForUserId(userId);
    setProgression(readProgressionForUser(userId));
  }

  const persist = useCallback(
    (next) => {
      if (!userId) return;
      try {
        localStorage.setItem(storageKey(userId), JSON.stringify(next));
      } catch {
        // ignore storage failures (e.g. private browsing quota)
      }
    },
    [userId]
  );

  // Generic updater: pass a partial object or an updater function, same
  // shape as React's setState. Every mutation goes through here so
  // persistence never drifts out of sync with in-memory state.
  const updateProgression = useCallback(
    (updater) => {
      setProgression((prev) => {
        const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  // The one place XP is ever added and levels are ever resolved. `amount`
  // is the XP to award; `coins` are added alongside it; `source` is a
  // short label for the history log ("exercise:pushups", "quest:water",
  // "workout", ...). `merge(prev)` lets a caller fold in its own counter
  // bump (exercisesCompleted, workoutsCompleted, unlockedEmoteIds, ...)
  // atomically, in the same update, using the freshest `prev`.
  // `onLevelUp(newLevel)` fires (synchronously, during the update) if and
  // only if the XP threshold was actually crossed — level never
  // increases on its own without XP reaching xpToNextLevel.
  const awardXP = useCallback(
    (amount, { coins = 0, source = "unknown", merge, onLevelUp } = {}) => {
      if (!Number.isFinite(amount) || amount === 0) return;
      updateProgression((prev) => {
        let { level, currentXP, xpToNextLevel } = prev;
        currentXP += amount;
        let leveledUp = false;
        while (currentXP >= xpToNextLevel) {
          currentXP -= xpToNextLevel;
          level += 1;
          xpToNextLevel = Math.round(xpToNextLevel * 1.15);
          leveledUp = true;
        }
        if (leveledUp && onLevelUp) onLevelUp(level);

        const mergedExtra = typeof merge === "function" ? merge(prev) : merge || {};
        const historyEntry = { date: new Date().toISOString(), source, xp: amount, coins };
        const history = [...prev.history, historyEntry].slice(-MAX_HISTORY_ENTRIES);

        return {
          ...prev,
          ...mergedExtra,
          level,
          currentXP,
          xpToNextLevel,
          totalXPEarned: prev.totalXPEarned + amount,
          coins: prev.coins + coins,
          history,
        };
      });
    },
    [updateProgression]
  );

  // Today's daily-quest completion map, auto-reset once the calendar day
  // rolls over (so a stale "completed" from yesterday never lingers).
  const dailyQuestStatuses = progression.dailyQuestDate === todayKey() ? progression.dailyQuestStatuses : {};

  const setQuestStatus = useCallback(
    (questId, status) => {
      updateProgression((prev) => {
        const isToday = prev.dailyQuestDate === todayKey();
        const statuses = { ...(isToday ? prev.dailyQuestStatuses : {}), [questId]: status };
        return { ...prev, dailyQuestDate: todayKey(), dailyQuestStatuses: statuses };
      });
    },
    [updateProgression]
  );

  const resetProgression = useCallback(() => {
    updateProgression(() => ({ ...DEFAULT_PROGRESSION }));
  }, [updateProgression]);

  const value = useMemo(
    () => ({
      ...progression,
      dailyQuestStatuses,
      updateProgression,
      awardXP,
      setQuestStatus,
      resetProgression,
    }),
    [progression, dailyQuestStatuses, updateProgression, awardXP, setQuestStatus, resetProgression]
  );

  return <ProgressionContext.Provider value={value}>{children}</ProgressionContext.Provider>;
}

export function useProgression() {
  const ctx = useContext(ProgressionContext);
  if (!ctx) throw new Error("useProgression must be used within a ProgressionProvider");
  return ctx;
}
