import { generateRuleBasedAnalysis } from "../services/visaAnalysisService.js";
import { generateGroqInsights } from "../services/groqAnalysisService.js";

export async function generateAnalysis(req, res) {
  try {
    const { visaType, country, description } = req.body;

    // Rule-based sections are synchronous — get them first so we can
    // pass `documents` into the Groq recommendations prompt.
    const ruleBasedData = generateRuleBasedAnalysis(visaType, country);

    // Run Groq call in parallel (internally runs 3 sub-calls via Promise.all)
    const groqData = await generateGroqInsights(
      visaType,
      country,
      description,
      ruleBasedData.documents
    );

    const analysis = {
      // LLM-generated
      aiOverview: groqData.aiOverview,
      aiRisks: groqData.aiRisks,
      aiRecommendations: groqData.aiRecommendations,

      // Rule-based
      documents: ruleBasedData.documents,
      complianceNotes: ruleBasedData.complianceNotes,
      visaJourney: ruleBasedData.visaJourney,
    };

    res.json(analysis);
  } catch (error) {
    console.error("Analysis Controller Error:", error);
    res.status(500).json({ error: "Analysis generation failed" });
  }
}