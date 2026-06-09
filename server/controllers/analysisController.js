import {
  generateVisaAnalysisAI
} from "../services/visaAnalysisService.js";

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

    const analysis =
      await generateVisaAnalysisAI(
        visaType,
        country,
        description
      );

    res.json(analysis);
  } catch (error) {
    console.error(
      "Analysis Controller Error:",
      error
    );

    res.status(500).json({
      error:
        "Analysis generation failed",
    });
  }
}