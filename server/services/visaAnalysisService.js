export async function generateVisaAnalysisAI(
  visaType,
  country,
  description
) {
  const documentMap = {
    "Student Visa": [
      "Passport",
      "Academic Transcripts",
      "University Offer Letter",
      "Financial Proof",
      "Language Test Results",
    ],

    "Work Visa": [
      "Passport",
      "Resume",
      "Employment Contract",
      "Work Permit",
      "Financial Proof",
    ],

    "Tourist Visa": [
      "Passport",
      "Bank Statement",
      "Hotel Booking",
      "Flight Reservation",
      "Travel Itinerary",
    ],
  };

  const overviewMap = {
    "Student Visa":
      `A student visa for ${country} allows international students to pursue education at approved institutions.`,

    "Work Visa":
      `A work visa for ${country} allows qualified professionals to work legally for an approved employer.`,

    "Tourist Visa":
      `A tourist visa for ${country} allows visitors to travel for leisure, tourism, and short-term stays.`,
  };

  const complianceMap = {
    "Student Visa": [
      "Maintain enrollment at an approved institution.",
      "Keep passport valid throughout studies.",
      "Meet attendance requirements.",
    ],

    "Work Visa": [
      "Work only for authorized employers.",
      "Maintain valid employment records.",
      "Comply with local labor laws.",
    ],

    "Tourist Visa": [
      "Do not overstay visa duration.",
      "Maintain valid travel documents.",
      "Follow destination entry regulations.",
    ],
  };

  const followUpMap = {
    "Student Visa": [
      "Upload Passport",
      "Upload Academic Transcripts",
      "Upload Offer Letter",
      "Upload Financial Proof",
    ],

    "Work Visa": [
      "Upload Passport",
      "Upload Resume",
      "Upload Employment Contract",
      "Upload Work Permit",
    ],

    "Tourist Visa": [
      "Upload Passport",
      "Upload Bank Statement",
      "Upload Hotel Booking",
      "Upload Flight Reservation",
    ],
  };

  return {
    overview:
      overviewMap[visaType] ||
      `${visaType} application for ${country}.`,

    documents:
      documentMap[visaType] || [],

    risks: [
      {
        level: "MEDIUM",
        message:
          "Required documents must be uploaded before submission.",
      },
    ],

    journey: [
      {
        stage:
          "Document Collection",
        duration:
          "1 Week",
      },
      {
        stage:
          "Application Preparation",
        duration:
          "2 Days",
      },
      {
        stage:
          "Submission",
        duration:
          "1 Day",
      },
      {
        stage:
          "Processing",
        duration:
          "4-8 Weeks",
      },
      {
        stage:
          "Decision",
        duration:
          "Final Outcome",
      },
    ],

    timeline: [
      {
        stage:
          "Preparation",
        duration:
          "1 Week",
      },
      {
        stage:
          "Submission",
        duration:
          "1 Day",
      },
      {
        stage:
          "Processing",
        duration:
          "4-8 Weeks",
      },
    ],

    complianceNotes:
      complianceMap[visaType] || [],

    assessment: {
      score: 0,

      strengths: [
        "Case created successfully.",
      ],

      concerns: [
        "Documents have not been uploaded yet.",
      ],

      recommendation:
        "Upload all required documents to proceed.",
    },

    followUpActions:
      followUpMap[visaType] || [],
  };
}