// server/controllers/authController.js
//
// Handles all applicant and processor authentication.
//
// Endpoints:
//   POST /api/auth/register  — create applicant account
//   POST /api/auth/login     — login for applicants AND processors
//   GET  /api/auth/me        — return currently authenticated user
//
// Security decisions:
//   - Passwords hashed with bcrypt (cost factor 12)
//   - JWT signed with HS256, expires in 7 days
//   - Login error message is deliberately generic ("Invalid credentials")
//     to prevent user enumeration attacks
//   - passwordHash is never returned in any response

import bcrypt from "bcryptjs";
import jwt    from "jsonwebtoken";
import User   from "../models/User.js";
import { sendWelcomeEmail } from "../services/emailService.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Signs a JWT for a given user.
 * Payload contains only the user ID and role — nothing sensitive.
 */
function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

/**
 * Builds the safe user response object (no password hash).
 * Calling .toJSON() on the Mongoose document triggers the schema's
 * toJSON override which strips passwordHash automatically.
 */
function buildUserResponse(user) {
  return {
    id:        user._id,
    name:      user.name,
    email:     user.email,
    role:      user.role,
    createdAt: user.createdAt,
  };
}

// ── register ──────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Body: { name, email, password }
//
// Only creates accounts with role "applicant".
// Processor accounts must be seeded directly in the database.

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // ── Input validation ───────────────────────────────────────────────────────
    const errors = [];

    if (!name || String(name).trim().length < 2) {
      errors.push("Name must be at least 2 characters.");
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(String(email).trim())) {
      errors.push("A valid email address is required.");
    }

    if (!password || password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(" ") });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // ── Duplicate check ────────────────────────────────────────────────────────
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    // ── Hash password ──────────────────────────────────────────────────────────
    // Cost factor 12 — strong enough for 2024 hardware; ~300ms per hash.
    const passwordHash = await bcrypt.hash(password, 12);

    // ── Create user ────────────────────────────────────────────────────────────
    const user = await User.create({
      name:         String(name).trim(),
      email:        normalizedEmail,
      passwordHash,
      role:         "applicant",
    });

    // ── Issue token ────────────────────────────────────────────────────────────
    const token = signToken(user);

    console.log(`[Auth] New applicant registered: ${user.email} (${user._id})`);

    // ── Send welcome email (Phase 5) ──────────────────────────────────────────
    // Fire-and-forget — a failed email must never block registration.
    sendWelcomeEmail({ name: user.name, email: user.email }).catch((err) =>
      console.error("[register] Welcome email failed:", err.message)
    );

    res.status(201).json({
      token,
      user: buildUserResponse(user),
    });

  } catch (error) {
    // Catch Mongoose validation errors cleanly
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(" ") });
    }

    // Duplicate key race condition (two simultaneous registrations)
    if (error.code === 11000) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    console.error("[Auth] register error:", error);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
}

// ── login ─────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
//
// Works for both applicants and processors — role is embedded in the JWT.
// The generic error message ("Invalid credentials") is intentional.

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // ── Input validation ───────────────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // ── Find user — explicitly select passwordHash ─────────────────────────────
    // passwordHash has select:false on the schema, so we must opt back in here.
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

    if (!user) {
      // Don't reveal whether the email exists
      return res.status(401).json({ error: "Invalid credentials." });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: "Account is deactivated. Please contact support.",
      });
    }

    // ── Compare password ───────────────────────────────────────────────────────
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // ── Issue token ────────────────────────────────────────────────────────────
    const token = signToken(user);

    console.log(`[Auth] Login: ${user.email} (role: ${user.role})`);

    res.json({
      token,
      user: buildUserResponse(user),
    });

  } catch (error) {
    console.error("[Auth] login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
}

// ── getMe ─────────────────────────────────────────────────────────────────────
// GET /api/auth/me
// Protected — requires valid JWT (protect middleware must run first).
//
// Returns the currently authenticated user's profile.
// Useful for the frontend to rehydrate auth state on page refresh.

export async function getMe(req, res) {
  try {
    // req.user is attached by the protect middleware
    res.json({ user: buildUserResponse(req.user) });
  } catch (error) {
    console.error("[Auth] getMe error:", error);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
}