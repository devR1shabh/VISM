import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

import analysisRoutes from "./routes/analysisRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import copilotRoutes from "./routes/copilotRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";

dotenv.config();

await connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/api/analysis",
  analysisRoutes
);

app.use(
  "/api/documents",
  documentRoutes
);

app.use(
  "/api/copilot",
  copilotRoutes
);

app.use(
  "/api/cases",
  caseRoutes
);

app.get("/", (req, res) => {
  res.json({
    message: "VISM API Running",
  });
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});