import { useCase } from "../../context/CaseContext";
import { calculateRisks } from "../../engines/riskEngine";

function RiskPanel() {
  const {
    caseData,
    uploadedDocuments,
  } = useCase();

  const requiredDocuments =
    caseData?.analysis?.documents || [];

  const risks =
    calculateRisks(
      requiredDocuments,
      uploadedDocuments
    );

  const getRiskColor = (
    level
  ) => {
    switch (level) {
      case "HIGH":
        return {
          border:
            "border-red-500",
          bg:
            "bg-red-50",
          text:
            "text-red-700",
          badge:
            "bg-red-100 text-red-700",
        };

      case "MEDIUM":
        return {
          border:
            "border-orange-500",
          bg:
            "bg-orange-50",
          text:
            "text-orange-700",
          badge:
            "bg-orange-100 text-orange-700",
        };

      default:
        return {
          border:
            "border-green-500",
          bg:
            "bg-green-50",
          text:
            "text-green-700",
          badge:
            "bg-green-100 text-green-700",
        };
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-xl font-bold">
          Risk Assessment
        </h2>

        <span className="text-sm text-gray-500">
          {risks.length} Risk
          {risks.length !== 1
            ? "s"
            : ""}
        </span>

      </div>

      {risks.length === 0 ? (
        <div className="text-center py-6">

          <p className="text-green-600 font-medium">
            ✓ No Risks Detected
          </p>

          <p className="text-sm text-gray-500 mt-2">
            All required documents appear complete.
          </p>

        </div>
      ) : (
        <div className="space-y-3">

          {risks.map(
            (
              risk,
              index
            ) => {
              const styles =
                getRiskColor(
                  risk.level
                );

              return (
                <div
                  key={index}
                  className={`${styles.bg} ${styles.border} border-l-4 rounded-lg p-4`}
                >

                  <div className="flex items-center justify-between mb-2">

                    <span
                      className={`${styles.badge} text-xs font-bold px-2 py-1 rounded-full`}
                    >
                      {
                        risk.level
                      }
                    </span>

                  </div>

                  <p
                    className={`${styles.text} font-medium`}
                  >
                    {
                      risk.message
                    }
                  </p>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}

export default RiskPanel;