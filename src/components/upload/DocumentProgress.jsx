// src/components/upload/DocumentProgress.jsx

import { useNavigate } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../../context/CaseContext";
import { deriveDocumentSummary } from "../../engines/readinessEngine";

function DocumentProgress() {
  const navigate = useNavigate();
  const { caseData, uploadedDocuments, setWorkflowStep } = useCase();

  const requiredDocuments = caseData?.analysis?.documents || [];

  const { valid: verifiedCount, required: totalCount, missing } =
    deriveDocumentSummary(requiredDocuments, uploadedDocuments);

  const allVerified = verifiedCount === totalCount && totalCount > 0;
  const progress =
    totalCount === 0 ? 0 : Math.round((verifiedCount / totalCount) * 100);

  const handleProceed = () => {
    // Advance workflow: documents done → unlock Journey
    setWorkflowStep(WORKFLOW_STEPS.DOCUMENTS_DONE);
    navigate("/journey");
  };

  return (
    <div
      className={`rounded-xl shadow p-6 border-2 transition ${
        allVerified ? "bg-green-50 border-green-300" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Document Progress</h3>
          <p
            className={`text-sm mt-0.5 font-semibold ${
              allVerified ? "text-green-700" : "text-gray-500"
            }`}
          >
            {allVerified
              ? "✓ Ready For Next Step"
              : `${missing.length} document${missing.length !== 1 ? "s" : ""} remaining`}
          </p>
        </div>

        <div className="text-right">
          <span
            className={`text-4xl font-extrabold ${
              allVerified ? "text-green-600" : "text-blue-600"
            }`}
          >
            {verifiedCount}
          </span>
          <span className="text-2xl font-bold text-gray-400"> / {totalCount}</span>
          <p className="text-xs text-gray-500 mt-0.5">Documents Verified</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            allVerified ? "bg-green-500" : "bg-blue-600"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Document status chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {requiredDocuments.map((doc) => {
          const uploaded = uploadedDocuments.find(
            (u) => u.requiredDocument === doc && u.valid
          );
          return (
            <span
              key={doc}
              className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${
                uploaded
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {uploaded ? (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {doc}
            </span>
          );
        })}
      </div>

      {/* Proceed button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleProceed}
          disabled={!allVerified}
          title={!allVerified ? "Please verify all documents to continue" : ""}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition shadow ${
            allVerified
              ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Proceed To Journey
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
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default DocumentProgress;