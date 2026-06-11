// src/pages/Dashboard.jsx

import { Link, useNavigate } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../context/CaseContext";
import ActivityFeed from "../components/output/ActivityFeed";
import { calculateReadiness, deriveDocumentSummary } from "../engines/readinessEngine";

function Dashboard() {
  const navigate = useNavigate();

  const { caseData, uploadedDocuments, activityFeed, setWorkflowStep } = useCase();

  const requiredDocuments = caseData.analysis?.documents || [];

  const { valid, invalid, missing } = deriveDocumentSummary(
    requiredDocuments,
    uploadedDocuments
  );

  const readiness = calculateReadiness(valid, requiredDocuments.length);

  const handleFinish = () => {
    // Advance workflow: all done → unlock ApplicationReady + PDF
    setWorkflowStep(WORKFLOW_STEPS.ALL_DONE);
    navigate("/application-ready");
  };

  const caseId = caseData.caseId || caseData.id || "—";

  return (
    <main className="min-h-screen bg-[#061A28] text-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Hero */}
        <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_40px_120px_-40px_rgba(34,231,197,0.35)] backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#22E7C5] mb-2">Application Dashboard</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Application Dashboard</h1>
              <p className="mt-4 text-lg leading-7 text-[#B8C5D1] max-w-3xl">Real-time visa case monitoring</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { label: "Case ID", value: caseId },
                { label: "Visa Type", value: caseData?.visaType || "—" },
                { label: "Destination", value: caseData?.country || "—" },
                { label: "Status", value: readiness.label },
              ].map((card) => (
                <div key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#B8C5D1]">{card.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Summary Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-[#B8C5D1]">Completion</p>
            <h2 className="text-3xl font-bold mt-2 text-white">{readiness.score}%</h2>
            <p className="text-sm text-[#B8C5D1] mt-1">{readiness.label}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-[#B8C5D1]">Valid Documents</p>
            <h2 className="text-3xl font-bold mt-2 text-white">{valid}</h2>
            <p className="text-sm text-[#B8C5D1] mt-1">Verified</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-[#B8C5D1]">Missing Documents</p>
            <h2 className="text-3xl font-bold mt-2 text-white">{missing.length}</h2>
            <p className="text-sm text-[#B8C5D1] mt-1">Required</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-[#B8C5D1]">Activity Events</p>
            <h2 className="text-3xl font-bold mt-2 text-white">{activityFeed.length}</h2>
            <p className="text-sm text-[#B8C5D1] mt-1">Logged</p>
          </div>
        </div>

        {/* Current Status + Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 p-6 shadow-[0_20px_60px_-20px_rgba(34,231,197,0.12)] backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Current Status</h2>
            <div className="space-y-3 text-sm text-[#B8C5D1]">
              <p><strong className="text-white">Visa Type:</strong> {caseData.visaType}</p>
              <p><strong className="text-white">Destination:</strong> {caseData.country}</p>
              <p>
                <strong className="text-white">Status:</strong>{" "}
                <span className={`font-semibold ${readiness.score === 100 ? "text-[#22E7C5]" : "text-[#22E7C5]"}`}>
                  {readiness.label}
                </span>
              </p>
              <p><strong className="text-white">Documents:</strong> {valid} / {requiredDocuments.length} verified</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 p-6 shadow-[0_20px_60px_-20px_rgba(34,231,197,0.12)] backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Application Summary</h2>
            <div className="space-y-3 text-sm text-[#B8C5D1]">
              <p><strong className="text-white">Case ID:</strong> {caseData.caseId || caseData.id}</p>
              <p><strong className="text-white">Invalid Documents:</strong> {invalid}</p>
              <p><strong className="text-white">Missing Documents:</strong> {missing.length}</p>
              <p><strong className="text-white">Activity Events:</strong> {activityFeed.length}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <ActivityFeed />
        </div>

        {/* Quick Access */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/analysis" className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold text-white">Analysis Report</h2>
            <p className="mt-2 text-sm text-[#B8C5D1]">View complete visa assessment.</p>
          </Link>

          <Link to="/documents" className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold text-white">Document Upload</h2>
            <p className="mt-2 text-sm text-[#B8C5D1]">Upload or re-verify documents.</p>
          </Link>

          <Link to="/journey" className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold text-white">Processing Journey</h2>
            <p className="mt-2 text-sm text-[#B8C5D1]">Review your visa journey timeline.</p>
          </Link>
        </div>

        {/* Finish Application */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleFinish}
            className="inline-flex items-center gap-2 rounded-3xl px-6 py-3 text-sm font-semibold bg-[#22E7C5] text-[#061A28] hover:bg-[#39F5D5] shadow-md transition"
          >
            Finish Application
            <svg
              className="w-4 h-4"
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
    </main>
  );
}

export default Dashboard;