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
    <main className="min-h-screen bg-[var(--c-bg)]">

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
              className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] p-5 shadow-[var(--shadow-card)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-muted)]">
                {label}
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-[var(--c-green)]">{value}</p>
              <p className="mt-1 text-xs text-[var(--c-text-muted)]">{sub}</p>
            </div>
          ))}
        </div>

        {/* Current Status + Application Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
            <h2 className="text-base font-bold text-[var(--c-text)] mb-4">Current Status</h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-[var(--c-text)]">Visa Type:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{caseData.visaType}</span>
              </p>
              <p>
                <strong className="text-[var(--c-text)]">Destination:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{caseData.country}</span>
              </p>
              <p>
                <strong className="text-[var(--c-text)]">Status:</strong>{" "}
                <span className="font-semibold text-[var(--c-green-mid)]">{readiness.label}</span>
              </p>
              <p>
                <strong className="text-[var(--c-text)]">Documents:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{valid} / {requiredDocuments.length} verified</span>
              </p>
            </div>
          </div>

          <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
            <h2 className="text-base font-bold text-[var(--c-text)] mb-4">Application Summary</h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-[var(--c-text)]">Case ID:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{caseData.caseId || caseData.id}</span>
              </p>
              <p>
                <strong className="text-[var(--c-text)]">Invalid Documents:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{invalid}</span>
              </p>
              <p>
                <strong className="text-[var(--c-text)]">Missing Documents:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{missing.length}</span>
              </p>
              <p>
                <strong className="text-[var(--c-text)]">Activity Events:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{activityFeed.length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
          <ActivityFeed />
        </div>

        {/* Quick Access — Link to= values unchanged */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/analysis"
            className="block bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] p-5 shadow-[var(--shadow-card)] transition hover:border-[var(--c-green)] hover:shadow-md"
          >
            <h2 className="text-sm font-bold text-[var(--c-text)]">Analysis Report</h2>
            <p className="mt-1 text-xs text-[var(--c-text-muted)]">View complete visa assessment.</p>
          </Link>

          <Link
            to="/documents"
            className="block bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] p-5 shadow-[var(--shadow-card)] transition hover:border-[var(--c-green)] hover:shadow-md"
          >
            <h2 className="text-sm font-bold text-[var(--c-text)]">Document Upload</h2>
            <p className="mt-1 text-xs text-[var(--c-text-muted)]">Upload or re-verify documents.</p>
          </Link>

          <Link
            to="/journey"
            className="block bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] p-5 shadow-[var(--shadow-card)] transition hover:border-[var(--c-green)] hover:shadow-md"
          >
            <h2 className="text-sm font-bold text-[var(--c-text)]">Processing Journey</h2>
            <p className="mt-1 text-xs text-[var(--c-text-muted)]">Review your visa journey timeline.</p>
          </Link>
        </div>

        {/* Finish Application — onClick unchanged */}
        <div className="flex justify-end pb-4">
          <button
            type="button"
            onClick={handleFinish}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--c-green)] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--c-green-mid)] active:scale-[0.98]"
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