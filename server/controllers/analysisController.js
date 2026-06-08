import {
  generateVisaAnalysisAI,
} from "../services/geminiService.js";

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

    const result =
      await generateVisaAnalysisAI(
        visaType,
        country,
        description
      );

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "AI analysis failed",
    });
  }
}
