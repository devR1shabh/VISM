// src/components/upload/DocumentProgress.jsx

import { useNavigate } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../../context/CaseContext";
import { deriveDocumentSummary } from "../../engines/readinessEngine";

function DocumentProgress() {
  // ── Logic completely unchanged ─────────────────────────────────────────────
  const navigate = useNavigate();
  const { caseData, uploadedDocuments, setWorkflowStep } = useCase();

  const requiredDocuments = caseData?.analysis?.documents || [];

  const { valid: verifiedCount, required: totalCount, missing } =
    deriveDocumentSummary(requiredDocuments, uploadedDocuments);

  const allVerified = verifiedCount === totalCount && totalCount > 0;
  const progress    = totalCount === 0 ? 0 : Math.round((verifiedCount / totalCount) * 100);

  const handleProceed = () => {
    setWorkflowStep(WORKFLOW_STEPS.DOCUMENTS_DONE);
    navigate("/journey");
  };

  return (
    <section className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-card)] p-8">

      {/* Header row */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-1">
            Document Progress
          </p>
          <h2 className="text-xl font-bold text-[var(--c-text)]">Application Document Status</h2>
          <p className={`mt-1.5 text-sm font-medium ${
            allVerified ? "text-[var(--c-success)]" : "text-[var(--c-text-muted)]"
          }`}>
            {allVerified
              ? "✓ Ready For Next Step"
              : `${missing.length} document${missing.length !== 1 ? "s" : ""} remaining`}
          </p>
        </div>

        <div className="rounded-[var(--r-xl)] border border-[var(--c-border)] bg-[var(--c-bg)] px-6 py-4 text-right shrink-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--c-text-muted)] mb-1">
            Verified Documents
          </p>
          <p className="font-display text-4xl font-bold text-[var(--c-text)]">{verifiedCount}</p>
          <p className="text-sm text-[var(--c-text-muted)]">/ {totalCount}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2 mb-6">
        <div className="rounded-full bg-[var(--c-border)] h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--c-green)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-[var(--c-text-muted)]">
          <span>{progress}% complete</span>
          <span>
            {totalCount === 0 ? "No documents required" : `${verifiedCount} of ${totalCount}`}
          </span>
        </div>
      </div>

      {/* Document status pills */}
      <div className="flex flex-wrap gap-2 mb-7">
        {requiredDocuments.map((doc) => {
          const uploaded = uploadedDocuments.find(
            (u) => u.requiredDocument === doc && u.valid
          );
          return (
            <div
              key={doc}
              className={`inline-flex items-center gap-2 rounded-[var(--r-lg)] border px-3 py-2 text-sm font-medium ${
                uploaded
                  ? "border-[var(--c-success-border)] bg-[var(--c-success-bg)] text-[var(--c-success)]"
                  : "border-[var(--c-border)] bg-[var(--c-bg)] text-[var(--c-text-muted)]"
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                  uploaded
                    ? "bg-[var(--c-success)] text-white"
                    : "bg-[var(--c-border)] text-[var(--c-text-muted)]"
                }`}
              >
                {uploaded ? "✓" : "!"}
              </span>
              {doc}
            </div>
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
          className={`inline-flex items-center gap-2 rounded-[var(--r-lg)] px-6 py-3 text-sm font-semibold transition shadow-sm ${
            allVerified
              ? "bg-[var(--c-green)] text-white hover:bg-[var(--c-green-mid)] cursor-pointer active:scale-[0.98]"
              : "bg-[var(--c-border)] text-[var(--c-text-muted)] cursor-not-allowed"
          }`}
        >
          Proceed To Journey
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

    </section>
  );
}

export default DocumentProgress;