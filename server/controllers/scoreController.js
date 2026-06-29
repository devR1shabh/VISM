// server/controllers/scoreController.js
//
// POST /api/score/:caseId/generate
//   Computes and saves the visa confidence score for a case.
//   Protected — requires a valid JWT.

import Case                    from "../models/Case.js";
import { computeConfidenceScore } from "../services/confidenceScoreService.js";

export async function generateScore(req, res) {
  const { caseId } = req.params;

  try {
    const caseRecord = await Case.findById(caseId).lean();
    if (!caseRecord) {
      return res.status(404).json({ error: "Case not found." });
    }

    // Mark as running so the UI can show a spinner immediately
    await Case.findByIdAndUpdate(caseId, {
      $set: { "visaConfidenceScore.running": true },
    });

    // Compute — this calls Groq for the questionnaire component
    const scoreData = await computeConfidenceScore(caseRecord);

    // Persist to MongoDB
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $set: { visaConfidenceScore: scoreData } },
      { new: true }
    );

    console.log(
      `[Score] Case ${caseId} — score: ${scoreData.score} (${scoreData.label})`
    );

    res.json({
      success:             true,
      visaConfidenceScore: updatedCase.visaConfidenceScore,
    });
  } catch (error) {
    console.error("[scoreController.generateScore]", error);

    // Clear running flag so UI doesn't get stuck
    await Case.findByIdAndUpdate(caseId, {
      $set: { "visaConfidenceScore.running": false },
    }).catch(() => {});

    res.status(500).json({ error: "Failed to generate confidence score." });
  }
}