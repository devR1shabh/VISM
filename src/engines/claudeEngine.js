import {
  buildVisaAnalysisPrompt
} from "../prompts/visaAnalysisPrompt";

export async function runClaudeAnalysis(
  visaType,
  country,
  description
) {
  const prompt =
    buildVisaAnalysisPrompt(
      visaType,
      country,
      description
    );

  console.log(prompt);

  return {
    message:
      "Claude integration coming next."
  };
}