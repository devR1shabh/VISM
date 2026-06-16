function AIRiskPanel({ aiRisks = [] }) {
  // ── Risk level styles — logic completely unchanged ──────────────
  const getRiskStyles = (level) => {
    switch (level) {
      case "HIGH":
        return {
          border: "border-l-[var(--c-error)]",
          bg:     "bg-[var(--c-error-bg)]",
          badge:  "bg-[var(--c-error-bg)] text-[var(--c-error)] border-[var(--c-error-border)]",
          text:   "text-[var(--c-error)]",
        };
      case "MEDIUM":
        return {
          border: "border-l-[var(--c-warning)]",
          bg:     "bg-[var(--c-warning-bg)]",
          badge:  "bg-[var(--c-warning-bg)] text-[var(--c-warning)] border-[var(--c-warning-border)]",
          text:   "text-[var(--c-warning)]",
        };
      default:
        return {
          border: "border-l-[var(--c-success)]",
          bg:     "bg-[var(--c-success-bg)]",
          badge:  "bg-[var(--c-success-bg)] text-[var(--c-success)] border-[var(--c-success-border)]",
          text:   "text-[var(--c-success)]",
        };
    }
  };

  const isLoading = aiRisks.length === 0;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-[var(--c-text)]">AI Risk Assessment</h2>
          {!isLoading && (
            <p className="text-xs text-[var(--c-text-muted)] mt-0.5">
              {aiRisks.length} Risk{aiRisks.length !== 1 ? "s" : ""} identified
            </p>
          )}
        </div>
        <span className="inline-flex items-center rounded-full border border-[var(--c-green-light)] bg-[var(--c-green-bg)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--c-green)]">
          AI Generated
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-14 rounded-[var(--r-lg)] bg-[var(--c-border)] animate-pulse" />
          <div className="h-14 rounded-[var(--r-lg)] bg-[var(--c-border)] animate-pulse" />
        </div>
      ) : (
        <div className="space-y-3">
          {aiRisks.map((risk, index) => {
            const styles = getRiskStyles(risk.level);
            return (
              <div
                key={index}
                className={`rounded-[var(--r-lg)] border-l-4 ${styles.border} ${styles.bg} px-4 py-3`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${styles.badge}`}>
                    {risk.level}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${styles.text}`}>{risk.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AIRiskPanel;