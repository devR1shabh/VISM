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
    <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_30px_90px_-30px_rgba(34,231,197,0.3)] backdrop-blur-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-[#22E7C5] mb-2">
            Document Progress
          </p>
          <h2 className="text-2xl font-semibold text-white">Application Document Status</h2>
          <p className={`mt-2 text-sm font-medium ${allVerified ? "text-[#39F5D5]" : "text-[#B8C5D1]"}`}>
            {allVerified
              ? "✓ Ready For Next Step"
              : `${missing.length} document${missing.length !== 1 ? "s" : ""} remaining`}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-right">
          <p className="text-xs uppercase tracking-[0.28em] text-[#B8C5D1]">Verified Documents</p>
          <p className="mt-2 text-4xl font-bold text-white">{verifiedCount}</p>
          <p className="text-sm text-[#B8C5D1]">/ {totalCount}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-full bg-white/10 h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#22E7C5] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-[#B8C5D1]">
          <span>{progress}% complete</span>
          <span>{totalCount === 0 ? "No documents required" : `${verifiedCount} of ${totalCount}`}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {requiredDocuments.map((doc) => {
          const uploaded = uploadedDocuments.find(
            (u) => u.requiredDocument === doc && u.valid
          );
          return (
            <div
              key={doc}
              className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium ${
                uploaded
                  ? "border-[#22E7C5] bg-[#22E7C5]/10 text-white"
                  : "border-white/10 bg-white/5 text-[#B8C5D1]"
              }`}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs">
                {uploaded ? "✓" : "!"}
              </span>
              {doc}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleProceed}
          disabled={!allVerified}
          title={!allVerified ? "Please verify all documents to continue" : ""}
          className={`inline-flex items-center gap-2 rounded-3xl px-6 py-3 text-sm font-semibold transition shadow ${
            allVerified
              ? "bg-[#22E7C5] text-[#061A28] hover:bg-[#39F5D5] cursor-pointer"
              : "bg-white/10 text-[#B8C5D1] cursor-not-allowed"
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
    </section>
  );
}

export default DocumentProgress;
