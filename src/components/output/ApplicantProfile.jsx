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
    gray:  { bar: "bg-gray-400",   text: "text-gray-600" },
    red:   { bar: "bg-red-500",    text: "text-red-600" },
    amber: { bar: "bg-amber-500",  text: "text-amber-600" },
    blue:  { bar: "bg-blue-500",   text: "text-blue-600" },
    green: { bar: "bg-green-500",  text: "text-green-600" },
  };

  const theme = colorMap[color];

  const statusColors = {
    "In Progress": "bg-blue-100 text-blue-700",
    "Ready":       "bg-green-100 text-green-700",
    "Submitted":   "bg-purple-100 text-purple-700",
    "On Hold":     "bg-amber-100 text-amber-700",
  };

  const caseStatus = caseData.status || "In Progress";
  const statusClass = statusColors[caseStatus] || "bg-gray-100 text-gray-700";

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        Applicant Profile
      </h2>

      {/* Case metadata grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Case ID
          </p>
          <p className="font-semibold text-gray-800 text-sm">
            {caseData.caseId || caseData.id || "—"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Visa Type
          </p>
          <p className="font-semibold text-gray-800 text-sm">
            {caseData.visaType || "—"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Destination
          </p>
          <p className="font-semibold text-gray-800 text-sm">
            {caseData.country || "—"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Status
          </p>
          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${statusClass}`}>
            {caseStatus}
          </span>
        </div>
      </div>

      {/* Document counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{required}</p>
          <p className="text-xs text-gray-500 mt-1">Required</p>
        </div>

        <div className="border border-green-200 bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{valid}</p>
          <p className="text-xs text-green-600 mt-1">Valid</p>
        </div>

        <div className="border border-red-200 bg-red-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{invalid}</p>
          <p className="text-xs text-red-500 mt-1">Invalid</p>
        </div>

        <div className="border border-orange-200 bg-orange-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{missing.length}</p>
          <p className="text-xs text-orange-500 mt-1">Missing</p>
        </div>
      </div>

      {/* Readiness score */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Readiness Score
          </span>
          <span className={`text-sm font-semibold ${theme.text}`}>
            {score}% — {label}
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div
            className={`${theme.bar} h-4 rounded-full transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Score = valid documents ÷ required documents × 100.
          Updates live as documents are uploaded and validated.
        </p>
      </div>
    </div>
  );
}

export default ApplicantProfile;