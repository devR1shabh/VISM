import { useCase } from "../../context/CaseContext";

function CaseSummary({
  documents = [],
}) {
  const {
    caseData,
    uploadedDocuments,
  } = useCase();

  const verifiedDocuments =
    uploadedDocuments.filter(
      (doc) => doc.valid
    );

  const allDocumentsUploaded =
    documents.every(
      (requiredDoc) =>
        verifiedDocuments.some(
          (uploadedDoc) =>
            uploadedDoc.requiredDocument ===
            requiredDoc
        )
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Case Summary
      </h2>

      <div className="space-y-3">

        <p>
          <strong>
            Visa Type:
          </strong>{" "}
          {caseData?.visaType}
        </p>

        <p>
          <strong>
            Destination:
          </strong>{" "}
          {caseData?.country}
        </p>

        <div>
          <strong>
            Document Status
          </strong>

          <div className="mt-2 space-y-2">

            {documents.map(
              (document) => {
                const exists =
                  verifiedDocuments.some(
                    (uploadedDoc) =>
                      uploadedDoc.requiredDocument ===
                      document
                  );

                return (
                  <p
                    key={
                      document
                    }
                  >
                    {exists
                      ? "✓"
                      : "✗"}{" "}
                    {document}
                  </p>
                );
              }
            )}

          </div>
        </div>

        <div className="mt-4 border-t pt-4">

          <p className="font-semibold">
            Application Status
          </p>

          {allDocumentsUploaded ? (
            <div className="mt-2">
              <p className="text-green-600 font-bold">
                READY FOR SUBMISSION
              </p>

              <p className="text-sm text-gray-600 mt-1">
                All required documents have been verified.
              </p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-orange-600 font-bold">
                ACTION REQUIRED
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Some required documents are still missing.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default CaseSummary;