// server/middleware/auth.js
//
// Two middleware functions used to protect routes:
//
//   protect       — verifies JWT; attaches req.user; blocks unauthenticated requests
//   processorOnly — runs after protect; blocks non-processor roles
//
// Usage in routes:
//   router.get("/", protect, processorOnly, getAllCases);
//   router.post("/", protect, createCase);

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ── protect ───────────────────────────────────────────────────────────────────
// Extracts the JWT from the Authorization header, verifies it, loads the
// matching User document, and attaches it to req.user.
//
// Expected header format:
//   Authorization: Bearer <token>

export async function protect(req, res, next) {
  try {
    // 1. Pull the token out of the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Not authorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify the token signature and expiry
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // Distinguish between expired and simply invalid tokens
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Session expired. Please log in again.",
        });
      }
      return res.status(401).json({
        error: "Not authorized. Invalid token.",
      });
    }

    // 3. Load the user from the database
    // We use .select("-passwordHash") as an extra safety belt even though
    // passwordHash has select:false on the schema — belt AND suspenders.
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      // Token was valid but the user was deleted after the token was issued
      return res.status(401).json({
        error: "Not authorized. User no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: "Account is deactivated. Please contact support.",
      });
    }

    // 4. Attach user to the request — available in all subsequent middleware/controllers
    req.user = user;

    next();
  } catch (error) {
    console.error("[auth.protect] Unexpected error:", error);
    res.status(500).json({ error: "Authentication error." });
  }
}

// ── processorOnly ─────────────────────────────────────────────────────────────
// Must be used AFTER protect — relies on req.user being set.
// Rejects any user whose role is not "processor".

export function processorOnly(req, res, next) {
  if (!req.user) {
    // Should never happen if protect ran first, but guard anyway
    return res.status(401).json({ error: "Not authorized." });
  }

  if (req.user.role !== "processor") {
    return res.status(403).json({
      error: "Access denied. Processor credentials required.",
    });
  }

  next();
}