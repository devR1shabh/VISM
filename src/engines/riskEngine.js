import { normalizeUploadedDocuments } from "../utils/documentUtils.js";

export function calculateRisks(
  requiredDocuments = [],
  uploadedDocuments = []
) {
  const risks = [];

  const validDocuments =
    normalizeUploadedDocuments(uploadedDocuments).filter(
      (doc) => doc.valid
    );

  const uploadedNames =
    validDocuments.map(
      (doc) =>
        doc.requiredDocument
    );

  const missingDocuments =
    requiredDocuments.filter(
      (doc) =>
        !uploadedNames.includes(doc)
    );

  // Critical Document

  if (
    missingDocuments.includes(
      "Passport"
    )
  ) {
    risks.push({
      level: "HIGH",
      message:
        "Passport has not been uploaded. The application cannot proceed without a valid passport.",
    });
  }

  // Student Visa Risks

  if (
    missingDocuments.includes(
      "University Offer Letter"
    )
  ) {
    risks.push({
      level: "HIGH",
      message:
        "University Offer Letter is missing.",
    });
  }

  if (
    missingDocuments.includes(
      "Language Test Results"
    )
  ) {
    risks.push({
      level: "MEDIUM",
      message:
        "Language proficiency evidence has not been provided.",
    });
  }

  // Work Visa Risks

  if (
    missingDocuments.includes(
      "Employment Contract"
    )
  ) {
    risks.push({
      level: "HIGH",
      message:
        "Employment Contract is required for work visa processing.",
    });
  }

  if (
    missingDocuments.includes(
      "Work Permit"
    )
  ) {
    risks.push({
      level: "MEDIUM",
      message:
        "Work Permit documentation is missing.",
    });
  }

  // Tourist Visa Risks

  if (
    missingDocuments.includes(
      "Flight Reservation"
    )
  ) {
    risks.push({
      level: "MEDIUM",
      message:
        "Flight reservation has not been provided.",
    });
  }

  if (
    missingDocuments.includes(
      "Hotel Booking"
    )
  ) {
    risks.push({
      level: "LOW",
      message:
        "Accommodation evidence is missing.",
    });
  }

  // Financial Documents

  if (
    missingDocuments.includes(
      "Financial Proof"
    ) ||
    missingDocuments.includes(
      "Bank Statement"
    )
  ) {
    risks.push({
      level: "HIGH",
      message:
        "Financial evidence is missing and may affect eligibility assessment.",
    });
  }

  // General Missing Documents

  if (
    missingDocuments.length >= 3
  ) {
    risks.push({
      level: "HIGH",
      message:
        "Multiple required documents are still missing.",
    });
  } else if (
    missingDocuments.length === 2
  ) {
    risks.push({
      level: "MEDIUM",
      message:
        "Several supporting documents remain outstanding.",
    });
  } else if (
    missingDocuments.length === 1
  ) {
    risks.push({
      level: "LOW",
      message:
        "One required document is still pending upload.",
    });
  }

  // No Risks

  if (
    missingDocuments.length === 0
  ) {
    risks.push({
      level: "LOW",
      message:
        "All required documents have been uploaded successfully.",
    });
  }

  return risks;
}