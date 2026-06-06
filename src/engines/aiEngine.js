export async function generateVisaAnalysis(
  visaType,
  country,
  description
) {
  return {
    overview: `${visaType} application for ${country}`,

    documents: [
      "Passport",
      "Application Form",
      "Financial Evidence",
      "Supporting Documents"
    ],

    risks: [
      "Missing documentation",
      "Insufficient proof of funds"
    ],

    journey: [
      "Document Collection",
      "Application Preparation",
      "Submission",
      "Biometrics",
      "Decision"
    ],

    score: 85,

    complianceNotes: [
      "Verify passport validity.",
      "Review country-specific requirements."
    ],

    timeline: [
      {
        stage: "Preparation",
        duration: "1-2 Weeks"
      },
      {
        stage: "Submission",
        duration: "1 Day"
      },
      {
        stage: "Decision",
        duration: "4-12 Weeks"
      }
    ],

    followUpActions: [
      "Gather financial statements",
      "Upload passport copy",
      "Schedule biometrics appointment",
      "Review application form",
      "Verify supporting documents"
    ]
  };
}