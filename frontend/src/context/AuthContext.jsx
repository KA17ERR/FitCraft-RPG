import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/client";

const AuthContext = createContext(null);
const TOKEN_KEY = "fitcraft_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { user: freshUser } = await authApi.me(token);
        if (!cancelled) setUser(freshUser);
      } catch {
        if (!cancelled) {
          setToken(null);
          localStorage.removeItem(TOKEN_KEY);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signup = useCallback(async (payload) => {
    const { token: newToken, user: newUser } = await authApi.signup(payload);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const login = useCallback(async (payload) => {
    const { token: newToken, user: newUser } = await authApi.login(payload);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) await authApi.logout(token);
    } catch {
      // ignore network errors on logout, still clear local state
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    isLoading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
