import countryProfiles from "../data/countryProfiles";
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

  if (
    visaType === "Student Visa" &&
    countryProfiles[country]
  ) {
    documents =
      countryProfiles[country].student.documents;

    risks =
      countryProfiles[country].student.risks;

    score =
      countryProfiles[country].student.score;

    followUpActions = [
      "Upload admission documents",
      "Verify financial evidence",
      "Review student visa requirements",
      "Prepare supporting documents"
    ];
  }

  else if (visaType === "Work Visa") {
    documents = [
      "Valid Passport",
      "Employment Contract",
      "Work Permit Documents",
      "Resume",
      "Financial Evidence"
    ];

    risks = [
      "Missing employment documentation",
      "Employer sponsorship issues"
    ];

    followUpActions = [
      "Upload employment contract",
      "Verify employer sponsorship",
      "Prepare supporting documents",
      "Review work permit requirements"
    ];

    score = 82;
  }

  else if (visaType === "Tourist Visa") {
    documents = [
      "Valid Passport",
      "Bank Statements",
      "Hotel Booking",
      "Return Flight Ticket",
      "Travel Itinerary"
    ];

    risks = [
      "Insufficient travel funds",
      "Weak travel history"
    ];

    followUpActions = [
      "Upload travel itinerary",
      "Upload hotel reservations",
      "Provide bank statements",
      "Review tourist visa requirements"
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
      "Verify language test scores",
      "Prepare employment records",
      "Obtain police clearance",
      "Review PR eligibility"
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
      "Collect relationship documents",
      "Verify sponsor eligibility",
      "Prepare financial evidence",
      "Review sponsorship application"
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
      "Review country-specific immigration requirements.",
      "Ensure all supporting documents are accurate."
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