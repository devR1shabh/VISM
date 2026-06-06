export function generateMockAnalysis(
  visaType,
  country,
  description
) {
  let score = 50;

  if (visaType) score += 15;
  if (country) score += 15;
  if (description && description.length > 20) score += 20;

  return {
    overview: `${visaType} application for ${country}.`,

    score,

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

    complianceNotes: [
      "Passport should remain valid for at least 6 months.",
      "Financial evidence must be verifiable.",
      "All supporting documents should be translated into English if required.",
      "Country-specific immigration requirements should be reviewed before submission."
    ],

    timeline: [
      {
        stage: "Document Collection",
        duration: "1 - 2 Weeks"
      },
      {
        stage: "Application Preparation",
        duration: "3 - 5 Days"
      },
      {
        stage: "Submission",
        duration: "1 Day"
      },
      {
        stage: "Biometrics",
        duration: "1 - 3 Weeks"
      },
      {
        stage: "Decision",
        duration: "4 - 12 Weeks"
      }
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