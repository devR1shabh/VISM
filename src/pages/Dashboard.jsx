// src/pages/Dashboard.jsx

import { Link, useNavigate } from "react-router-dom";
import { useCase } from "../context/CaseContext";
import ActivityFeed from "../components/output/ActivityFeed";
import { calculateReadiness, deriveDocumentSummary } from "../engines/readinessEngine";

function Dashboard() {
  const navigate = useNavigate();

  const { caseData, uploadedDocuments, activityFeed } = useCase();

  const requiredDocuments = caseData.analysis?.documents || [];

  const { valid, invalid, missing } = deriveDocumentSummary(
    requiredDocuments,
    uploadedDocuments
  );

  const readiness = calculateReadiness(valid, requiredDocuments.length);

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-1">
            Step 5 of 6
          </p>
          <h1 className="text-4xl font-bold text-gray-800">
            Application Dashboard
          </h1>
          <p className="text-gray-500 mt-2">Real-time visa case monitoring</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow text-right">
          <p className="text-sm text-gray-500">Case ID</p>
          <p className="font-semibold">{caseData.caseId || caseData.id}</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Completion</p>
          <h2 className="text-3xl font-bold mt-2 text-blue-600">
            {readiness.score}%
          </h2>
          <p className="text-sm text-gray-500 mt-1">{readiness.label}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Valid Documents</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">{valid}</h2>
          <p className="text-sm text-gray-500 mt-1">Verified</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Missing Documents</p>
          <h2 className="text-3xl font-bold mt-2 text-orange-600">
            {missing.length}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Required</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Activity Events</p>
          <h2 className="text-3xl font-bold mt-2 text-purple-600">
            {activityFeed.length}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Logged</p>
        </div>
      </div>

      {/* Current Status + Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Current Status</h2>
          <div className="space-y-3">
            <p>
              <strong>Visa Type:</strong> {caseData.visaType}
            </p>
            <p>
              <strong>Destination:</strong> {caseData.country}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  readiness.score === 100 ? "text-green-600" : "text-blue-600"
                }`}
              >
                {readiness.label}
              </span>
            </p>
            <p>
              <strong>Documents:</strong> {valid} / {requiredDocuments.length}{" "}
              verified
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Application Summary</h2>
          <div className="space-y-3">
            <p>
              <strong>Case ID:</strong> {caseData.caseId || caseData.id}
            </p>
            <p>
              <strong>Invalid Documents:</strong> {invalid}
            </p>
            <p>
              <strong>Missing Documents:</strong> {missing.length}
            </p>
            <p>
              <strong>Activity Events:</strong> {activityFeed.length}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <ActivityFeed />
      </div>

      {/* Quick Access */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/analysis"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold">Analysis Report</h2>
          <p className="mt-2 text-gray-600">View complete visa assessment.</p>
        </Link>

        <Link
          to="/documents"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold">Document Upload</h2>
          <p className="mt-2 text-gray-600">Upload or re-verify documents.</p>
        </Link>

        <Link
          to="/journey"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold">Processing Journey</h2>
          <p className="mt-2 text-gray-600">Review your visa journey timeline.</p>
        </Link>
      </div>

      {/* Finish Application */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/application-ready")}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold text-base shadow transition"
        >
          Finish Application
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

    </div>
  );
}

export default Dashboard;