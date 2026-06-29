// src/components/applicant/CaseCard.jsx
//
// FEATURE 5 CHANGE:
//   Added PackageBadge — shows which tier the case was created under.
//   Reads caseRecord.package (self_supported | assisted | concierge).
//   Falls back to "self_supported" for legacy cases created before Feature 5.

import { useNavigate }    from "react-router-dom";
import { useCase }        from "../../context/CaseContext.jsx";
import { formatDate }     from "../../utils/dateUtils.js";
import { getPackageById } from "../../data/packages.js";

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    "Pending":        "bg-[var(--c-warning-bg)]  text-[var(--c-warning)]  border-[var(--c-warning-border)]",
    "Approved":       "bg-[var(--c-green-bg)]    text-[var(--c-green)]    border-[var(--c-green-light)]",
    "Rejected":       "bg-[var(--c-error-bg)]    text-[var(--c-error)]    border-[var(--c-error-border)]",
    "Need Documents": "bg-[var(--c-info-bg)]     text-[var(--c-info)]     border-[var(--c-info-border)]",
  };
  const cls = map[status] || map["Pending"];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] ${cls}`}>
      {status || "Pending"}
    </span>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, color = "green" }) {
  const fillColor = color === "green" ? "bg-[var(--c-green)]"
                  : color === "amber" ? "bg-[var(--c-warning)]"
                  : color === "red"   ? "bg-[var(--c-error)]"
                  :                    "bg-[var(--c-green)]";
  return (
    <div className="h-1.5 w-full rounded-full overflow-hidden bg-[var(--c-border)]">
      <div
        className={`h-full rounded-full transition-all duration-500 ${fillColor}`}
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

// ── Package badge ─────────────────────────────────────────────────────────────
// Shows the tier for this case. Subtle — sits alongside other meta info.
function PackageBadge({ packageId }) {
  const pkg = getPackageById(packageId || "self_supported");

  const styles = {
    self_supported: "bg-[var(--c-bg)] text-[var(--c-text-muted)] border-[var(--c-border)]",
    assisted:       "bg-[var(--c-green-bg)] text-[var(--c-green)] border-[var(--c-green-light)]",
    concierge:      "bg-[var(--c-text)]/5 text-[var(--c-text)] border-[var(--c-text)]/20",
  };

  const cls = styles[pkg.id] || styles.self_supported;

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${cls}`}>
      {pkg.name}
    </span>
  );
}

// ── CaseCard ──────────────────────────────────────────────────────────────────
function CaseCard({ caseRecord }) {
  const { setCaseData } = useCase();
  const navigate        = useNavigate();

  const {
    _id,
    caseId,
    visaType,
    country,
    processorStatus,
    processorNotes    = [],
    uploadedDocuments = [],
    analysis,
    createdAt,
    package:          packageId,  // renamed to avoid reserved-word confusion
  } = caseRecord;

  const requiredDocs = analysis?.documents || [];
  const totalDocs    = requiredDocs.length || 0;

  const verifiedDocs = uploadedDocuments.filter(
    (d) => d.verified && requiredDocs.includes(d.type)
  ).length;

  const verifiedPct = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0;

  const barColor = verifiedPct === 100 ? "green"
                 : verifiedPct > 0     ? "amber"
                 :                       "red";

  const noteCount = processorNotes.length;

  const handleOpen = () => {
    let workflowStep = 1;
    if (caseRecord.analysis)                   workflowStep = 2;
    if (uploadedDocuments.length)              workflowStep = 3;
    if (caseRecord.questionnaire?.submittedAt) workflowStep = 4;

    setCaseData({
      ...caseRecord,
      caseId:       caseRecord.caseId || caseRecord._id,
      workflowStep,
    });
    navigate("/dashboard");
  };

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6 transition hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--c-green-light)] group">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-0.5">
            {caseId || _id}
          </p>
          <h3 className="text-base font-bold text-[var(--c-text)] truncate leading-snug">
            {visaType || "—"}
          </h3>
          <p className="text-sm text-[var(--c-text-muted)] mt-0.5">{country || "—"}</p>
        </div>
        <StatusBadge status={processorStatus || "Pending"} />
      </div>

      {/* Document progress */}
      {totalDocs > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--c-text-muted)]">
              Documents
            </span>
            <span className="text-[10px] font-semibold text-[var(--c-text-muted)]">
              {verifiedDocs} / {totalDocs} verified
            </span>
          </div>
          <ProgressBar pct={verifiedPct} color={barColor} />
        </div>
      )}

      {/* Meta row — date, package badge, processor notes */}
      <div className="flex items-center gap-3 flex-wrap text-xs text-[var(--c-text-muted)] mb-5">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(createdAt)}
        </span>

        {/* FEATURE 5: package badge */}
        <PackageBadge packageId={packageId} />

        {noteCount > 0 && (
          <span className="flex items-center gap-1 text-[var(--c-info)]">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            {noteCount} {noteCount === 1 ? "note" : "notes"} from processor
          </span>
        )}
      </div>

      {/* Open button */}
      <button
        onClick={handleOpen}
        className="w-full rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] py-2.5 text-sm font-semibold text-[var(--c-text-mid)] transition hover:bg-[var(--c-green)] hover:text-white hover:border-[var(--c-green)] group-hover:border-[var(--c-green-light)]"
      >
        Open Case
      </button>

    </div>
  );
}

export default CaseCard;