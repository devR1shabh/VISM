import { useCase } from "../../context/CaseContext";
import { calculateReadiness, deriveDocumentSummary } from "../../engines/readinessEngine";

function ReadinessScore() {
  const { caseData, uploadedDocuments } = useCase();

  const requiredDocuments = caseData?.analysis?.documents || [];

  const { valid, required, missing } = deriveDocumentSummary(
    requiredDocuments,
    uploadedDocuments
  );

  const { score, label, color } = calculateReadiness(valid, required);

  const colorMap = {
    gray:  "bg-[var(--c-text-muted)]",
    red:   "bg-[var(--c-error)]",
    amber: "bg-[var(--c-warning)]",
    blue:  "bg-[var(--c-info)]",
    green: "bg-[var(--c-green)]",
  };

  const barClass = colorMap[color] || "bg-[var(--c-text-muted)]";

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <h2 className="text-lg font-bold text-[var(--c-text)] mb-4">Application Completion</h2>

      <div className="w-full bg-[var(--c-border)] rounded-full h-7 overflow-hidden mb-3">
        <div
          className={`${barClass} h-7 flex items-center justify-center text-white text-sm font-semibold transition-all duration-500`}
          style={{ width: `${score}%`, minWidth: score > 0 ? "3rem" : "0" }}
        >
          {score > 10 ? `${score}%` : ""}
        </div>
      </div>

      <p className="text-sm font-semibold text-[var(--c-text-mid)] mb-4">{label}</p>

      <div className="bg-[var(--c-bg)] rounded-[var(--r-lg)] border border-[var(--c-border)] p-4 mb-4">
        <p className="text-sm font-medium text-[var(--c-text)]">
          {valid} of {required} required documents ready
        </p>
        <p className="text-xs text-[var(--c-text-muted)] mt-1">
          Complete document submission to move closer to visa application readiness.
        </p>
      </div>

      <div className="space-y-1.5 text-sm text-[var(--c-text-muted)]">
        <p>✓ {valid} valid document{valid !== 1 ? "s" : ""} uploaded</p>
        <p>◦ {required} required document{required !== 1 ? "s" : ""}</p>
        {missing.length > 0 && (
          <p className="text-[var(--c-warning)]">
            ⚠ {missing.length} document{missing.length !== 1 ? "s" : ""} still missing
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-[var(--c-text-muted)]">
        Progress updates automatically as documents are uploaded and validated.
      </p>
    </div>
  );
}

export default ReadinessScore;