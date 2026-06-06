export async function AssessmentAgent(
  analysis
) {
  return {
    score: analysis.score,

    strengths: [
      "Required documents identified",
      "Application pathway established",
      "Country-specific analysis available"
    ],

    concerns: analysis.risks,

    recommendation:
      "Review all required documents before submission."
  };
}