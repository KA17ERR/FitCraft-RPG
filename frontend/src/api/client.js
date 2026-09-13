// In production (Netlify) the API is served from the same site via
// netlify.toml's /api/* redirect, so the relative "/api" default just
// works with zero config. Local development overrides this via
// frontend/.env (VITE_API_URL=http://localhost:5000/api).
const API_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. some error responses) — leave data as null
  }

  if (!res.ok) {
    const message = data?.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  logout: (token) => request("/auth/logout", { method: "POST", token }),
  me: (token) => request("/auth/me", { method: "GET", token }),
  saveCharacter: (token, character) =>
    request("/auth/character", { method: "PUT", token, body: { character } }),
};

export const healthApi = {
  check: () => request("/health"),
};
