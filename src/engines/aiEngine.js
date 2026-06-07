import { initializeCase } from "../services/caseService";

export async function generateVisaAnalysis(
  visaType,
  country,
  description
) {
  const caseData = initializeCase(
    visaType,
    country,
    description
  );

  let documents = [];
  let risks = [];
  let followUpActions = [];
  let score = 85;

  if (visaType === "Student Visa") {
    documents = [
      "Passport",
      "Academic Transcripts",
      "University Offer Letter",
      "Financial Proof",
      "Language Test Results"
    ];

    risks = [
      "Insufficient financial evidence",
      "Missing academic records",
      "Incomplete language test documentation"
    ];

    followUpActions = [
      "Upload academic transcripts",
      "Upload university offer letter",
      "Upload financial proof",
      "Upload language test results"
    ];

    score = 88;
  }

  else if (visaType === "Work Visa") {
    documents = [
      "Passport",
      "Resume",
      "Employment Contract",
      "Work Permit Documents",
      "Financial Evidence"
    ];

    risks = [
      "Missing employment documentation",
      "Employer sponsorship issues",
      "Incomplete work permit information"
    ];

    followUpActions = [
      "Upload employment contract",
      "Upload resume",
      "Verify work permit requirements",
      "Prepare supporting documents"
    ];

    score = 82;
  }

  else if (visaType === "Tourist Visa") {
    documents = [
      "Passport",
      "Bank Statements",
      "Hotel Booking",
      "Flight Reservation",
      "Travel Itinerary"
    ];

    risks = [
      "Insufficient travel funds",
      "Weak travel history"
    ];

    followUpActions = [
      "Upload bank statements",
      "Upload hotel booking",
      "Upload flight reservation",
      "Upload travel itinerary"
    ];

    score = 80;
  }

  else if (
    visaType === "Permanent Residency"
  ) {
    documents = [
      "Passport",
      "Educational Credentials",
      "Employment Records",
      "Language Test Results",
      "Police Clearance Certificate"
    ];

    risks = [
      "Low immigration score",
      "Missing supporting evidence"
    ];

    followUpActions = [
      "Upload educational credentials",
      "Upload employment records",
      "Upload language test results",
      "Upload police clearance"
    ];

    score = 75;
  }

  else if (
    visaType === "Family Sponsorship"
  ) {
    documents = [
      "Passport",
      "Relationship Proof",
      "Sponsor Documents",
      "Financial Evidence",
      "Identity Documents"
    ];

    risks = [
      "Insufficient relationship evidence",
      "Sponsor eligibility concerns"
    ];

    followUpActions = [
      "Upload relationship proof",
      "Upload sponsor documents",
      "Upload financial evidence",
      "Upload identity documents"
    ];

    score = 84;
  }

  else {
    documents = [
      "Passport",
      "Application Form",
      "Financial Evidence"
    ];

    risks = [
      "Missing documentation"
    ];

    followUpActions = [
      "Review application requirements"
    ];

    score = 80;
  }

  return {
    ...caseData,

    overview:
      `${visaType} application for ${country}. ${description}`,

    documents,

    risks,

    journey: [
      "Document Collection",
      "Application Preparation",
      "Submission",
      "Biometrics",
      "Decision"
    ],

    score,

    complianceNotes: [
      "Verify passport validity.",
      "Ensure all supporting documents are accurate.",
      "Review visa requirements before submission."
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

    followUpActions,
  };
}