import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const WaterContext = createContext(null);

const STORAGE_KEY = "fitcraft_water_log";
export const DAILY_GOAL_ML = 2500;

function todayKey() {
  // Local calendar day (not UTC), so "new day" lines up with the user's clock.
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function readStoredConsumed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    // Only carry over the amount if it belongs to *today*. Anything from a
    // previous day is stale and the day should start back at 0.
    if (parsed && parsed.date === todayKey() && Number.isFinite(parsed.consumed)) {
      return parsed.consumed;
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * WaterProvider — single source of truth for today's water total, shared by
 * the Dashboard quick action and the Water page so they can never drift out
 * of sync. Backed by localStorage and scoped to the current calendar day:
 * the very first read of the day (and any read on a new day) resets to 0,
 * and after that the total only ever changes via explicit addWater/reset
 * calls — never as a side effect of mounting or navigating.
 */
export function WaterProvider({ children }) {
  // Lazy initializer: runs once on mount and resolves the correct value for
  // "now" up front, so there's no follow-up effect that writes a default
  // value back into state (that pattern is what causes duplicate/incorrect
  // increments when a component mounts more than once).
  const [consumed, setConsumed] = useState(readStoredConsumed);

  // Persist whenever the amount changes. This never fires on its own; it
  // only runs after setConsumed is called explicitly by addWater/resetToday.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), consumed }));
    } catch {
      // ignore storage failures (e.g. private browsing quota)
    }
  }, [consumed]);

  const addWater = useCallback((amount) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setConsumed((prev) => prev + amount);
  }, []);

  const resetToday = useCallback(() => {
    setConsumed(0);
  }, []);

  const value = useMemo(
    () => ({ consumed, dailyGoal: DAILY_GOAL_ML, addWater, resetToday }),
    [consumed, addWater, resetToday]
  );

  return <WaterContext.Provider value={value}>{children}</WaterContext.Provider>;
}

export function useWater() {
  const ctx = useContext(WaterContext);
  if (!ctx) throw new Error("useWater must be used within a WaterProvider");
  return ctx;
}
