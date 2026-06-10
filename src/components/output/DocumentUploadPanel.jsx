// src/components/output/DocumentUploadPanel.jsx

import {
  uploadPassport,
  verifyDocument,
  addVerifiedDocument,
} from "../../services/api";
import { useCase } from "../../context/CaseContext";

const VERIFIABLE_DOCUMENTS = ["Resume", "Academic Transcript", "Bank Statement"];

function DocumentUploadPanel({ documents = [] }) {
  const {
  caseData,
  uploadedDocuments,
  addDocument,
  addActivity,
} = useCase();

  const handleUpload = async (documentName, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // --- Passport: full extraction ---
      if (documentName === "Passport") {
        const result = await uploadPassport(file);

        const documentRecord = {
          requiredDocument: "Passport",
          fileName: file.name,
          detectedType: result.documentType,
          valid: result.valid,
          passportData: result.passportData,
          uploadedAt: new Date().toISOString(),
        };

        addDocument(documentRecord);

if (
  result.valid &&
  caseData?._id
) {
  await addVerifiedDocument(
    caseData._id,
    "Passport"
  );
}

addActivity(
  "upload",
  result.valid
    ? "Passport verified successfully"
    : "Passport verification failed"
);

return;
      }

      // --- Verifiable documents: OCR + keyword scoring ---
      if (VERIFIABLE_DOCUMENTS.includes(documentName)) {
        const result = await verifyDocument(file, documentName);

        const documentRecord = {
          requiredDocument: documentName,
          fileName: file.name,
          detectedType: result.documentType,
          valid: result.valid,
          confidence: result.confidence,
          matchedKeywords: result.matchedKeywords,
          uploadedAt: new Date().toISOString(),
        };

        addDocument(documentRecord);

if (
  result.valid &&
  caseData?._id
) {
  await addVerifiedDocument(
    caseData._id,
    documentName
  );
}

addActivity(
  "upload",
  result.valid
    ? `${documentName} verified successfully (${result.confidence}% confidence)`
    : `${documentName} verification failed (${result.confidence}% confidence)`
);

return;
      }

      // --- Fallback for any other document types ---
      const documentRecord = {
        requiredDocument: documentName,
        fileName: file.name,
        detectedType: documentName,
        valid: true,
        uploadedAt: new Date().toISOString(),
      };

      addDocument(documentRecord);
      addActivity("upload", `${documentName} uploaded`);
    } catch (error) {
      console.error(error);
      addActivity("error", `${documentName} upload failed`);
    }
  };

  const validUploads = uploadedDocuments.filter((doc) => doc.valid);
  const uploadedCount = validUploads.length;
  const totalCount = documents.length;
  const progress =
    totalCount === 0 ? 0 : Math.round((uploadedCount / totalCount) * 100);

  const getDocumentStatus = (documentName) => {
    return uploadedDocuments.find(
      (doc) => doc.requiredDocument === documentName
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Document Upload Center</h2>

      <div className="mb-6">
        <p className="font-medium">
          Uploaded: {uploadedCount} / {totalCount}
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-600 mt-2">{progress}% Complete</p>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => {
          const uploadedDoc = getDocumentStatus(doc);

          return (
            <div key={doc} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-medium">{doc}</h3>

                  {!uploadedDoc ? (
                    <p className="text-red-500 text-sm mt-1">Not Uploaded</p>
                  ) : uploadedDoc.valid ? (
                    <>
                      <p className="text-green-600 text-sm mt-1">
                        Uploaded: {uploadedDoc.fileName}
                      </p>

                      {/* Passport: show extracted fields */}
                      {doc === "Passport" && uploadedDoc.passportData && (
                        <div className="mt-3 text-sm bg-gray-50 p-3 rounded">
                          <p>
                            <strong>Name:</strong>{" "}
                            {uploadedDoc.passportData.fullName}
                          </p>
                          <p>
                            <strong>Passport No:</strong>{" "}
                            {uploadedDoc.passportData.passportNumber}
                          </p>
                          <p>
                            <strong>Nationality:</strong>{" "}
                            {uploadedDoc.passportData.nationality}
                          </p>
                          <p>
                            <strong>Date Of Birth:</strong>{" "}
                            {uploadedDoc.passportData.dateOfBirth}
                          </p>
                          <p>
                            <strong>Expiry:</strong>{" "}
                            {uploadedDoc.passportData.expiryDate}
                          </p>
                        </div>
                      )}

                      {/* Resume / Transcript / Bank Statement: show confidence only */}
                      {VERIFIABLE_DOCUMENTS.includes(doc) &&
                        uploadedDoc.confidence !== undefined && (
                          <div className="mt-3 text-sm bg-green-50 p-3 rounded border border-green-100">
                            <p className="text-green-700 font-semibold">
                              {doc} Verified
                            </p>
                            <p className="text-green-600 mt-1">
                              ✓ Validation Passed
                            </p>
                            <p className="text-gray-600 mt-1">
                              Confidence:{" "}
                              <span className="font-semibold text-blue-600">
                                {uploadedDoc.confidence}%
                              </span>
                            </p>
                          </div>
                        )}

                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded: {new Date(uploadedDoc.uploadedAt).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-red-600 text-sm mt-1">
                        Invalid Upload
                      </p>

                      {/* Show confidence even on failure for verifiable docs */}
                      {VERIFIABLE_DOCUMENTS.includes(doc) &&
                        uploadedDoc.confidence !== undefined && (
                          <div className="mt-2 text-sm bg-red-50 p-3 rounded border border-red-100">
                            <p className="text-red-700 font-semibold">
                              Verification Failed
                            </p>
                            <p className="text-gray-600 mt-1">
                              Confidence:{" "}
                              <span className="font-semibold text-red-600">
                                {uploadedDoc.confidence}%
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Document does not appear to be a {doc}. Please
                              upload the correct file.
                            </p>
                          </div>
                        )}

                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded: {new Date(uploadedDoc.uploadedAt).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>

                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-4 shrink-0">
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleUpload(doc, e)}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DocumentUploadPanel;