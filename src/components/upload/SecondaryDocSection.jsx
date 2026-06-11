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

  const [preview, setPreview] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const existingDoc = getDocumentByType(uploadedDocuments, documentName);
  const icon = DOC_ICONS[documentName] || "📄";

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) =>
      setPreview({ src: ev.target.result, file, timestamp: new Date().toISOString() });
    reader.readAsDataURL(file);
  };

  const handleVerify = async () => {
    if (!preview?.file) return;
    setIsVerifying(true);
    setError(null);

    try {
      const result = await verifyDocument(preview.file, documentName);

      const documentRecord = {
        requiredDocument: documentName,
        fileName: preview.file.name,
        detectedType: result.documentType,
        valid: result.valid,
        confidence: result.confidence,
        matchedKeywords: result.matchedKeywords,
        uploadedAt: preview.timestamp,
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
    } catch (err) {
      console.error(err);
      setError("Verification failed. Please check your connection and try again.");
      addActivity("error", `${documentName} verification failed`);
    } finally {
      setIsVerifying(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReupload = () => {
    setPreview(null);
    setError(null);
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{documentName}</h3>
          <p className="text-sm text-gray-500">
            Upload and verify your {documentName.toLowerCase()}
          </p>
        </div>
        {existingDoc?.valid && (
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
        {existingDoc && !existingDoc.valid && (
          <span className="ml-auto flex items-center gap-1.5 bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
            Failed
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Upload / Preview */}
        <div>
          {!preview && !existingDoc ? (
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-purple-50 hover:border-purple-400 transition group">
              <svg
                className="w-9 h-9 text-gray-400 group-hover:text-purple-400 mb-2 transition"
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
              <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">
                Click to upload
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
                  alt={`${documentName} preview`}
                  className="w-full object-contain max-h-44"
                />
              </div>

              {(preview?.timestamp || existingDoc?.uploadedAt) && (
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
                    preview?.timestamp || existingDoc?.uploadedAt
                  ).toLocaleString()}
                </p>
              )}

              <div className="flex gap-2">
                {preview && !existingDoc && (
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying...
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Verify Document
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
                  {existingDoc ? "Replace" : "Change"}
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

        {/* Verification Result */}
        <div>
          {existingDoc?.valid ? (
            <div className="h-full bg-green-50 border border-green-200 rounded-xl p-5 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-green-800 text-base">✓ Verified</p>
                  <p className="text-sm text-green-700">✓ Document Accepted</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                <strong className="text-gray-700">File:</strong> {existingDoc.fileName}
              </p>
              {existingDoc.uploadedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  <strong className="text-gray-700">Uploaded:</strong>{" "}
                  {new Date(existingDoc.uploadedAt).toLocaleString()}
                </p>
              )}
            </div>
          ) : existingDoc && !existingDoc.valid ? (
            <div className="h-full bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-red-700 text-base">Verification Failed</p>
                  <p className="text-sm text-red-600">Document not accepted</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                This document does not appear to be a valid {documentName}. Please
                upload the correct document.
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
              <svg
                className="w-9 h-9 text-gray-300 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-gray-400 font-medium">
                Verification result will appear here
              </p>
              <p className="text-xs text-gray-400 mt-1">
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