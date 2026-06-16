// src/components/upload/SecondaryDocSection.jsx

import { useState, useRef } from "react";
import { useCase } from "../../context/CaseContext";
import { verifyDocument, addVerifiedDocument } from "../../services/api";
import { getDocumentByType } from "../../utils/documentUtils";

const DOC_ICONS = {
  Resume: "📋",
  "Academic Transcript": "🎓",
  "Bank Statement": "🏦",
};

function SecondaryDocSection({ documentName }) {
  const {
    caseData,
    uploadedDocuments,
    addDocument,
    addActivity,
  } = useCase();

  const [preview, setPreview]                 = useState(null);
  const [verificationDone, setVerificationDone] = useState(false);
  const [isVerifying, setIsVerifying]         = useState(false);
  const [error, setError]                     = useState(null);

  const fileInputRef = useRef(null);

  const existingDoc = getDocumentByType(uploadedDocuments, documentName);
  const icon        = DOC_ICONS[documentName] || "📄";

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
    setVerificationDone(false);
    const reader = new FileReader();
    reader.onload = (ev) =>
      setPreview({ src: ev.target.result, file, timestamp: new Date().toISOString() });
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleVerify = async () => {
    if (!preview?.file) return;
    setIsVerifying(true);
    setError(null);

    try {
      const result = await verifyDocument(preview.file, documentName);

      const documentRecord = {
        requiredDocument: documentName,
        fileName:         preview.file.name,
        detectedType:     result.documentType,
        valid:            result.valid,
        confidence:       result.confidence,
        matchedKeywords:  result.matchedKeywords,
        uploadedAt:       preview.timestamp,
      };

      addDocument(documentRecord);

      if (result.valid && caseData?._id) {
        await addVerifiedDocument(caseData._id, documentName);
      }

      addActivity(
        "upload",
        result.valid
          ? `${documentName} verified and accepted`
          : `${documentName} verification failed`
      );

      if (!result.valid) {
        setError(
          `This document could not be verified as a ${documentName}. Please upload the correct document.`
        );
      }

      setVerificationDone(true);
    } catch (err) {
      console.error(err);
      setError("Verification failed. Please check your connection and try again.");
      addActivity("error", `${documentName} verification failed`);
    } finally {
      setIsVerifying(false);
    }
  };

  const hasNewPreview     = Boolean(preview && !verificationDone);
  const hasEverUploaded   = Boolean(existingDoc);
  const uploadButtonLabel = hasEverUploaded ? "Upload Again" : "Upload";
  const showVerifiedCard  = Boolean(existingDoc?.valid && !hasNewPreview);
  const showFailedCard    = Boolean(existingDoc && !existingDoc.valid && !hasNewPreview);

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-card)] p-6">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileSelect}
      />

      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-[var(--r-lg)] bg-[var(--c-green-bg)] flex items-center justify-center shrink-0">
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--c-text)]">{documentName}</h3>
          <p className="text-sm text-[var(--c-text-muted)]">
            Upload and verify your {documentName.toLowerCase()}
          </p>
        </div>
        {showVerifiedCard && (
          <span className="ml-auto flex items-center gap-1.5 bg-[var(--c-success-bg)] text-[var(--c-success)] text-xs font-semibold px-3 py-1 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Verified
          </span>
        )}
        {showFailedCard && (
          <span className="ml-auto flex items-center gap-1.5 bg-[var(--c-error-bg)] text-[var(--c-error)] text-xs font-semibold px-3 py-1 rounded-full">
            Failed
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Left: upload / preview */}
        <div>
          {!hasNewPreview && !existingDoc ? (
            <button
              type="button"
              onClick={openFilePicker}
              className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-[var(--c-border)] rounded-[var(--r-xl)] cursor-pointer bg-[var(--c-bg)] hover:bg-[var(--c-green-bg)] hover:border-[var(--c-green)] transition group"
            >
              <svg
                className="w-9 h-9 text-[var(--c-text-muted)] group-hover:text-[var(--c-green)] mb-2 transition"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-sm font-medium text-[var(--c-text-mid)] group-hover:text-[var(--c-green)]">
                Click to upload
              </span>
              <span className="text-xs text-[var(--c-text-muted)] mt-1">JPG, JPEG, PNG</span>
            </button>
          ) : (
            <div className="space-y-3">
              {preview?.src ? (
                <div className="relative rounded-[var(--r-xl)] overflow-hidden border border-[var(--c-border)] bg-[var(--c-bg)]">
                  <img src={preview.src} alt={`${documentName} preview`} className="w-full object-contain max-h-44" />
                </div>
              ) : existingDoc?.uploadedAt ? (
                <div className="rounded-[var(--r-xl)] border border-[var(--c-border)] bg-[var(--c-bg)] flex items-center justify-center h-44 text-sm text-[var(--c-text-muted)]">
                  {documentName} uploaded ✓
                </div>
              ) : null}

              {(preview?.timestamp || existingDoc?.uploadedAt) && (
                <p className="text-xs text-[var(--c-text-muted)] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(preview?.timestamp || existingDoc?.uploadedAt).toLocaleString()}
                </p>
              )}

              <div className="flex gap-2">
                {hasNewPreview && (
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="flex-1 flex items-center justify-center gap-2 bg-[var(--c-green)] text-white px-4 py-2.5 rounded-[var(--r-lg)] hover:bg-[var(--c-green-mid)] font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verify Document
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={isVerifying}
                  className="flex items-center justify-center gap-1.5 border border-[var(--c-border)] text-[var(--c-text-mid)] px-4 py-2.5 rounded-[var(--r-lg)] hover:bg-[var(--c-bg)] text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {uploadButtonLabel}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 p-3 bg-[var(--c-error-bg)] border border-[var(--c-error-border)] rounded-[var(--r-lg)] text-sm text-[var(--c-error)]">
              {error}
            </div>
          )}
        </div>

        {/* Right: verification result */}
        <div>
          {showVerifiedCard ? (
            <div className="h-full bg-[var(--c-success-bg)] border border-[var(--c-success-border)] rounded-[var(--r-xl)] p-5 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--c-success)] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-[var(--c-green)] text-base">✓ Verified</p>
                  <p className="text-sm text-[var(--c-success)]">✓ Document Accepted</p>
                </div>
              </div>
              <p className="text-xs text-[var(--c-text-muted)]">
                <strong className="text-[var(--c-text)]">File:</strong> {existingDoc.fileName}
              </p>
              {existingDoc.uploadedAt && (
                <p className="text-xs text-[var(--c-text-muted)] mt-1">
                  <strong className="text-[var(--c-text)]">Uploaded:</strong>{" "}
                  {new Date(existingDoc.uploadedAt).toLocaleString()}
                </p>
              )}
            </div>
          ) : showFailedCard ? (
            <div className="h-full bg-[var(--c-error-bg)] border border-[var(--c-error-border)] rounded-[var(--r-xl)] p-5 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--c-error)] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-[var(--c-error)] text-base">Verification Failed</p>
                  <p className="text-sm text-[var(--c-error)]">Document not accepted</p>
                </div>
              </div>
              <p className="text-xs text-[var(--c-text-muted)] mt-2">
                This document does not appear to be a valid {documentName}. Please upload the correct document.
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center rounded-[var(--r-xl)] border-2 border-dashed border-[var(--c-border)] bg-[var(--c-bg)] p-6 text-center">
              <svg className="w-9 h-9 text-[var(--c-border)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-[var(--c-text-muted)] font-medium">
                Verification result will appear here
              </p>
              <p className="text-xs text-[var(--c-text-muted)] mt-1">
                Upload and click Verify Document
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SecondaryDocSection;