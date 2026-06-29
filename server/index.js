// server/index.js

import express from "express";
import cors    from "cors";
import dotenv  from "dotenv";

import { connectDB } from "./config/db.js";

import authRoutes        from "./routes/authRoutes.js";
import configRoutes      from "./routes/configRoutes.js";
import paymentRoutes     from "./routes/paymentRoutes.js";
import guidelinesRoutes  from "./routes/guidelinesRoutes.js";
import { authLimiter, generalLimiter } from "./utils/rateLimiter.js";
import analysisRoutes    from "./routes/analysisRoutes.js";
import documentRoutes    from "./routes/documentRoutes.js";
import copilotRoutes     from "./routes/copilotRoutes.js";
import caseRoutes        from "./routes/caseRoutes.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("[FATAL] JWT_SECRET is not set.");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("[FATAL] MONGODB_URI is not set.");
  process.exit(1);
}

await connectDB();

const app = express();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : null;

app.use(
  cors({
    origin: ALLOWED_ORIGINS
      ? (origin, callback) => {
          if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`CORS: Origin ${origin} not allowed`));
          }
        }
      : true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use("/api",      generalLimiter);
app.use("/api/auth", authLimiter);

app.use("/api/config",      configRoutes);
app.use("/api/guidelines",  guidelinesRoutes);
app.use("/api/auth",        authRoutes);
app.use("/api/payment",     paymentRoutes);
app.use("/api/analysis",    analysisRoutes);
app.use("/api/documents",   documentRoutes);
app.use("/api/copilot",     copilotRoutes);
app.use("/api/cases",       caseRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "VISM API Running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
});