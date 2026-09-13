import { createContext, useCallback, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { authApi } from "../api/client";
import { DEFAULT_CHARACTER, CHARACTER_VISUAL_KEYS } from "../utils/characterOptions";

const CharacterContext = createContext(null);

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
 * Character data and completion status live on the ACCOUNT itself
 * (`user.character` / `user.characterCompleted`, returned by the backend
 * on signup/login/me — see backend/src/routes/auth.routes.js), not in a
 * component-local React state variable and not only in browser storage.
 * That's what makes "has this account finished character creation?"
 * survive a refresh, a logout/login, and even logging in from a
 * different browser — AuthContext already reloads the user's full
 * profile (including character data) on every login and on every app
 * load via `/auth/me`, so this context only needs to read from `user`.
 */
export function CharacterProvider({ children }) {
  const { user, token, patchUser } = useAuth();

  const fullData = user?.character || null;
  const hasCharacter = Boolean(user?.characterCompleted);
  const visual = pickVisual(fullData);

  const saveCharacter = useCallback(
    async (data) => {
      if (!token) return;
      // Persist to the account record on the backend first — this is the
      // durable, per-account store. Only once that succeeds do we reflect
      // it locally, so the UI never claims "saved" when it wasn't.
      const { user: updatedUser } = await authApi.saveCharacter(token, data);
      patchUser({ character: updatedUser.character, characterCompleted: updatedUser.characterCompleted });
    },
    [token, patchUser]
  );

  const value = useMemo(
    () => ({
      // Always a complete, renderable character — falls back to the shared
      // default so the Dashboard/sprites always have *something* to draw,
      // even before creation finishes.
      character: { ...DEFAULT_CHARACTER, ...(visual || {}) },
      // The full onboarding payload (profile/goal/customization/journey),
      // or null if nothing has been saved yet — used by CharacterCreate to
      // resume/edit an existing hero instead of starting blank.
      fullData,
      hasCharacter,
      saveCharacter,
    }),
    [fullData, hasCharacter, visual, saveCharacter]
  );

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error("useCharacter must be used within a CharacterProvider");
  return ctx;
}
