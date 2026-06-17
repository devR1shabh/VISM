// src/pages/Dashboard.jsx

import { Link, useNavigate } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../context/CaseContext";
import ActivityFeed from "../components/output/ActivityFeed";
import { calculateReadiness, deriveDocumentSummary } from "../engines/readinessEngine";
import { PageHeader } from "../components/ui";

// Total required documents (constant — same for all visa types)
const TOTAL_REQUIRED = 15;

function Dashboard() {
  const navigate = useNavigate();

  const { caseData, uploadedDocuments, activityFeed, setWorkflowStep } = useCase();

  // ── Empty state — no case ────────────────────────────────────────────────
  if (!caseData) {
    return (
      <main className="min-h-screen bg-[#F7F8FA]">
        <PageHeader
          eyebrow="Application Dashboard"
          title="Case Overview"
          description="Real-time visa case monitoring, document status, and activity feed."
        />
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 text-center">
          <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-12 max-w-md mx-auto">
            <svg className="w-10 h-10 text-[#9CA3AF] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-lg font-bold text-[#0A2E57] mb-2">No Case Yet</h2>
            <p className="text-sm text-[#6B7280] mb-6">
              Create a case on the home page to see your application dashboard.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0A2E57] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0F3D6E] transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  const requiredDocuments = caseData?.analysis?.documents || [];
  const totalDocs = requiredDocuments.length || TOTAL_REQUIRED;

  const { valid, invalid, missing } = deriveDocumentSummary(
    requiredDocuments,
    uploadedDocuments
  );

  // Uploaded = all docs in uploadedDocuments that match a required doc (valid or not)
  const uploaded = uploadedDocuments.filter((d) =>
    requiredDocuments.includes(d.requiredDocument)
  ).length;

  const readiness    = calculateReadiness(valid, totalDocs);
  const uploadedPct  = totalDocs === 0 ? 0 : Math.round((uploaded / totalDocs) * 100);
  const verifiedPct  = totalDocs === 0 ? 0 : Math.round((valid / totalDocs) * 100);

  const handleFinish = () => {
    setWorkflowStep(WORKFLOW_STEPS.ALL_DONE);
    navigate("/application-ready");
  };

  const caseId = caseData?.caseId || caseData?.id || "—";

  return (
    <main className="min-h-screen bg-[#F7F8FA]">

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
            { label: "Completion", value: `${verifiedPct}%`,            sub: readiness.label        },
            { label: "Uploaded",   value: `${uploaded} / ${totalDocs}`, sub: `${uploadedPct}%`      },
            { label: "Verified",   value: `${valid} / ${totalDocs}`,    sub: `${verifiedPct}%`      },
            { label: "Missing",    value: String(missing.length),        sub: "Not yet uploaded"     },
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

        {/* Document Status + Application Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-6">
            <h2 className="text-base font-bold text-[#0A2E57] mb-4">Document Status</h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-[#111827]">Total Required:</strong>{" "}
                <span className="text-[#374151]">{totalDocs}</span>
              </p>
              <p>
                <strong className="text-[#111827]">Uploaded:</strong>{" "}
                <span className="text-[#374151]">{uploaded} / {totalDocs} ({uploadedPct}%)</span>
              </p>
              <p>
                <strong className="text-[#111827]">Verified:</strong>{" "}
                <span className="text-[#374151]">{valid} / {totalDocs} ({verifiedPct}%)</span>
              </p>
              <p>
                <strong className="text-[#111827]">Missing:</strong>{" "}
                <span className="text-[#374151]">{missing.length}</span>
              </p>
              {missing.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#E6E8EB]">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7280] mb-2">
                    Missing Documents
                  </p>
                  <ul className="space-y-1">
                    {missing.map((doc) => (
                      <li key={doc} className="text-xs text-[#374151] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-6">
            <h2 className="text-base font-bold text-[#0A2E57] mb-4">Application Summary</h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-[#111827]">Case ID:</strong>{" "}
                <span className="text-[#374151]">{caseId}</span>
              </p>
              <p>
                <strong className="text-[#111827]">Visa Type:</strong>{" "}
                <span className="text-[#374151]">{caseData?.visaType}</span>
              </p>
              <p>
                <strong className="text-[#111827]">Destination:</strong>{" "}
                <span className="text-[#374151]">{caseData?.country}</span>
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

        {/* Quick Access */}
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

        {/* Submit Application — always enabled */}
        <div className="flex justify-end pb-4">
          <button
            type="button"
            onClick={handleFinish}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A2E57] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F3D6E] active:scale-[0.98]"
          >
            Submit Application
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

      </div>
    </main>
  );
}

export default Dashboard;