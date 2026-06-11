function AIRiskPanel({ aiRisks = [] }) {
  const getRiskStyles = (level) => {
    switch (level) {
      case "HIGH":
        return {
          border: "border-red-500",
          bg: "bg-red-50",
          text: "text-red-700",
          badge: "bg-red-100 text-red-700",
        };
      case "MEDIUM":
        return {
          border: "border-orange-500",
          bg: "bg-orange-50",
          text: "text-orange-700",
          badge: "bg-orange-100 text-orange-700",
        };
      default:
        return {
          border: "border-green-500",
          bg: "bg-green-50",
          text: "text-green-700",
          badge: "bg-green-100 text-green-700",
        };
    }
  };

  const isLoading = aiRisks.length === 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">AI Risk Assessment</h2>
        <div className="flex items-center gap-2">
          {!isLoading && (
            <span className="text-sm text-gray-500">
              {aiRisks.length} Risk{aiRisks.length !== 1 ? "s" : ""}
            </span>
          )}
          <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
            AI Generated
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-gray-100 rounded-lg" />
          <div className="h-16 bg-gray-100 rounded-lg" />
        </div>
      ) : (
        <div className="space-y-3">
          {aiRisks.map((risk, index) => {
            const styles = getRiskStyles(risk.level);
            return (
              <div
                key={index}
                className={`${styles.bg} ${styles.border} border-l-4 rounded-lg p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`${styles.badge} text-xs font-bold px-2 py-1 rounded-full`}
                  >
                    {risk.level}
                  </span>
                </div>
                <p className={`${styles.text} font-medium`}>{risk.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AIRiskPanel;