// server/utils/rateLimiter.js
//
// Rate limiting config using express-rate-limit.
//
// Applied to auth endpoints (/api/auth/register and /api/auth/login) to
// prevent brute-force password attacks and credential stuffing.
//
// Limits:
//   authLimiter    — 10 requests per 15 minutes per IP (login/register)
//   generalLimiter — 200 requests per 15 minutes per IP (all other routes)
//
// In production: set TRUST_PROXY=true in .env if behind a load balancer
// or reverse proxy (Nginx, Cloudflare, Heroku, etc.) so the real client
// IP is read from X-Forwarded-For instead of the proxy's IP.

import rateLimit from "express-rate-limit";

// ── Auth limiter — tight, targeted at login/register ─────────────────────────
export const authLimiter = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 minutes
  max:              10,              // max requests per window per IP
  standardHeaders:  true,           // Return rate limit info in RateLimit-* headers
  legacyHeaders:    false,
  message: {
    error:
      "Too many attempts from this IP address. " +
      "Please wait 15 minutes before trying again.",
  },
  // Skip successful requests — only failed/total attempts count against the limit
  // (uncomment if you want to count only failures)
  // skipSuccessfulRequests: true,
});

// ── General limiter — loose, applied to all API routes ───────────────────────
// Protects against runaway clients without impacting normal usage.
export const generalLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, // 15 minutes
  max:             200,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    error: "Too many requests from this IP address. Please slow down.",
  },
});