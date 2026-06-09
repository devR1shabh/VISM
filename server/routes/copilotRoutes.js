// server/routes/copilotRoutes.js

import express from "express";
import { generateCopilotReply } from "../services/copilotService.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { caseContext, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!caseContext) {
      return res.status(400).json({ error: "Case context is required" });
    }

    const reply = await generateCopilotReply(caseContext, message);

    res.json({ reply });
  } catch (error) {
    console.error("Copilot Route Error:", error);
    res.status(500).json({ error: "AI Copilot is unavailable. Please try again." });
  }
});

export default router;