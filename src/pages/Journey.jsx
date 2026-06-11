// src/pages/Journey.jsx

import { useNavigate } from "react-router-dom";
import { useCase } from "../context/CaseContext";
import VisaJourneyTimeline from "../components/output/VisaJourneyTimeline";
import ComplianceNotes from "../components/output/ComplianceNotes";

function RequirementsChecklist() {
  const { caseData, uploadedDocuments } = useCase();
  const requiredDocuments = caseData?.analysis?.documents || [];

  const checks = [
    { label: "Visa Type Selected", met: Boolean(caseData?.visaType) },
    { label: "Destination Country Selected", met: Boolean(caseData?.country) },
    ...requiredDocuments.map((doc) => ({
      label: `${doc} Verified`,
      met: uploadedDocuments.some(
        (u) => u.requiredDocument === doc && u.valid
      ),
    })),
  ];

  const metCount = checks.filter((c) => c.met).length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-800">Requirements Checklist</h2>
        <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          {metCount} / {checks.length} Complete
        </span>
      </div>

      <ul className="space-y-3">
        {checks.map(({ label, met }) => (
          <li
            key={label}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              met
                ? "border-green-100 bg-green-50"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                met ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {met ? (
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                met ? "text-green-800" : "text-gray-500"
              }`}
            >
              {met ? "✓ " : ""}
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Journey() {
  const navigate = useNavigate();
  const { caseData } = useCase();

  const visaJourney = caseData?.analysis?.visaJourney || [];
  const complianceNotes = caseData?.analysis?.complianceNotes || [];

  return (
    <main className="max-w-5xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-1">
          Step 4 of 6
        </p>
        <h1 className="text-4xl font-bold text-gray-800">
          Visa Processing Journey
        </h1>
        <p className="text-gray-500 mt-2">
          Your complete processing timeline, compliance requirements, and
          application checklist for your <strong>{caseData?.visaType}</strong>{" "}
          to <strong>{caseData?.country}</strong>.
        </p>
      </div>

      {/* Case reference strip */}
      <div className="bg-white rounded-lg shadow px-5 py-3 mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <span className="text-gray-500">
          Case ID:{" "}
          <strong className="text-gray-800">
            {caseData?.caseId || caseData?.id}
          </strong>
        </span>
        <span className="text-gray-300 hidden sm:inline">|</span>
        <span className="text-gray-500">
          Visa: <strong className="text-gray-800">{caseData?.visaType}</strong>
        </span>
        <span className="text-gray-300 hidden sm:inline">|</span>
        <span className="text-gray-500">
          Country:{" "}
          <strong className="text-gray-800">{caseData?.country}</strong>
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="md:col-span-2">
          <VisaJourneyTimeline visaJourney={visaJourney} />
        </div>
        <ComplianceNotes notes={complianceNotes} />
        <RequirementsChecklist />
      </div>

      {/* Proceed To Dashboard */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold text-base shadow transition"
        >
          Proceed To Dashboard
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </main>
  );
}

export default Journey;