// src/components/upload/DocumentProgress.jsx
//
// FEATURE 2 CHANGE:
//   Now shows two progress rows: mandatory completion and supporting completion.
//   Uses useConfig() to know which required docs are mandatory vs supporting.

import { useNavigate }                from "react-router-dom";
import { useCase, WORKFLOW_STEPS }    from "../../context/CaseContext";
import { useConfig }                  from "../../context/ConfigContext.jsx";
import { deriveDocumentSummary }      from "../../engines/readinessEngine";

function MiniProgress({ label, verified, total, color }) {
  const pct = total === 0 ? 0 : Math.round((verified / total) * 100);
  const barColor = color === "error"   ? "bg-[var(--c-error)]"
                 : color === "info"    ? "bg-[var(--c-info)]"
                 :                       "bg-[var(--c-green)]";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[var(--c-text-mid)]">{label}</span>
        <span className="text-[var(--c-text-muted)]">{verified} / {total}</span>
      </div>
      <div className="rounded-full bg-[var(--c-border)] h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function DocumentProgress() {
  const navigate = useNavigate();
  const { caseData, uploadedDocuments, setWorkflowStep } = useCase();
  const { documents: configDocs } = useConfig();

  const requiredDocuments = caseData?.analysis?.documents || [];

  const { valid: verifiedCount, required: totalCount, missing } =
    deriveDocumentSummary(requiredDocuments, uploadedDocuments);

  const progress = totalCount === 0 ? 0 : Math.round((verifiedCount / totalCount) * 100);

  // ── Mandatory breakdown ───────────────────────────────────────────────────
  const mandatoryRequired = requiredDocuments.filter(
    (doc) => configDocs.categoryMap[doc] === "mandatory"
  );
  const mandatoryVerified = uploadedDocuments.filter(
    (u) => u.valid && mandatoryRequired.includes(u.requiredDocument)
  ).length;

  // ── Supporting breakdown ──────────────────────────────────────────────────
  const supportingRequired = requiredDocuments.filter(
    (doc) => configDocs.categoryMap[doc] === "supporting"
  );
  const supportingVerified = uploadedDocuments.filter(
    (u) => u.valid && supportingRequired.includes(u.requiredDocument)
  ).length;

  const allMandatoryDone = mandatoryRequired.length > 0 &&
                           mandatoryVerified === mandatoryRequired.length;

  const handleProceed = () => {
    setWorkflowStep(WORKFLOW_STEPS.DOCUMENTS_DONE);
    navigate("/questionnaire");
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
          <p className="mt-1.5 text-sm font-medium text-[var(--c-text-muted)]">
            {allMandatoryDone
              ? "✓ All mandatory documents verified — supporting docs improve your score"
              : `${mandatoryVerified} of ${mandatoryRequired.length} mandatory documents verified`}
          </p>
        </div>

        <div className="rounded-[var(--r-xl)] border border-[var(--c-border)] bg-[var(--c-bg)] px-6 py-4 text-right shrink-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--c-text-muted)] mb-1">
            Total Verified
          </p>
          <p className="font-display text-4xl font-bold text-[var(--c-text)]">{verifiedCount}</p>
          <p className="text-sm text-[var(--c-text-muted)]">/ {totalCount}</p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="space-y-2 mb-5">
        <div className="rounded-full bg-[var(--c-border)] h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--c-green)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-[var(--c-text-muted)]">
          <span>{progress}% complete ({verifiedCount}/{totalCount})</span>
          <span>{missing.length} remaining</span>
        </div>
      </div>

      {/* Mandatory / Supporting breakdown bars */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6 p-4 bg-[var(--c-bg)] rounded-[var(--r-xl)] border border-[var(--c-border)]">
        <MiniProgress
          label="Mandatory Documents"
          verified={mandatoryVerified}
          total={mandatoryRequired.length}
          color="error"
        />
        <MiniProgress
          label="Supporting Documents"
          verified={supportingVerified}
          total={supportingRequired.length}
          color="info"
        />
      </div>

      {/* Document status pills */}
      <div className="flex flex-wrap gap-2 mb-7">
        {requiredDocuments.map((doc) => {
          const uploaded = uploadedDocuments.find(
            (u) => u.requiredDocument === doc && u.valid
          );
          const isMandatory = configDocs.categoryMap[doc] === "mandatory";
          return (
            <div
              key={doc}
              className={`inline-flex items-center gap-2 rounded-[var(--r-lg)] border px-3 py-2 text-sm font-medium ${
                uploaded
                  ? "border-[var(--c-success-border)] bg-[var(--c-success-bg)] text-[var(--c-success)]"
                  : isMandatory
                  ? "border-[var(--c-error-border)] bg-[var(--c-error-bg)] text-[var(--c-error)]"
                  : "border-[var(--c-border)] bg-[var(--c-bg)] text-[var(--c-text-muted)]"
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                  uploaded
                    ? "bg-[var(--c-success)] text-white"
                    : isMandatory
                    ? "bg-[var(--c-error)] text-white"
                    : "bg-[var(--c-border)] text-[var(--c-text-muted)]"
                }`}
              >
                {uploaded ? "✓" : isMandatory ? "!" : "·"}
              </span>
              {doc}
            </div>
          );
        })}
      </div>

      {/* Proceed button — always enabled */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleProceed}
          className="inline-flex items-center gap-2 rounded-[var(--r-lg)] px-6 py-3 text-sm font-semibold transition shadow-sm bg-[var(--c-green)] text-white hover:bg-[var(--c-green-mid)] cursor-pointer active:scale-[0.98]"
        >
          Proceed To Questionnaire
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

    </section>
  );
}

export default DocumentProgress;