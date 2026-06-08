import express from "express";

import {
  generateAnalysis,
} from "../controllers/analysisController.js";

const router =
  express.Router();

router.post(
  "/",
  generateAnalysis
);

export default router;