// server/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import analysisRoutes from "./routes/analysisRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import copilotRoutes from "./routes/copilotRoutes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/analysis", analysisRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api/copilot", copilotRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});