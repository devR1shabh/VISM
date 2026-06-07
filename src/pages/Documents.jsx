import { useCase } from "../context/CaseContext";

function Documents() {
  const {
    caseData,
    uploadedDocuments,
  } = useCase();

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-semibold">
          No Active Case Found
        </h2>
      </div>
    );
  }

  const validDocuments =
    uploadedDocuments.filter(
      (doc) => doc.valid
    );

  const invalidDocuments =
    uploadedDocuments.filter(
      (doc) => !doc.valid
    );

  const requiredDocuments =
    caseData.analysis?.documents || [];

  const uploadedRequiredDocs =
    validDocuments.map(
      (doc) => doc.requiredDocument
    );

  const missingDocuments =
    requiredDocuments.filter(
      (doc) =>
        !uploadedRequiredDocs.includes(
          doc
        )
    );

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">
          Applicant Profile & Document Repository
        </h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">

          <h2 className="text-2xl font-semibold mb-4">
            Case Information
          </h2>

          <p>
            <strong>Case ID:</strong>{" "}
            {caseData.caseId}
          </p>

          <p>
            <strong>Visa Type:</strong>{" "}
            {caseData.visaType}
          </p>

          <p>
            <strong>Destination Country:</strong>{" "}
            {caseData.country}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            In Progress
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-bold mb-4 text-green-600">
              Valid Documents
            </h2>

            <p className="mb-4">
              Count: {validDocuments.length}
            </p>

            <div className="space-y-3">

              {validDocuments.length === 0 ? (
                <p>No valid documents.</p>
              ) : (
                validDocuments.map(
                  (
                    document,
                    index
                  ) => (
                    <div
                      key={index}
                      className="border p-3 rounded"
                    >
                      <p>
                        <strong>
                          Required:
                        </strong>{" "}
                        {
                          document.requiredDocument
                        }
                      </p>

                      <p>
                        <strong>
                          File:
                        </strong>{" "}
                        {
                          document.fileName
                        }
                      </p>
                    </div>
                  )
                )
              )}

            </div>

          </div>

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-bold mb-4 text-red-600">
              Invalid Documents
            </h2>

            <p className="mb-4">
              Count: {invalidDocuments.length}
            </p>

            <div className="space-y-3">

              {invalidDocuments.length === 0 ? (
                <p>No invalid documents.</p>
              ) : (
                invalidDocuments.map(
                  (
                    document,
                    index
                  ) => (
                    <div
                      key={index}
                      className="border p-3 rounded"
                    >
                      <p>
                        <strong>
                          Required:
                        </strong>{" "}
                        {
                          document.requiredDocument
                        }
                      </p>

                      <p>
                        <strong>
                          Uploaded:
                        </strong>{" "}
                        {
                          document.fileName
                        }
                      </p>

                      <p>
                        <strong>
                          Detected:
                        </strong>{" "}
                        {
                          document.detectedType
                        }
                      </p>
                    </div>
                  )
                )
              )}

            </div>

          </div>

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-bold mb-4 text-orange-600">
              Missing Documents
            </h2>

            <p className="mb-4">
              Count: {missingDocuments.length}
            </p>

            <div className="space-y-3">

              {missingDocuments.length === 0 ? (
                <p>
                  All required documents uploaded.
                </p>
              ) : (
                missingDocuments.map(
                  (
                    document,
                    index
                  ) => (
                    <div
                      key={index}
                      className="border p-3 rounded"
                    >
                      {document}
                    </div>
                  )
                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Documents;