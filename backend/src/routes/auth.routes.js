import { Router } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { findUserByEmail, findUserById, createUser } from "../data/userStore.js";
import { signToken } from "../utils/token.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
const SALT_ROUNDS = 10;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function publicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser({
      id: crypto.randomUUID(),
      username,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    const token = signToken({ sub: user.id, email: user.email });
    return res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Something went wrong during signup" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken({ sub: user.id, email: user.email });
    return res.status(200).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Something went wrong during login" });
  }
});

// Logout is handled client-side by discarding the JWT.
// This endpoint exists for a consistent API surface / future token-blacklisting.
router.post("/logout", requireAuth, (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await findUserById(req.user.sub);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: publicUser(user) });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ message: "Something went wrong fetching your profile" });
  }
});

export default router;
