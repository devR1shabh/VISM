function AIRiskPanel({ aiRisks = [] }) {
  const getRiskStyles = (level) => {
    switch (level) {
      case "HIGH":
        return {
          border: "border-red-400",
          text: "text-red-200",
          badge: "border-red-400 bg-red-500/10 text-red-300",
          marker: "bg-red-500/10 text-red-300 border-red-400",
        };
      case "MEDIUM":
        return {
          border: "border-orange-400",
          text: "text-orange-200",
          badge: "border-orange-400 bg-orange-500/10 text-orange-300",
          marker: "bg-orange-500/10 text-orange-300 border-orange-400",
        };
      default:
        return {
          border: "border-emerald-400",
          text: "text-emerald-200",
          badge: "border-emerald-400 bg-emerald-500/10 text-emerald-300",
          marker: "bg-emerald-500/10 text-emerald-300 border-emerald-400",
        };
    }
  };

  const isLoading = aiRisks.length === 0;

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#083D4A]/80 p-6 shadow-[0_25px_80px_-40px_rgba(34,231,197,0.35)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">AI Risk Assessment</h2>
          {!isLoading && (
            <p className="text-sm text-[#B8C5D1] mt-1">
              {aiRisks.length} Risk{aiRisks.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <span className="inline-flex items-center rounded-full border border-[#22E7C5]/20 bg-[#22E7C5]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#22E7C5]">
          AI Generated
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-16 rounded-3xl bg-white/5 animate-pulse" />
          <div className="h-16 rounded-3xl bg-white/5 animate-pulse" />
        </div>
      ) : (
        <div className="space-y-4">
          {aiRisks.map((risk, index) => {
            const styles = getRiskStyles(risk.level);
            return (
              <div
                key={index}
                className={`rounded-[24px] border-l-4 ${styles.border} bg-white/5 p-4 shadow-sm backdrop-blur`}
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold ${styles.badge}`}>
                    {risk.level}
                  </span>
                  <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${styles.marker}`}>
                    {risk.level}
                  </span>
                </div>
                <p className={`text-[#B8C5D1] ${styles.text} leading-relaxed`}>{risk.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AIRiskPanel;
