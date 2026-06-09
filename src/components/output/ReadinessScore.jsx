import { useCase } from "../../context/CaseContext";
import {
calculateReadiness,
deriveDocumentSummary,
} from "../../engines/readinessEngine";

function ReadinessScore() {
const {
caseData,
uploadedDocuments,
} = useCase();

const requiredDocuments =
caseData?.analysis?.documents || [];

const {
valid,
required,
missing,
} = deriveDocumentSummary(
requiredDocuments,
uploadedDocuments
);

const {
score,
label,
color,
} = calculateReadiness(
valid,
required
);

const colorMap = {
gray: "bg-gray-400",
red: "bg-red-500",
amber: "bg-amber-500",
blue: "bg-blue-500",
green: "bg-green-600",
};

const barClass =
colorMap[color] ||
"bg-gray-400";

return ( <div className="bg-white p-6 rounded-lg shadow"> <h2 className="text-xl font-bold mb-4">
Application Completion </h2>


  <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden mb-3">
    <div
      className={`${barClass} h-8 flex items-center justify-center text-white font-semibold transition-all duration-500`}
      style={{
        width: `${score}%`,
        minWidth:
          score > 0
            ? "3rem"
            : "0",
      }}
    >
      {score > 10
        ? `${score}%`
        : ""}
    </div>
  </div>

  <p className="text-sm font-semibold text-gray-700 mb-4">
    {label}
  </p>

  <div className="bg-gray-50 p-4 rounded-lg mb-4">
    <p className="font-medium text-gray-800">
      {valid} of {required}
      {" "}
      required documents ready
    </p>

    <p className="text-sm text-gray-500 mt-1">
      Complete document submission
      to move closer to visa
      application readiness.
    </p>
  </div>

  <div className="space-y-2 text-sm text-gray-600">
    <p>
      ✓ {valid} valid document
      {valid !== 1 ? "s" : ""}
      {" "}
      uploaded
    </p>

    <p>
      ◦ {required} required
      document
      {required !== 1 ? "s" : ""}
    </p>

    {missing.length > 0 && (
      <p className="text-orange-600">
        ⚠ {missing.length}
        {" "}
        document
        {missing.length !== 1
          ? "s"
          : ""}
        {" "}
        still missing
      </p>
    )}
  </div>

  <p className="mt-4 text-xs text-gray-400">
    Progress updates
    automatically as documents
    are uploaded and validated.
  </p>
</div>

);
}

export default ReadinessScore;
