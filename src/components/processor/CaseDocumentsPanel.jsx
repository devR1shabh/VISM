// src/components/processor/CaseDocumentsPanel.jsx
//
// FEATURE 2 CHANGE:
//   Each document row now shows a MANDATORY / SUPPORTING badge.
//   Missing documents section is split — mandatory missing shown first, more urgently.

import { useConfig } from "../../context/ConfigContext.jsx";

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day:    "2-digit",
      month:  "short",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

function CategoryBadge({ category }) {
  if (!category) return null;
  const isMandatory = category === "mandatory";
  return (
    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded border ${
      isMandatory
        ? "border-[var(--c-error-border)] bg-[var(--c-error-bg)] text-[var(--c-error)]"
        : "border-[var(--c-info-border)] bg-[var(--c-info-bg)] text-[var(--c-info)]"
    }`}>
      {isMandatory ? "Mandatory" : "Supporting"}
    </span>
  );
}

function DocRow({ name, category, submitted, verified, uploadedAt }) {
  return (
    <div
      className={`flex items-center justify-between rounded-[var(--r-lg)] border px-4 py-3 ${
        verified
          ? "border-[var(--c-success-border)] bg-[var(--c-success-bg)]"
          : submitted
          ? "border-[var(--c-warning-border)] bg-[var(--c-warning-bg)]"
          : "border-[var(--c-border)] bg-[var(--c-bg)]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          verified ? "bg-[var(--c-success)]" : submitted ? "bg-[var(--c-warning)]" : "bg-[var(--c-border)]"
        }`}>
          {verified ? (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : submitted ? (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-[var(--c-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm font-semibold ${
              verified || submitted ? "text-[var(--c-text)]" : "text-[var(--c-text-muted)]"
            }`}>
              {name}
            </p>
            <CategoryBadge category={category} />
          </div>
          {uploadedAt && formatDate(uploadedAt) && (
            <p className="text-xs text-[var(--c-text-muted)] mt-0.5">
              Uploaded {formatDate(uploadedAt)}
            </p>
          )}
          {!submitted && (
            <p className="text-xs text-[var(--c-text-muted)] mt-0.5">Not submitted</p>
          )}
        </div>
      </div>

      <span className={`text-[10px] font-bold uppercase tracking-[0.06em] px-2.5 py-0.5 rounded-full border ${
        verified
          ? "border-[var(--c-success-border)] bg-[var(--c-success-bg)] text-[var(--c-success)]"
          : submitted
          ? "border-[var(--c-warning-border)] bg-[var(--c-warning-bg)] text-[var(--c-warning)]"
          : "border-[var(--c-border)] bg-[var(--c-bg)] text-[var(--c-text-muted)]"
      }`}>
        {verified ? "Verified" : submitted ? "Submitted" : "Missing"}
      </span>
    </div>
  );
}

function CaseDocumentsPanel({ caseRecord }) {
  const { documents } = useConfig();

  if (!caseRecord) return null;

  const { uploadedDocuments = [] } = caseRecord;
  const required    = documents.all;
  const total       = required.length;

  const uploadedCount = uploadedDocuments.filter((d) =>
    required.includes(d.type || d.requiredDocument)
  ).length;

  const verifiedCount = uploadedDocuments.filter((d) => d.verified).length;

  const missingDocs = required.filter((docName) =>
    !uploadedDocuments.some(
      (d) => (d.type === docName || d.requiredDocument === docName)
    )
  );

  // Split missing into mandatory and supporting for prioritised display
  const missingMandatory  = missingDocs.filter((d) => documents.categoryMap[d] === "mandatory");
  const missingSupporting = missingDocs.filter((d) => documents.categoryMap[d] === "supporting");

  const uploadedPct = Math.round((uploadedCount / total) * 100);
  const verifiedPct = Math.round((verifiedCount / total) * 100);

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-1">
            Document Review
          </p>
          <h3 className="text-base font-bold text-[var(--c-text)]">Submitted Documents</h3>
        </div>
        <span className="text-xs text-[var(--c-text-muted)] font-medium">
          {verifiedCount} / {total} verified
        </span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--c-text-muted)] mb-1">Uploaded</p>
          <p className="text-xl font-bold text-[var(--c-text)]">{uploadedCount} / {total}</p>
          <p className="text-xs text-[var(--c-text-muted)]">{uploadedPct}%</p>
        </div>
        <div className="rounded-[var(--r-lg)] border border-[var(--c-success-border)] bg-[var(--c-success-bg)] px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--c-success)] mb-1">Verified</p>
          <p className="text-xl font-bold text-[var(--c-success)]">{verifiedCount} / {total}</p>
          <p className="text-xs text-[var(--c-success)]">{verifiedPct}%</p>
        </div>
        <div className="rounded-[var(--r-lg)] border border-[var(--c-warning-border)] bg-[var(--c-warning-bg)] px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--c-warning)] mb-1">Missing</p>
          <p className="text-xl font-bold text-[var(--c-warning)]">{missingDocs.length}</p>
          <p className="text-xs text-[var(--c-warning)]">of {total}</p>
        </div>
      </div>

      {/* Missing — mandatory first, then supporting */}
      {missingMandatory.length > 0 && (
        <div className="mb-4 rounded-[var(--r-lg)] border border-[var(--c-error-border)] bg-[var(--c-error-bg)] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-error)] font-semibold mb-2">
            Missing Mandatory ({missingMandatory.length})
          </p>
          <ul className="space-y-1">
            {missingMandatory.map((doc) => (
              <li key={doc} className="text-xs text-[var(--c-text-mid)] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-error)] shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {missingSupporting.length > 0 && (
        <div className="mb-5 rounded-[var(--r-lg)] border border-[var(--c-info-border)] bg-[var(--c-info-bg)] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-info)] font-semibold mb-2">
            Missing Supporting ({missingSupporting.length})
          </p>
          <ul className="space-y-1">
            {missingSupporting.map((doc) => (
              <li key={doc} className="text-xs text-[var(--c-text-mid)] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-info)] shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Full document list */}
      <div className="space-y-2.5">
        {required.map((docName) => {
          const record   = uploadedDocuments.find(
            (d) => d.type === docName || d.requiredDocument === docName
          );
          const category = documents.categoryMap[docName] ?? null;
          return (
            <DocRow
              key={docName}
              name={docName}
              category={category}
              submitted={Boolean(record)}
              verified={record?.verified ?? false}
              uploadedAt={record?.uploadedAt}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CaseDocumentsPanel;