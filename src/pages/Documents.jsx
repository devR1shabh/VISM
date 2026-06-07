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

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">
          Applicant Profile
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

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-bold mb-4">
              Valid Documents
            </h2>

            <p className="mb-4">
              Total:
              {" "}
              {validDocuments.length}
            </p>

            <div className="space-y-2">

              {validDocuments.map(
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

                    <p className="text-green-600">
                      Valid
                    </p>
                  </div>
                )
              )}

            </div>

          </div>

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-bold mb-4">
              Invalid Documents
            </h2>

            <p className="mb-4">
              Total:
              {" "}
              {invalidDocuments.length}
            </p>

            <div className="space-y-2">

              {invalidDocuments.map(
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

                    <p className="text-red-600">
                      Invalid
                    </p>
                  </div>
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