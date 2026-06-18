// src/components/upload/PassportUploadSection.jsx

import { useState, useRef } from "react";
import { useCase } from "../../context/CaseContext";
import { uploadPassport, addVerifiedDocument, savePassportData } from "../../services/api";
import { getDocumentByType } from "../../utils/documentUtils";

function PassportUploadSection() {
  const {
    caseData,
    uploadedDocuments,
    addDocument,
    addActivity,
    onPassportReplaced,
    updateApplicantIdentity,
  } = useCase();

  const [preview, setPreview]               = useState(null);
  const [extractionDone, setExtractionDone] = useState(false);
  const [isExtracting, setIsExtracting]     = useState(false);
  const [error, setError]                   = useState(null);

  const fileInputRef = useRef(null);

  const existingPassport = getDocumentByType(uploadedDocuments, "Passport");

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
    setExtractionDone(false);
    const reader = new FileReader();
    reader.onload = (ev) =>
      setPreview({ src: ev.target.result, file, timestamp: new Date().toISOString() });
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleExtract = async () => {
    if (!preview?.file) return;
    setIsExtracting(true);
    setError(null);

    try {
      const result = await uploadPassport(preview.file);

      if (result.valid && result.passportData) {
        const existingNumber = existingPassport?.passportData?.passportNumber;
        const existingName   = existingPassport?.passportData?.fullName;
        const incomingNumber = result.passportData.passportNumber;
        const incomingName   = result.passportData.fullName;

        const identityChanged =
          existingPassport &&
          (existingNumber !== incomingNumber || existingName !== incomingName);

        if (identityChanged) {
          onPassportReplaced({
            fullName:       incomingName   ?? null,
            passportNumber: incomingNumber ?? null,
          });
        } else {
          updateApplicantIdentity({
            fullName:       incomingName   ?? null,
            passportNumber: incomingNumber ?? null,
          });
        }
      }

      const documentRecord = {
        requiredDocument: "Passport",
        fileName:         preview.file.name,
        detectedType:     result.documentType,
        valid:            result.valid,
        passportData:     result.passportData,
        uploadedAt:       preview.timestamp,
      };

      addDocument(documentRecord);

      if (result.valid && caseData?._id) {
        addVerifiedDocument(caseData._id, "Passport").catch((err) =>
          console.error("addVerifiedDocument failed:", err)
        );
        if (result.passportData) {
          savePassportData(caseData._id, result.passportData).catch((err) =>
            console.error("savePassportData failed:", err)
          );
        }
      }

      addActivity(
        "upload",
        result.valid
          ? "Passport verified and details extracted successfully"
          : "Passport extraction failed — please upload a clearer image"
      );

      if (!result.valid) {
        setError(
          "Could not verify this passport. Please ensure the MRZ zone is clearly visible and try again."
        );
      }

      setExtractionDone(true);
    } catch (err) {
      console.error(err);
      setError("Extraction failed. Please check your connection and try again.");
      addActivity("error", "Passport extraction failed");
    } finally {
      setIsExtracting(false);
    }
  };

  const hasNewPreview     = Boolean(preview && !extractionDone);
  const showCard          = Boolean(existingPassport?.valid && existingPassport?.passportData && !hasNewPreview);
  const previewSrc        = preview?.src ?? null;
  const hasEverUploaded   = Boolean(existingPassport);
  const uploadButtonLabel = hasEverUploaded ? "Upload Again" : "Upload";

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-card)] p-6 mb-8">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileSelect}
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-[var(--r-lg)] bg-[var(--c-green-bg)] flex items-center justify-center shrink-0">
          <span className="text-xl">🛂</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--c-text)]">Passport Upload</h2>
          <p className="text-sm text-[var(--c-text-muted)]">
            Upload the biographical page of your passport
          </p>
        </div>
        {existingPassport?.valid && !hasNewPreview && (
          <span className="ml-auto flex items-center gap-1.5 bg-[var(--c-success-bg)] text-[var(--c-success)] text-xs font-semibold px-3 py-1 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Verified
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: upload / preview */}
        <div>
          {!hasNewPreview && !existingPassport ? (
            <button
              type="button"
              onClick={openFilePicker}
              className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-[var(--c-border)] rounded-[var(--r-xl)] cursor-pointer bg-[var(--c-bg)] hover:bg-[var(--c-green-bg)] hover:border-[var(--c-green)] transition group"
            >
              <svg
                className="w-10 h-10 text-[var(--c-text-muted)] group-hover:text-[var(--c-green)] mb-3 transition"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-sm font-medium text-[var(--c-text-mid)] group-hover:text-[var(--c-green)]">
                Click to upload passport image
              </span>
              <span className="text-xs text-[var(--c-text-muted)] mt-1">JPG, JPEG, PNG</span>
            </button>
          ) : (
            <div className="space-y-3">
              {previewSrc ? (
                <div className="relative rounded-[var(--r-xl)] overflow-hidden border border-[var(--c-border)] bg-[var(--c-bg)]">
                  <img src={previewSrc} alt="Passport preview" className="w-full object-contain max-h-52" />
                </div>
              ) : existingPassport?.uploadedAt ? (
                <div className="rounded-[var(--r-xl)] border border-[var(--c-border)] bg-[var(--c-bg)] flex items-center justify-center h-52 text-sm text-[var(--c-text-muted)]">
                  Passport uploaded ✓
                </div>
              ) : null}

              {(preview?.timestamp || existingPassport?.uploadedAt) && (
                <p className="text-xs text-[var(--c-text-muted)] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(preview?.timestamp || existingPassport?.uploadedAt).toLocaleString()}
                </p>
              )}

              <div className="flex gap-2">
                {hasNewPreview && (
                  <button
                    type="button"
                    onClick={handleExtract}
                    disabled={isExtracting}
                    className="flex-1 flex items-center justify-center gap-2 bg-[var(--c-green)] text-white px-4 py-2.5 rounded-[var(--r-lg)] hover:bg-[var(--c-green-mid)] font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {isExtracting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Extract Details
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={isExtracting}
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

        {/* Right: extracted details card */}
        <div>
          {showCard ? (
            <div className="h-full bg-[var(--c-success-bg)] border border-[var(--c-success-border)] rounded-[var(--r-xl)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-[var(--c-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-[var(--c-green)]">Extracted Details</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Full Name",       value: existingPassport.passportData.fullName        },
                  { label: "Passport Number", value: existingPassport.passportData.passportNumber  },
                  { label: "Nationality",     value: existingPassport.passportData.nationality     },
                  { label: "Date of Birth",   value: existingPassport.passportData.dateOfBirth     },
                  { label: "Expiry Date",     value: existingPassport.passportData.expiryDate      },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--c-green-mid)]">
                      {label}
                    </span>
                    <span className="text-sm font-semibold text-[var(--c-text)] mt-0.5">
                      {value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center rounded-[var(--r-xl)] border-2 border-dashed border-[var(--c-border)] bg-[var(--c-bg)] p-6 text-center">
              <svg className="w-10 h-10 text-[var(--c-border)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm text-[var(--c-text-muted)] font-medium">
                Extracted details will appear here
              </p>
              <p className="text-xs text-[var(--c-text-muted)] mt-1">
                Upload your passport and click Extract Details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PassportUploadSection;