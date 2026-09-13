// Shared client-side validation for the auth pages. Mirrors the backend's
// own rules (see backend/src/routes/auth.routes.js) so a hero never sees a
// friendly client message that disagrees with the server's response.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_-]+$/;

export function validateEmail(email) {
  const value = (email || "").trim();
  if (!value) return "Your email is required to enter the realm";
  if (!EMAIL_RE.test(value)) return "That doesn't look like a valid email address";
  return "";
}

export function validateLoginPassword(password) {
  if (!password) return "Your password is required";
  return "";
}

export function validatePassword(password) {
  if (!password) return "Choose a password for your hero";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords don't match — try again";
  return "";
}

export function validateUsername(username) {
  const value = (username || "").trim();
  if (!value) return "Your hero needs a name";
  if (value.length < 3) return "Hero name must be at least 3 characters";
  if (value.length > 20) return "Hero name must be 20 characters or fewer";
  if (!USERNAME_RE.test(value)) return "Use only letters, numbers, - and _";
  return "";
}
