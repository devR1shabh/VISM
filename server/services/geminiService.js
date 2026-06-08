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

    "Permanent Residency": [
      "Passport",
      "Educational Credentials",
      "Employment Records",
      "Language Test Results",
      "Police Clearance",
    ],

    "Family Sponsorship": [
      "Passport",
      "Relationship Proof",
      "Sponsor Documents",
      "Financial Proof",
      "Identity Documents",
    ],
  };

  return {
    overview:
      `${visaType} application for ${country}. ${description}`,

    documents:
      documentMap[visaType] || [
        "Passport",
      ],

    risks: [
      {
        level: "MEDIUM",
        message:
          "Financial documentation should be reviewed carefully.",
      },
      {
        level: "LOW",
        message:
          "Ensure all uploaded documents are clear and valid.",
      },
    ],

    journey: [
      {
        stage:
          "Document Collection",
        duration: "1 Week",
      },
      {
        stage:
          "Application Preparation",
        duration: "2 Days",
      },
      {
        stage:
          "Application Submission",
        duration: "1 Day",
      },
      {
        stage:
          "Processing",
        duration: "4-8 Weeks",
      },
      {
        stage:
          "Decision",
        duration: "Final Outcome",
      },
    ],

    score: 80,

    complianceNotes: [
      "Verify all documents before submission.",
      "Ensure passport validity meets requirements.",
      "Review country-specific immigration rules.",
    ],

    timeline: [
      {
        stage: "Preparation",
        duration: "1 Week",
      },
      {
        stage: "Submission",
        duration: "1 Day",
      },
      {
        stage: "Processing",
        duration: "4-8 Weeks",
      },
    ],

    assessment: {
      score: 80,

      strengths: [
        "Application structure is complete.",
        "Required documents have been identified.",
      ],

      concerns: [
        "Missing supporting evidence may delay processing.",
      ],

      recommendation:
        "Upload all required documents before submission.",
    },

    notification: {
      title:
        "Application Created",

      message:
        "Your visa application analysis has been generated successfully.",
    },

    tasks: [
      {
        id: 1,
        title:
          "Upload Passport",
      },
      {
        id: 2,
        title:
          "Upload Supporting Documents",
      },
    ],

    followUpActions: [
      "Upload all required documents.",
      "Review application details.",
      "Prepare for submission.",
    ],
  };
}