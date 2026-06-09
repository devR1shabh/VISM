export async function generateVisaAnalysisAI(
  visaType,
  country,
  description
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
      "Upload Academic Transcript",
    ],

    "Work Visa": [
      "Upload Passport",
      "Upload Resume",
    ],

    "Tourist Visa": [
      "Upload Passport",
      "Upload Bank Statement",
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
        "Required documents have not been uploaded yet.",
      ],

      recommendation:
        "Upload all required documents to proceed.",
    },

    followUpActions:
      followUpMap[visaType] || [],
  };
}