export async function DocumentValidationAgent(
  documents = [],
  uploadedDocuments = []
) {
  const missingDocuments =
    documents.filter(
      (doc) =>
        !uploadedDocuments.includes(doc)
    );

  const uploadedCount =
    uploadedDocuments.length;

  const totalDocuments =
    documents.length;

  const completionPercentage =
    totalDocuments === 0
      ? 0
      : Math.round(
          (uploadedCount /
            totalDocuments) *
            100
        );

  let readinessScore = 100;

  readinessScore -=
    missingDocuments.length * 10;

  if (readinessScore < 0) {
    readinessScore = 0;
  }

  const validationStatus =
    missingDocuments.length === 0
      ? "Complete"
      : "Incomplete";

  return {
    validationStatus,

    readinessScore,

    uploadedDocuments,

    missingDocuments,

    completionPercentage,

    recommendations:
      missingDocuments.length > 0
        ? [
            `Upload ${missingDocuments.length} remaining document(s).`,
            "Review all uploaded files for accuracy.",
          ]
        : [
            "All required documents received.",
            "Case is ready for further processing.",
          ],
  };
}