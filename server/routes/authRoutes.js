// server/routes/authRoutes.js
//
// Mounted at /api/auth in server/index.js
//
// Public routes:
//   POST /api/auth/register  — create applicant account
//   POST /api/auth/login     — login (applicants + processors)
//
// Protected routes:
//   GET /api/auth/me         — get current user (requires valid JWT)

import express from "express";

import { register, login, getMe } from "../controllers/authController.js";
import { protect }                from "../middleware/auth.js";

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.post("/register", register);
router.post("/login",    login);

// ── Protected ─────────────────────────────────────────────────────────────────
router.get("/me", protect, getMe);

export default router;