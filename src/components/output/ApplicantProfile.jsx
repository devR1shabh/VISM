import { calculateReadiness, deriveDocumentSummary } from "../../engines/readinessEngine";

function ApplicantProfile({ caseData, uploadedDocuments = [] }) {
  if (!caseData) return null;

  const requiredDocuments = caseData.analysis?.documents || [];

  const { required, valid, invalid, missing } = deriveDocumentSummary(
    requiredDocuments,
    uploadedDocuments
  );

  const { score, label, color } = calculateReadiness(valid, required);

  const colorMap = {
    gray:  { bar: "bg-[var(--c-text-muted)]", text: "text-[var(--c-text-muted)]" },
    red:   { bar: "bg-[var(--c-error)]",      text: "text-[var(--c-error)]"      },
    amber: { bar: "bg-[var(--c-warning)]",    text: "text-[var(--c-warning)]"    },
    blue:  { bar: "bg-[var(--c-info)]",       text: "text-[var(--c-info)]"       },
    green: { bar: "bg-[var(--c-success)]",    text: "text-[var(--c-success)]"    },
  };

  const theme = colorMap[color] || colorMap.gray;

  const statusColors = {
    "In Progress": "bg-[var(--c-info-bg)] text-[var(--c-info)]",
    "Ready":       "bg-[var(--c-success-bg)] text-[var(--c-success)]",
    "Submitted":   "bg-purple-100 text-purple-700",
    "On Hold":     "bg-[var(--c-warning-bg)] text-[var(--c-warning)]",
  };

  const caseStatus  = caseData.status || "In Progress";
  const statusClass = statusColors[caseStatus] || "bg-[var(--c-bg)] text-[var(--c-text-muted)]";

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <h2 className="text-lg font-bold text-[var(--c-text)] mb-5">Applicant Profile</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Case ID",     value: caseData.caseId || caseData.id || "—" },
          { label: "Visa Type",   value: caseData.visaType || "—"               },
          { label: "Destination", value: caseData.country  || "—"               },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[var(--c-bg)] rounded-[var(--r-lg)] border border-[var(--c-border)] p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-1">{label}</p>
            <p className="font-semibold text-[var(--c-text)] text-sm">{value}</p>
          </div>
        ))}
        <div className="bg-[var(--c-bg)] rounded-[var(--r-lg)] border border-[var(--c-border)] p-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-1">Status</p>
          <span className={`inline-block text-[10px] font-bold uppercase tracking-[0.06em] px-2 py-1 rounded-full ${statusClass}`}>
            {caseStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="border border-[var(--c-border)] rounded-[var(--r-lg)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--c-text)]">{required}</p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">Required</p>
        </div>
        <div className="border border-[var(--c-success-border)] bg-[var(--c-success-bg)] rounded-[var(--r-lg)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--c-success)]">{valid}</p>
          <p className="text-xs text-[var(--c-success)] mt-1">Valid</p>
        </div>
        <div className="border border-[var(--c-error-border)] bg-[var(--c-error-bg)] rounded-[var(--r-lg)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--c-error)]">{invalid}</p>
          <p className="text-xs text-[var(--c-error)] mt-1">Invalid</p>
        </div>
        <div className="border border-[var(--c-warning-border)] bg-[var(--c-warning-bg)] rounded-[var(--r-lg)] p-3 text-center">
          <p className="text-2xl font-bold text-[var(--c-warning)]">{missing.length}</p>
          <p className="text-xs text-[var(--c-warning)] mt-1">Missing</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[var(--c-text-mid)]">Readiness Score</span>
          <span className={`text-sm font-semibold ${theme.text}`}>{score}% — {label}</span>
        </div>
        <div className="w-full bg-[var(--c-border)] rounded-full h-3 overflow-hidden">
          <div
            className={`${theme.bar} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-xs text-[var(--c-text-muted)] mt-2">
          Score = valid documents ÷ required documents × 100. Updates live as documents are uploaded.
        </p>
      </div>
    </div>
  );
}

export default ApplicantProfile;