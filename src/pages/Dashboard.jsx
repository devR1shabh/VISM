// src/pages/Dashboard.jsx

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../context/CaseContext";
import ActivityFeed from "../components/output/ActivityFeed";
import { calculateReadiness, deriveDocumentSummary } from "../engines/readinessEngine";
import { PageHeader } from "../components/ui";
import { triggerAssessmentAgent, pollCaseForAssessment } from "../services/api";
import { Bot, AlertTriangle, CheckCircle, Info } from "lucide-react";

const TOTAL_REQUIRED  = 15;
const POLL_INTERVAL   = 3000;   // ms between polls while agent is running
const POLL_MAX_WAIT   = 120000; // 2 minutes max polling duration

// ── Agent result panel (inline, applicant-facing) ─────────────────────────────

function AgentResultBadge({ risk }) {
  if (!risk) return null;
  const map = {
    LOW:    { cls: "bg-[var(--c-success-bg)] text-[var(--c-success)] border-[var(--c-success-border)]", Icon: CheckCircle },
    MEDIUM: { cls: "bg-[var(--c-warning-bg)] text-[var(--c-warning)] border-[var(--c-warning-border)]", Icon: Info },
    HIGH:   { cls: "bg-[var(--c-error-bg)]   text-[var(--c-error)]   border-[var(--c-error-border)]",   Icon: AlertTriangle },
  };
  const { cls, Icon } = map[risk] || { cls: "bg-[var(--c-bg)] text-[var(--c-text-muted)] border-[var(--c-border)]", Icon: Info };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${cls}`}>
      <Icon size={12} />
      {risk} RISK
    </span>
  );
}

function AgentPanel({ agentAssessment, isRunning, onRunAgent, caseId }) {
  if (isRunning) {
    return (
      <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[var(--r-lg)] bg-[var(--c-green-bg)] border border-[var(--c-green-light)] flex items-center justify-center">
            <Bot size={16} className="text-[var(--c-green-mid)]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--c-text)]">Readiness Assessment Agent</h2>
            <p className="text-xs text-[var(--c-text-muted)]">Autonomous AI — investigating your application</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-4 rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)]">
          <div className="w-5 h-5 border-2 border-[var(--c-green)] border-t-transparent rounded-full animate-spin shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--c-text)]">Agent is running…</p>
            <p className="text-xs text-[var(--c-text-muted)]">
              Checking documents, passport, finances, and questionnaire. This takes 15–30 seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (agentAssessment?.overallRisk) {
    const { overallRisk, readinessLabel, actions = [] } = agentAssessment;
    return (
      <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-sm p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[var(--r-lg)] bg-[var(--c-green-bg)] border border-[var(--c-green-light)] flex items-center justify-center">
              <Bot size={16} className="text-[var(--c-green-mid)]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--c-text)]">Readiness Assessment Agent</h2>
              <p className="text-xs text-[var(--c-text-muted)]">Autonomous AI verdict</p>
            </div>
          </div>
          <AgentResultBadge risk={overallRisk} />
        </div>

        <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3 mb-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-0.5">Verdict</p>
          <p className="text-sm font-bold text-[var(--c-text)]">{readinessLabel}</p>
        </div>

        {actions.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--c-text-muted)] font-semibold mb-2">
              Agent's Priority Actions
            </p>
            <ul className="space-y-2">
              {actions.map((action, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-[var(--r-md)] border border-[var(--c-border)] bg-[var(--c-bg)] px-3 py-2.5 text-xs text-[var(--c-text-mid)] leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-[var(--c-green)] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {caseId && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onRunAgent}
              className="text-xs font-semibold text-[var(--c-text-muted)] hover:text-[var(--c-green)] transition underline underline-offset-2"
            >
              Re-run assessment
            </button>
          </div>
        )}
      </div>
    );
  }

  // Not yet run
  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-[var(--r-lg)] bg-[var(--c-bg)] border border-[var(--c-border)] flex items-center justify-center">
          <Bot size={16} className="text-[var(--c-text-muted)]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[var(--c-text)]">Readiness Assessment Agent</h2>
          <p className="text-xs text-[var(--c-text-muted)]">Autonomous AI — evaluates your application readiness</p>
        </div>
      </div>

      <p className="text-sm text-[var(--c-text-mid)] mb-5 leading-relaxed">
        The Assessment Agent autonomously inspects your documents, passport, financial evidence, and questionnaire answers — then delivers a risk verdict and prioritised action list.
      </p>

      <button
        type="button"
        onClick={onRunAgent}
        disabled={!caseId}
        className="inline-flex items-center gap-2 rounded-[var(--r-lg)] bg-[var(--c-green)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--c-green-mid)] transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        <Bot size={15} />
        Run Assessment
      </button>
    </div>
  );
}

// ── Main Dashboard component ──────────────────────────────────────────────────

function Dashboard() {
  const navigate = useNavigate();

  const { caseData, uploadedDocuments, activityFeed, setWorkflowStep } = useCase();

  // Agent state
  const [agentRunning,    setAgentRunning]    = useState(false);
  const [agentAssessment, setAgentAssessment] = useState(null);
  const [agentError,      setAgentError]      = useState("");

  const pollRef     = useRef(null);
  const pollStartRef = useRef(null);

  // On mount, restore agentAssessment from server if the case has one
  useEffect(() => {
    if (!caseData?._id) return;

    // If the DB already has an assessment (e.g. from a previous session), load it
    if (caseData.agentAssessment?.overallRisk) {
      setAgentAssessment(caseData.agentAssessment);
    }

    // If the DB says agent is running (e.g. tab was refreshed mid-run), resume polling
    if (caseData.agentAssessment?.running) {
      setAgentRunning(true);
      startPolling(caseData._id);
    }

    return () => stopPolling();
  }, [caseData?._id]);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function startPolling(caseId) {
    stopPolling();
    pollStartRef.current = Date.now();

    pollRef.current = setInterval(async () => {
      // Safety timeout
      if (Date.now() - pollStartRef.current > POLL_MAX_WAIT) {
        stopPolling();
        setAgentRunning(false);
        setAgentError("Assessment timed out. Please try again.");
        return;
      }

      try {
        const record = await pollCaseForAssessment(caseId);
        if (!record.agentAssessment?.running && record.agentAssessment?.overallRisk) {
          stopPolling();
          setAgentRunning(false);
          setAgentAssessment(record.agentAssessment);
        }
      } catch (err) {
        console.error("Poll error:", err);
      }
    }, POLL_INTERVAL);
  }

  const handleRunAgent = async () => {
    const caseId = caseData?._id;
    if (!caseId) return;

    setAgentError("");
    setAgentRunning(true);
    setAgentAssessment(null);

    try {
      await triggerAssessmentAgent(caseId);
      startPolling(caseId);
    } catch (err) {
      setAgentRunning(false);
      setAgentError("Failed to start the assessment agent. Please try again.");
      console.error(err);
    }
  };

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!caseData) {
    return (
      <main className="min-h-screen bg-[var(--c-bg)]">
        <PageHeader
          eyebrow="Application Dashboard"
          title="Case Overview"
          description="Real-time visa case monitoring, document status, and activity feed."
        />
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 text-center">
          <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-sm p-12 max-w-md mx-auto">
            <svg className="w-10 h-10 text-[var(--c-text-muted)] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-2">No Case Yet</h2>
            <p className="text-sm text-[var(--c-text-muted)] mb-6">
              Create a case on the home page to see your application dashboard.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--c-green)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--c-green-mid)] transition"
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

  const uploaded = uploadedDocuments.filter((d) =>
    requiredDocuments.includes(d.requiredDocument)
  ).length;

  const readiness   = calculateReadiness(valid, totalDocs);
  const uploadedPct = totalDocs === 0 ? 0 : Math.round((uploaded / totalDocs) * 100);
  const verifiedPct = totalDocs === 0 ? 0 : Math.round((valid / totalDocs) * 100);

  const handleFinish = () => {
    setWorkflowStep(WORKFLOW_STEPS.ALL_DONE);
    navigate("/application-ready");
  };

  const caseId = caseData?.caseId || caseData?.id || "—";

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
            { label: "Completion", value: `${verifiedPct}%`,            sub: readiness.label    },
            { label: "Uploaded",   value: `${uploaded} / ${totalDocs}`, sub: `${uploadedPct}%`  },
            { label: "Verified",   value: `${valid} / ${totalDocs}`,    sub: `${verifiedPct}%`  },
            { label: "Missing",    value: String(missing.length),        sub: "Not yet uploaded" },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--c-text-muted)]">
                {label}
              </p>
              <p className="mt-2 text-3xl font-bold text-[var(--c-text)]">{value}</p>
              <p className="mt-1 text-xs text-[var(--c-text-muted)]">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Agent Assessment Panel ─────────────────────────────────────── */}
        {agentError && (
          <div className="rounded-[var(--r-lg)] border border-[var(--c-error-border)] bg-[var(--c-error-bg)] px-4 py-3 text-sm text-[var(--c-error)]">
            {agentError}
          </div>
        )}

        <AgentPanel
          agentAssessment={agentAssessment}
          isRunning={agentRunning}
          onRunAgent={handleRunAgent}
          caseId={caseData?._id}
        />

        {/* Document Status + Application Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-sm p-6">
            <h2 className="text-base font-bold text-[var(--c-text)] mb-4">Document Status</h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-[var(--c-text)]">Total Required:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{totalDocs}</span>
              </p>
              <p>
                <strong className="text-[var(--c-text)]">Uploaded:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{uploaded} / {totalDocs} ({uploadedPct}%)</span>
              </p>
              <p>
                <strong className="text-[var(--c-text)]">Verified:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{valid} / {totalDocs} ({verifiedPct}%)</span>
              </p>
              <p>
                <strong className="text-[var(--c-text)]">Missing:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{missing.length}</span>
              </p>
              {missing.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--c-border)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--c-text-muted)] mb-2">
                    Missing Documents
                  </p>
                  <ul className="space-y-1">
                    {missing.map((doc) => (
                      <li key={doc} className="text-xs text-[var(--c-text-mid)] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-sm p-6">
            <h2 className="text-base font-bold text-[var(--c-text)] mb-4">Application Summary</h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-[var(--c-text)]">Case ID:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{caseId}</span>
              </p>
              <p>
                <strong className="text-[var(--c-text)]">Visa Type:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{caseData?.visaType}</span>
              </p>
              <p>
                <strong className="text-[var(--c-text)]">Destination:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{caseData?.country}</span>
              </p>
              <p>
                <strong className="text-[var(--c-text)]">Activity Events:</strong>{" "}
                <span className="text-[var(--c-text-mid)]">{activityFeed.length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-sm p-6">
          <ActivityFeed />
        </div>

        {/* Quick Access */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/analysis"
            className="block bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] p-5 shadow-sm transition hover:border-[var(--c-green)] hover:shadow-md"
          >
            <h2 className="text-sm font-bold text-[var(--c-text)]">Analysis Report</h2>
            <p className="mt-1 text-xs text-[var(--c-text-muted)]">View complete visa assessment.</p>
          </Link>

          <Link
            to="/documents"
            className="block bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] p-5 shadow-sm transition hover:border-[var(--c-green)] hover:shadow-md"
          >
            <h2 className="text-sm font-bold text-[var(--c-text)]">Document Upload</h2>
            <p className="mt-1 text-xs text-[var(--c-text-muted)]">Upload or re-verify documents.</p>
          </Link>

          <Link
            to="/journey"
            className="block bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] p-5 shadow-sm transition hover:border-[var(--c-green)] hover:shadow-md"
          >
            <h2 className="text-sm font-bold text-[var(--c-text)]">Processing Journey</h2>
            <p className="mt-1 text-xs text-[var(--c-text-muted)]">Review your visa journey timeline.</p>
          </Link>
        </div>

        {/* Submit Application */}
        <div className="flex justify-end pb-4">
          <button
            type="button"
            onClick={handleFinish}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--c-green)] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--c-green-mid)] active:scale-[0.98]"
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