export function generateMockAnalysis(visaType, country) {
  return {
    // LLM-generated (mocked for offline use)
    aiOverview: `${visaType} application for ${country}. This is a mock overview used for offline testing. AI-generated content is unavailable without a running backend.`,

    aiRisks: [
      { level: "MEDIUM", message: "Mock risk: financial sufficiency has not been assessed." },
      { level: "LOW", message: "Mock risk: travel intent documentation pending review." },
    ],

    aiRecommendations: [
      "Verify that all personal information is consistent across documents.",
      `Review ${country}'s current visa entry requirements.`,
      "Prepare a clear and detailed cover letter explaining the purpose of travel.",
    ],

    // Rule-based
    documents: ["Passport", "Bank Statement"],

    complianceNotes: [
      "Passport should remain valid for at least 6 months beyond the intended stay.",
      "Financial evidence must be verifiable and recent.",
      "All supporting documents should be translated into English if required.",
    ],

    visaJourney: [
      { stage: "Document Collection", duration: "1–2 Weeks" },
      { stage: "Application Preparation", duration: "2–3 Days" },
      { stage: "Submission", duration: "1 Day" },
      { stage: "Processing", duration: "4–8 Weeks" },
      { stage: "Decision", duration: "Final Outcome" },
    ],
  };
}