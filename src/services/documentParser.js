import documentTypes from "./documentTypes";

export function parseDocument(
  fileName
) {
  const lower =
    fileName.toLowerCase();

  const matches = {
    Passport: [
      "passport",
    ],

    "Academic Transcripts": [
      "transcript",
      "academic",
      "marksheet",
      "grade",
      "semester",
      "result",
    ],

    "University Offer Letter": [
      "offer",
      "admission",
      "acceptance",
      "university",
      "college",
    ],

    "Financial Proof": [
      "bank",
      "financial",
      "statement",
      "fund",
      "balance",
      "sponsor",
      "income",
    ],

    "Language Test Results": [
      "ielts",
      "toefl",
      "pte",
      "language",
      "test",
      "english",
      "score",
      "exam",
      "certificate",
    ],

    Resume: [
      "resume",
      "cv",
      "profile",
    ],

    "Employment Contract": [
      "employment",
      "contract",
      "offerletter",
      "joboffer",
    ],

    "Work Permit Documents": [
      "permit",
      "workpermit",
      "authorization",
      "workvisa",
    ],

    "Police Clearance Certificate": [
      "police",
      "clearance",
      "pcc",
      "background",
    ],

    "Relationship Proof": [
      "marriage",
      "relationship",
      "spouse",
      "family",
      "certificate",
    ],

    "Educational Credentials": [
      "degree",
      "diploma",
      "education",
      "credential",
    ],

    "Employment Records": [
      "employment",
      "experience",
      "salary",
      "record",
    ],

    "Sponsor Documents": [
      "sponsor",
      "support",
    ],

    "Identity Documents": [
      "identity",
      "id",
      "aadhaar",
      "license",
    ],

    "Bank Statements": [
      "bank",
      "statement",
      "account",
    ],

    "Hotel Booking": [
      "hotel",
      "booking",
      "reservation",
    ],

    "Flight Reservation": [
      "flight",
      "ticket",
      "reservation",
    ],

    "Travel Itinerary": [
      "itinerary",
      "travelplan",
      "travel",
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

        confidence:
          "Filename Match",

        extractedData: {
          summary:
            `${type} identified from filename`,
        },
      };
    }
  }

  return {
    type: "Unknown",

    status:
      "Needs Review",

    confidence:
      "Low",

    extractedData: {
      summary:
        "Document could not be identified",
    },
  };
}