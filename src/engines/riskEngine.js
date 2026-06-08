export function calculateRisks(
  requiredDocuments = [],
  uploadedDocuments = []
) {
  const risks = [];

  const validDocuments =
    uploadedDocuments.filter(
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

  if (
    missingDocuments.length >= 3
  ) {
    risks.push({
      level: "HIGH",
      message:
        "Multiple required documents are missing.",
    });
  }

  if (
    missingDocuments.includes(
      "Financial Proof"
    ) ||
    missingDocuments.includes(
      "Financial Evidence"
    ) ||
    missingDocuments.includes(
      "Bank Statements"
    )
  ) {
    risks.push({
      level: "HIGH",
      message:
        "Financial documentation is missing.",
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
        "Language proficiency evidence missing.",
    });
  }

  if (
    missingDocuments.includes(
      "University Offer Letter"
    )
  ) {
    risks.push({
      level: "HIGH",
      message:
        "University offer letter not uploaded.",
    });
  }

  if (
    missingDocuments.includes(
      "Employment Contract"
    )
  ) {
    risks.push({
      level: "HIGH",
      message:
        "Employment contract missing.",
    });
  }

  if (
    missingDocuments.length === 0
  ) {
    risks.push({
      level: "LOW",
      message:
        "Application appears complete.",
    });
  }

  return risks;
}