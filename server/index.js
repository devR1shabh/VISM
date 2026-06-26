// server/index.js

import express from "express";
import cors    from "cors";
import dotenv  from "dotenv";

import { connectDB } from "./config/db.js";

import authRoutes     from "./routes/authRoutes.js";
import { authLimiter, generalLimiter } from "./utils/rateLimiter.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import copilotRoutes  from "./routes/copilotRoutes.js";
import caseRoutes     from "./routes/caseRoutes.js";

dotenv.config();

// ── Startup guard — fail fast if required secrets are missing ─────────────────
// Better to crash at boot with a clear message than to fail silently at runtime
// when the first protected request arrives.
if (!process.env.JWT_SECRET) {
  console.error(
    "[FATAL] JWT_SECRET environment variable is not set. " +
    "Set it in your .env file before starting the server."
  );
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error(
    "[FATAL] MONGODB_URI environment variable is not set."
  );
  process.exit(1);
}

await connectDB();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// In development, ALLOWED_ORIGINS is optional — defaults to permissive.
// In production, set ALLOWED_ORIGINS to your exact frontend URL, e.g.:
//   ALLOWED_ORIGINS=https://vism.yourdomain.com
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : null;

app.use(
  cors({
    origin: ALLOWED_ORIGINS
      ? (origin, callback) => {
          // Allow requests with no origin (server-to-server, curl, Postman)
          if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`CORS: Origin ${origin} not allowed`));
          }
        }
      : true, // permissive in dev (no ALLOWED_ORIGINS set)
    credentials: true,
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
// 10MB limit to accommodate base64-encoded document previews sent via Navi.
app.use(express.json({ limit: "10mb" }));

// ── Routes ────────────────────────────────────────────────────────────────────
// ── Rate limiting ────────────────────────────────────────────────────────────
// generalLimiter covers all /api/* routes.
// authLimiter is applied specifically to /api/auth (login + register)
// because these are the highest-value brute-force targets.
app.use("/api",      generalLimiter);
app.use("/api/auth", authLimiter);

app.use("/api/auth",      authRoutes);
app.use("/api/analysis",  analysisRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/copilot",   copilotRoutes);
app.use("/api/cases",     caseRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "VISM API Running" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
});