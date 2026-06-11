// src/components/upload/PassportUploadSection.jsx

import { useState, useRef } from "react";
import { useCase } from "../../context/CaseContext";
import { uploadPassport, addVerifiedDocument } from "../../services/api";
import { getDocumentByType } from "../../utils/documentUtils";

function PassportUploadSection() {
  const {
    caseData,
    uploadedDocuments,
    addDocument,
    addActivity,
    onPassportReplaced,
  } = useCase();

  const [preview, setPreview] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const existingPassport = getDocumentByType(uploadedDocuments, "Passport");

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) =>
      setPreview({ src: ev.target.result, file, timestamp: new Date().toISOString() });
    reader.readAsDataURL(file);
  };

  const handleExtract = async () => {
    if (!preview?.file) return;
    setIsExtracting(true);
    setError(null);

    try {
      const result = await uploadPassport(preview.file);

      if (result.valid && result.passportData?.passportNumber) {
        const existingNumber = existingPassport?.passportData?.passportNumber;
        const incomingNumber = result.passportData.passportNumber;
        if (existingNumber && existingNumber !== incomingNumber) {
          onPassportReplaced();
        }
      }

      const documentRecord = {
        requiredDocument: "Passport",
        fileName: preview.file.name,
        detectedType: result.documentType,
        valid: result.valid,
        passportData: result.passportData,
        uploadedAt: preview.timestamp,
      };

      addDocument(documentRecord);

      if (result.valid && caseData?._id) {
        await addVerifiedDocument(caseData._id, "Passport");
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
    } catch (err) {
      console.error(err);
      setError("Extraction failed. Please check your connection and try again.");
      addActivity("error", "Passport extraction failed");
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReupload = () => {
    setPreview(null);
    setError(null);
    fileInputRef.current?.click();
  };

  const passport = existingPassport;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
          <span className="text-xl">🛂</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Passport Upload</h2>
          <p className="text-sm text-gray-500">
            Upload the biographical page of your passport
          </p>
        </div>
        {passport?.valid && (
          <span className="ml-auto flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Verified
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload / Preview */}
        <div>
          {!preview && !passport ? (
            <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition group">
              <svg
                className="w-10 h-10 text-gray-400 group-hover:text-blue-400 mb-3 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                Click to upload passport image
              </span>
              <span className="text-xs text-gray-400 mt-1">JPG, JPEG, PNG</span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileSelect}
              />
            </label>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={preview?.src}
                  alt="Passport preview"
                  className="w-full object-contain max-h-52"
                />
              </div>

              {(preview?.timestamp || passport?.uploadedAt) && (
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {new Date(
                    preview?.timestamp || passport?.uploadedAt
                  ).toLocaleString()}
                </p>
              )}

              <div className="flex gap-2">
                {preview && !passport && (
                  <button
                    type="button"
                    onClick={handleExtract}
                    disabled={isExtracting}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {isExtracting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Extract Details
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleReupload}
                  className="flex items-center justify-center gap-1.5 border border-gray-300 text-gray-600 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  {passport ? "Replace" : "Change"}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Extracted Details Card */}
        <div>
          {passport?.valid && passport?.passportData ? (
            <div className="h-full bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="font-semibold text-green-800">Extracted Details</h3>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Full Name", value: passport.passportData.fullName },
                  { label: "Passport Number", value: passport.passportData.passportNumber },
                  { label: "Nationality", value: passport.passportData.nationality },
                  { label: "Date of Birth", value: passport.passportData.dateOfBirth },
                  { label: "Expiry Date", value: passport.passportData.expiryDate },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-xs font-medium text-green-700 uppercase tracking-wide">
                      {label}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 mt-0.5">
                      {value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
              <svg
                className="w-10 h-10 text-gray-300 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm text-gray-400 font-medium">
                Extracted details will appear here
              </p>
              <p className="text-xs text-gray-400 mt-1">
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