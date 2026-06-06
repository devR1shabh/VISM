export function generateMockAnalysis(
  visaType,
  country,
  description
) {
  return {
    overview: `${visaType} application for ${country}.`,

    documents: [
      "Valid Passport",
      "Financial Documents",
      "Application Form",
      "Supporting Evidence"
    ],

    risks: [
      "Incomplete documentation",
      "Insufficient financial proof"
    ],

    journey: [
      "Document Collection",
      "Application Preparation",
      "Submission",
      "Biometrics",
      "Decision"
    ]
  };
}