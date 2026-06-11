export function generateRuleBasedAnalysis(
  visaType,
  country
) {
  const documentMap = {
    "Student Visa": [
      "Passport",
      "Academic Transcript",
    ],
    "Work Visa": [
      "Passport",
      "Resume",
    ],
    "Tourist Visa": [
      "Passport",
      "Bank Statement",
    ],
  };

  const complianceMap = {
    "Student Visa": [
      "Maintain full-time enrollment at an approved institution.",
      "Keep passport valid for the entire duration of studies.",
      "Meet minimum attendance requirements set by the institution.",
      "Do not engage in unauthorized employment.",
    ],
    "Work Visa": [
      "Work only for the authorized employer named on the visa.",
      "Maintain valid employment records throughout the visa period.",
      "Comply with all local labor laws and regulations.",
      "Notify authorities of any change in employment status.",
    ],
    "Tourist Visa": [
      "Do not overstay the permitted visa duration.",
      "Maintain valid travel documents at all times.",
      "Do not engage in employment or paid activities.",
      "Follow all destination-country entry and exit regulations.",
    ],
  };

  const journeyMap = {
    "Student Visa": [
      { stage: "Document Collection", duration: "1–2 Weeks" },
      { stage: "Application Preparation", duration: "2–3 Days" },
      { stage: "Submission", duration: "1 Day" },
      { stage: "Biometrics Appointment", duration: "1–2 Weeks" },
      { stage: "Processing", duration: "4–8 Weeks" },
      { stage: "Decision", duration: "Final Outcome" },
    ],
    "Work Visa": [
      { stage: "Document Collection", duration: "1–2 Weeks" },
      { stage: "Employer Verification", duration: "3–5 Days" },
      { stage: "Submission", duration: "1 Day" },
      { stage: "Processing", duration: "6–12 Weeks" },
      { stage: "Decision", duration: "Final Outcome" },
    ],
    "Tourist Visa": [
      { stage: "Document Collection", duration: "3–5 Days" },
      { stage: "Application Preparation", duration: "1 Day" },
      { stage: "Submission", duration: "1 Day" },
      { stage: "Processing", duration: "2–4 Weeks" },
      { stage: "Decision", duration: "Final Outcome" },
    ],
  };

  const defaultJourney = [
    { stage: "Document Collection", duration: "1–2 Weeks" },
    { stage: "Application Preparation", duration: "2–3 Days" },
    { stage: "Submission", duration: "1 Day" },
    { stage: "Processing", duration: "4–8 Weeks" },
    { stage: "Decision", duration: "Final Outcome" },
  ];

  return {
    documents: documentMap[visaType] || [],
    complianceNotes: complianceMap[visaType] || [],
    visaJourney: journeyMap[visaType] || defaultJourney,
  };
}