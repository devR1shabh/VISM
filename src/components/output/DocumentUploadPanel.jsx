// src/components/output/DocumentUploadPanel.jsx

import {
  uploadPassport,
  verifyDocument,
  addVerifiedDocument,
} from "../../services/api";
import { useCase } from "../../context/CaseContext";
import { deriveDocumentSummary } from "../../engines/readinessEngine";
import { getDocumentByType } from "../../utils/documentUtils";

const VERIFIABLE_DOCUMENTS = ["Resume", "Academic Transcript", "Bank Statement"];

function DocumentUploadPanel({ documents = [] }) {
  const {
    caseData,
    uploadedDocuments,
    addDocument,
    addActivity,
    onPassportReplaced,
  } = useCase();

  const handleUpload = async (documentName, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (documentName === "Passport") {
        const result = await uploadPassport(file);

        if (result.valid && result.passportData?.passportNumber) {
          const existingPassport = getDocumentByType(uploadedDocuments, "Passport");
          const existingNumber   = existingPassport?.passportData?.passportNumber;
          const incomingNumber   = result.passportData.passportNumber;
          if (existingNumber && existingNumber !== incomingNumber) {
            onPassportReplaced();
          }
        }

        const documentRecord = {
          requiredDocument: "Passport",
          fileName:    file.name,
          detectedType: result.documentType,
          valid:        result.valid,
          passportData: result.passportData,
          uploadedAt:   new Date().toISOString(),
        };

        addDocument(documentRecord);

        if (result.valid && caseData?._id) {
          await addVerifiedDocument(caseData._id, "Passport");
        }

        addActivity(
          "upload",
          result.valid ? "Passport verified successfully" : "Passport verification failed"
        );
        return;
      }

      if (VERIFIABLE_DOCUMENTS.includes(documentName)) {
        const result = await verifyDocument(file, documentName);

        const documentRecord = {
          requiredDocument: documentName,
          fileName:         file.name,
          detectedType:     result.documentType,
          valid:            result.valid,
          confidence:       result.confidence,
          matchedKeywords:  result.matchedKeywords,
          uploadedAt:       new Date().toISOString(),
        };

        addDocument(documentRecord);

        if (result.valid && caseData?._id) {
          await addVerifiedDocument(caseData._id, documentName);
        }

        addActivity(
          "upload",
          result.valid
            ? `${documentName} verified successfully`
            : `${documentName} verification failed`
        );
        return;
      }

      const documentRecord = {
        requiredDocument: documentName,
        fileName:    file.name,
        detectedType: documentName,
        valid:        true,
        uploadedAt:   new Date().toISOString(),
      };

      addDocument(documentRecord);
      addActivity("upload", `${documentName} uploaded`);
    } catch (error) {
      console.error(error);
      addActivity("error", `${documentName} upload failed`);
    } finally {
      event.target.value = "";
    }
  };

  const { valid: uploadedCount, required: totalCount } = deriveDocumentSummary(
    documents,
    uploadedDocuments
  );

  const progress = totalCount === 0 ? 0 : Math.round((uploadedCount / totalCount) * 100);

  const getDocumentStatus = (documentName) => {
    return getDocumentByType(uploadedDocuments, documentName);
  };

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <h2 className="text-lg font-bold text-[var(--c-text)] mb-4">Document Upload</h2>

      <div className="mb-5">
        <p className="text-sm font-medium text-[var(--c-text-mid)] mb-2">
          Uploaded: {uploadedCount} / {totalCount}
        </p>
        <div className="w-full bg-[var(--c-border)] rounded-full h-2">
          <div
            className="bg-[var(--c-green)] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[var(--c-text-muted)] mt-1.5">{progress}% Complete</p>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => {
          const uploadedDoc = getDocumentStatus(doc);

          return (
            <div
              key={doc}
              className="border border-[var(--c-border)] rounded-[var(--r-lg)] p-4"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[var(--c-text)] mb-1">{doc}</h3>

                  {!uploadedDoc ? (
                    <p className="text-[var(--c-error)] text-xs">Not uploaded</p>
                  ) : uploadedDoc.valid ? (
                    <>
                      <p className="text-[var(--c-success)] text-xs">
                        ✓ Uploaded: {uploadedDoc.fileName}
                      </p>

                      {doc === "Passport" && uploadedDoc.passportData && (
                        <div className="mt-3 text-xs bg-[var(--c-bg)] rounded-[var(--r-md)] border border-[var(--c-border)] p-3 space-y-1 text-[var(--c-text-mid)]">
                          <p><strong className="text-[var(--c-text)]">Name:</strong> {uploadedDoc.passportData.fullName}</p>
                          <p><strong className="text-[var(--c-text)]">Passport No:</strong> {uploadedDoc.passportData.passportNumber}</p>
                          <p><strong className="text-[var(--c-text)]">Nationality:</strong> {uploadedDoc.passportData.nationality}</p>
                          <p><strong className="text-[var(--c-text)]">Date of Birth:</strong> {uploadedDoc.passportData.dateOfBirth}</p>
                          <p><strong className="text-[var(--c-text)]">Expiry:</strong> {uploadedDoc.passportData.expiryDate}</p>
                        </div>
                      )}

                      {VERIFIABLE_DOCUMENTS.includes(doc) && (
                        <div className="mt-3 text-xs bg-[var(--c-success-bg)] rounded-[var(--r-md)] border border-[var(--c-success-border)] p-3">
                          <p className="font-semibold text-[var(--c-success)]">✓ Verified</p>
                          <p className="text-[var(--c-success)] mt-0.5">✓ Document Accepted</p>
                        </div>
                      )}

                      <p className="text-[var(--c-text-muted)] text-xs mt-1.5">
                        Uploaded: {new Date(uploadedDoc.uploadedAt).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[var(--c-error)] text-xs">Invalid upload</p>

                      {VERIFIABLE_DOCUMENTS.includes(doc) && (
                        <div className="mt-2 text-xs bg-[var(--c-error-bg)] rounded-[var(--r-md)] border border-[var(--c-error-border)] p-3">
                          <p className="font-semibold text-[var(--c-error)]">Verification Failed</p>
                          <p className="text-[var(--c-text-muted)] mt-0.5">
                            Document does not appear to be a {doc}. Please upload the correct file.
                          </p>
                        </div>
                      )}

                      <p className="text-[var(--c-text-muted)] text-xs mt-1.5">
                        Uploaded: {new Date(uploadedDoc.uploadedAt).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>

                <label className="cursor-pointer bg-[var(--c-green)] text-white text-xs font-semibold px-4 py-2 rounded-[var(--r-md)] hover:bg-[var(--c-green-mid)] transition shrink-0">
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