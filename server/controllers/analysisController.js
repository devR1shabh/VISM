import {
  generateAIInsights,
} from "../services/geminiAnalysisService.js";

export async function generateAnalysis(
  req,
  res
) {
  try {
    const {
      visaType,
      country,
      description,
    } = req.body;

    const aiAnalysis =
      await generateAIInsights(
        visaType,
        country,
        description
      );

    res.json(aiAnalysis);
  } catch (error) {
    console.error(
      "Analysis Controller Error:",
      error
    );

    res.status(500).json({
      error:
        "AI analysis failed",
    });
  }
}