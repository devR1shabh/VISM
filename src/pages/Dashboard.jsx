// src/pages/Dashboard.jsx

import { Link, useNavigate } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../context/CaseContext";
import ActivityFeed from "../components/output/ActivityFeed";
import { calculateReadiness, deriveDocumentSummary } from "../engines/readinessEngine";
import { PageHeader } from "../components/ui";

function Dashboard() {
  // ── Logic completely unchanged ────────────────────────────────────────────
  const navigate = useNavigate();

  const { caseData, uploadedDocuments, activityFeed, setWorkflowStep } = useCase();

  const requiredDocuments = caseData.analysis?.documents || [];

  const { valid, invalid, missing } = deriveDocumentSummary(
    requiredDocuments,
    uploadedDocuments
  );

  const readiness = calculateReadiness(valid, requiredDocuments.length);

  const handleFinish = () => {
    setWorkflowStep(WORKFLOW_STEPS.ALL_DONE);
    navigate("/application-ready");
  };

  const caseId = caseData.caseId || caseData.id || "—";

  return (
    <main className="min-h-screen bg-[#F7F8FA]">

      {/* Compact navy page header */}
      <PageHeader
        eyebrow="Application Dashboard"
        title="Case Overview"
        description="Real-time visa case monitoring, document status, and activity feed."
      >
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { label: "Case ID",   value: caseId                    },
            { label: "Visa Type", value: caseData?.visaType || "—" },
            { label: "Status",    value: readiness.label            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg bg-white/10 border border-white/15 px-4 py-2"
            >
              <span className="text-xs text-white/60 uppercase tracking-wide font-semibold">
                {label}:
              </span>
              <span className="text-sm font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-6">

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Completion",        value: `${readiness.score}%`,      sub: readiness.label        },
            { label: "Valid Documents",   value: String(valid),               sub: "Verified"              },
            { label: "Missing Documents", value: String(missing.length),      sub: "Required"              },
            { label: "Activity Events",   value: String(activityFeed.length), sub: "Logged"                },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              className="bg-white border border-[#E6E8EB] rounded-xl p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
                {label}
              </p>
              <p className="mt-2 text-3xl font-bold text-[#0A2E57]">{value}</p>
              <p className="mt-1 text-xs text-[#6B7280]">{sub}</p>
            </div>
          ))}
        </div>

        {/* Current Status + Application Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-6">
            <h2 className="text-base font-bold text-[#0A2E57] mb-4">Current Status</h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-[#111827]">Visa Type:</strong>{" "}
                <span className="text-[#374151]">{caseData.visaType}</span>
              </p>
              <p>
                <strong className="text-[#111827]">Destination:</strong>{" "}
                <span className="text-[#374151]">{caseData.country}</span>
              </p>
              <p>
                <strong className="text-[#111827]">Status:</strong>{" "}
                <span className="font-semibold text-[#2AA6D8]">{readiness.label}</span>
              </p>
              <p>
                <strong className="text-[#111827]">Documents:</strong>{" "}
                <span className="text-[#374151]">{valid} / {requiredDocuments.length} verified</span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-6">
            <h2 className="text-base font-bold text-[#0A2E57] mb-4">Application Summary</h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-[#111827]">Case ID:</strong>{" "}
                <span className="text-[#374151]">{caseData.caseId || caseData.id}</span>
              </p>
              <p>
                <strong className="text-[#111827]">Invalid Documents:</strong>{" "}
                <span className="text-[#374151]">{invalid}</span>
              </p>
              <p>
                <strong className="text-[#111827]">Missing Documents:</strong>{" "}
                <span className="text-[#374151]">{missing.length}</span>
              </p>
              <p>
                <strong className="text-[#111827]">Activity Events:</strong>{" "}
                <span className="text-[#374151]">{activityFeed.length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-6">
          <ActivityFeed />
        </div>

        {/* Quick Access — Link to= values unchanged */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/analysis"
            className="block bg-white border border-[#E6E8EB] rounded-xl p-5 shadow-sm transition hover:border-[#4DC7F7] hover:shadow-md"
          >
            <h2 className="text-sm font-bold text-[#0A2E57]">Analysis Report</h2>
            <p className="mt-1 text-xs text-[#6B7280]">View complete visa assessment.</p>
          </Link>

          <Link
            to="/documents"
            className="block bg-white border border-[#E6E8EB] rounded-xl p-5 shadow-sm transition hover:border-[#4DC7F7] hover:shadow-md"
          >
            <h2 className="text-sm font-bold text-[#0A2E57]">Document Upload</h2>
            <p className="mt-1 text-xs text-[#6B7280]">Upload or re-verify documents.</p>
          </Link>

          <Link
            to="/journey"
            className="block bg-white border border-[#E6E8EB] rounded-xl p-5 shadow-sm transition hover:border-[#4DC7F7] hover:shadow-md"
          >
            <h2 className="text-sm font-bold text-[#0A2E57]">Processing Journey</h2>
            <p className="mt-1 text-xs text-[#6B7280]">Review your visa journey timeline.</p>
          </Link>
        </div>

        {/* Finish Application — onClick unchanged */}
        <div className="flex justify-end pb-4">
          <button
            type="button"
            onClick={handleFinish}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A2E57] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F3D6E] active:scale-[0.98]"
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