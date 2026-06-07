export async function NotificationAgent(
  analysis,
  uploadedDocuments = []
) {
  const missingDocuments =
    analysis.documents.filter(
      (doc) =>
        !uploadedDocuments.includes(doc)
    );

  return {
    applicantMessage:
      missingDocuments.length > 0
        ? `Please upload the following documents: ${missingDocuments.join(
            ", "
          )}.`
        : "All required documents have been received.",

    processorMessage:
      missingDocuments.length > 0
        ? `${missingDocuments.length} document(s) are still pending.`
        : "Case is ready for review.",

    missingDocuments,
  };
}