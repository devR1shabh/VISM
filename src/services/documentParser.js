import documentTypes from "./documentTypes";

export function parseDocument(
  fileName
) {
  const lower =
    fileName.toLowerCase();

  const matches = {
    Passport: [
      "passport"
    ],

    "Academic Transcripts": [
      "transcript",
      "academic"
    ],

    "University Offer Letter": [
      "offer",
      "admission"
    ],

    "Financial Proof": [
      "bank",
      "financial",
      "statement"
    ],

    "Language Test Results": [
      "ielts",
      "toefl",
      "pte"
    ],

    Resume: [
      "resume",
      "cv"
    ],

    "Employment Contract": [
      "employment",
      "contract"
    ],

    "Work Permit Documents": [
      "permit",
      "workpermit"
    ],

    "Police Clearance Certificate": [
      "police",
      "clearance"
    ],

    "Relationship Proof": [
      "marriage",
      "relationship"
    ],
  };

  for (const type of documentTypes) {
    const keywords =
      matches[type];

    if (!keywords) continue;

    const found =
      keywords.some(
        (keyword) =>
          lower.includes(keyword)
      );

    if (found) {
      return {
        type,
        status: "Detected",

        confidence: "Mock Detection",

        extractedData: {
          summary:
            `${type} identified`,
        },
      };
    }
  }

  return {
    type: "Unknown",

    status: "Needs Review",

    confidence: "Low",

    extractedData: {
      summary:
        "Document could not be identified",
    },
  };
}