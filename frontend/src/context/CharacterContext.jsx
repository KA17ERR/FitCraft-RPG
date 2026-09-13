import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { DEFAULT_CHARACTER, CHARACTER_VISUAL_KEYS } from "../utils/characterOptions";

const CharacterContext = createContext(null);

function storageKey(userId) {
  return `fitcraft_character_${userId}`;
}

function readCharacterForUser(userId) {
  if (!userId) return { fullData: null, completed: false };
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return { fullData: null, completed: false };
    const parsed = JSON.parse(raw);
    return {
      fullData: parsed && typeof parsed === "object" ? parsed.data || null : null,
      completed: Boolean(parsed && parsed.completed),
    };
  } catch {
    return { fullData: null, completed: false };
  }
}

function pickVisual(data) {
  if (!data) return null;
  const out = {};
  CHARACTER_VISUAL_KEYS.forEach((key) => {
    if (data[key] !== undefined) out[key] = data[key];
  });
  return out;
}

/**
 * CharacterProvider — the single source of truth for the logged-in user's
 * saved hero, shared by Character Creation, the Dashboard/home character,
 * and every in-game sprite (workouts, emotes, quest-complete celebration).
 *
 * Persisted in localStorage keyed by user id (same technique as
 * AuthContext's token and WaterContext's daily total), so it survives
 * refreshes and logout/login, and never bleeds between accounts.
 */
export function CharacterProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || null;

  const [loadedForUserId, setLoadedForUserId] = useState(userId);
  const [state, setState] = useState(() => readCharacterForUser(userId));

  // Re-derive state during render (not in an effect) whenever the signed-in
  // user changes — e.g. hydrating after login, or clearing out on logout.
  // This is React's documented pattern for resetting state in response to a
  // changing "key" value: calling setState mid-render here bails out the
  // current render and re-renders immediately with correct data, so there's
  // no in-between frame where the wrong user's character (or none) briefly
  // shows before the real value loads.
  if (userId !== loadedForUserId) {
    setLoadedForUserId(userId);
    setState(readCharacterForUser(userId));
  }

  const saveCharacter = useCallback(
    (data) => {
      if (!userId) return;
      const next = { fullData: data, completed: true };
      setState(next);
      try {
        localStorage.setItem(storageKey(userId), JSON.stringify({ data, completed: true }));
      } catch {
        // ignore storage failures (e.g. private browsing quota)
      }
    },
    [userId]
  );

  const visual = pickVisual(state.fullData);

  const value = useMemo(
    () => ({
      // Always a complete, renderable character — falls back to the shared
      // default so the Dashboard/sprites always have *something* to draw,
      // even before creation finishes.
      character: { ...DEFAULT_CHARACTER, ...(visual || {}) },
      // The full onboarding payload (profile/goal/customization/journey),
      // or null if nothing has been saved yet — used by CharacterCreate to
      // resume/edit an existing hero instead of starting blank.
      fullData: state.fullData,
      hasCharacter: state.completed,
      saveCharacter,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, saveCharacter]
  );

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error("useCharacter must be used within a CharacterProvider");
  return ctx;
}
