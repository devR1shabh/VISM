import { useCase } from "../../context/CaseContext";
import { calculateRisks } from "../../engines/riskEngine";

function RiskPanel() {
  const { caseData, uploadedDocuments } = useCase();

  const requiredDocuments = caseData?.analysis?.documents || [];
  const risks = calculateRisks(requiredDocuments, uploadedDocuments);

  const getRiskColor = (level) => {
    switch (level) {
      case "HIGH":
        return {
          border: "border-[var(--c-error)]",
          bg:     "bg-[var(--c-error-bg)]",
          text:   "text-[var(--c-error)]",
          badge:  "bg-[var(--c-error-bg)] text-[var(--c-error)]",
        };
      case "MEDIUM":
        return {
          border: "border-[var(--c-warning)]",
          bg:     "bg-[var(--c-warning-bg)]",
          text:   "text-[var(--c-warning)]",
          badge:  "bg-[var(--c-warning-bg)] text-[var(--c-warning)]",
        };
      default:
        return {
          border: "border-[var(--c-success)]",
          bg:     "bg-[var(--c-success-bg)]",
          text:   "text-[var(--c-success)]",
          badge:  "bg-[var(--c-success-bg)] text-[var(--c-success)]",
        };
    }
  };

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[var(--c-text)]">Risk Assessment</h2>
        <span className="text-xs text-[var(--c-text-muted)] font-medium">
          {risks.length} Risk{risks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {risks.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm font-medium text-[var(--c-success)]">✓ No Risks Detected</p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">All required documents appear complete.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {risks.map((risk, index) => {
            const styles = getRiskColor(risk.level);
            return (
              <div
                key={index}
                className={`${styles.bg} border-l-4 ${styles.border} rounded-[var(--r-lg)] p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`${styles.badge} text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-0.5 rounded-full`}>
                    {risk.level}
                  </span>
                </div>
                <p className={`${styles.text} text-sm font-medium`}>{risk.message}</p>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default RiskPanel;