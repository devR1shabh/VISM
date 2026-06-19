// src/components/processor/AgentAssessmentPanel.jsx
//
// Displays the output of the Readiness Assessment Agent for the processor.
// Shows: overall risk verdict, readiness label, prioritised actions,
// the agent's reasoning paragraph, and the full tool call transparency log.

import { useState } from "react";
import { Bot, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info } from "lucide-react";

// ── Risk badge ────────────────────────────────────────────────────────────────

function RiskBadge({ risk }) {
  const map = {
    LOW:    "bg-[var(--c-success-bg)] text-[var(--c-success)] border-[var(--c-success-border)]",
    MEDIUM: "bg-[var(--c-warning-bg)] text-[var(--c-warning)] border-[var(--c-warning-border)]",
    HIGH:   "bg-[var(--c-error-bg)]   text-[var(--c-error)]   border-[var(--c-error-border)]",
  };
  const cls = map[risk] || "bg-[var(--c-bg)] text-[var(--c-text-muted)] border-[var(--c-border)]";
  const Icon = risk === "LOW" ? CheckCircle : risk === "HIGH" ? AlertTriangle : Info;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${cls}`}>
      <Icon size={12} />
      {risk} RISK
    </span>
  );
}

// ── Tool call transparency log ────────────────────────────────────────────────

const TOOL_LABELS = {
  check_document_status:   "Document Status Check",
  check_passport_validity: "Passport Validity Check",
  check_financial_evidence:"Financial Evidence Check",
  check_questionnaire_gaps:"Questionnaire Analysis",
  write_assessment:        "Assessment Written",
};

const TOOL_ICONS = {
  check_document_status:   "📄",
  check_passport_validity: "🛂",
  check_financial_evidence:"💰",
  check_questionnaire_gaps:"📋",
  write_assessment:        "✅",
};

function ToolCallLog({ toolCallLog = [] }) {
  const [expanded, setExpanded] = useState(false);

  if (!toolCallLog || toolCallLog.length === 0) return null;

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 text-xs font-semibold text-[var(--c-text-muted)] hover:text-[var(--c-text)] transition w-full text-left"
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        <span className="uppercase tracking-[0.14em]">
          Agent Tool Call Log ({toolCallLog.length} calls)
        </span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          {toolCallLog.map((entry, idx) => (
            <div
              key={idx}
              className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] p-3"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">{TOOL_ICONS[entry.tool] || "🔧"}</span>
                <span className="text-xs font-bold text-[var(--c-text)]">
                  {TOOL_LABELS[entry.tool] || entry.tool}
                </span>
              </div>

              {entry.reason && (
                <p className="text-[11px] text-[var(--c-text-muted)] italic mb-1.5">
                  Reason: {entry.reason}
                </p>
              )}

              {entry.result && entry.tool !== "write_assessment" && (
                <pre className="text-[10px] text-[var(--c-text-mid)] bg-white border border-[var(--c-border)] rounded p-2 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
                  {JSON.stringify(entry.result, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function AgentAssessmentPanel({ caseRecord }) {
  const assessment = caseRecord?.agentAssessment;

  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("en-GB", {
        day:    "2-digit",
        month:  "short",
        year:   "numeric",
        hour:   "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  // ── Not run yet ────────────────────────────────────────────────────────────
  if (!assessment || (!assessment.overallRisk && !assessment.running)) {
    return (
      <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[var(--r-lg)] bg-[var(--c-bg)] border border-[var(--c-border)] flex items-center justify-center">
            <Bot size={16} className="text-[var(--c-text-muted)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--c-text)]">Agent Readiness Assessment</h3>
            <p className="text-xs text-[var(--c-text-muted)]">Autonomous AI assessment</p>
          </div>
        </div>
        <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-5 py-6 text-center">
          <Bot size={28} className="text-[var(--c-text-muted)] mx-auto mb-2" />
          <p className="text-sm font-medium text-[var(--c-text-muted)]">Assessment not yet run</p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">
            The applicant can trigger an assessment from their dashboard.
          </p>
        </div>
      </div>
    );
  }

  // ── Running state ──────────────────────────────────────────────────────────
  if (assessment.running) {
    return (
      <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-[var(--r-lg)] bg-[var(--c-green-bg)] border border-[var(--c-green-light)] flex items-center justify-center">
            <Bot size={16} className="text-[var(--c-green-mid)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--c-text)]">Agent Readiness Assessment</h3>
            <p className="text-xs text-[var(--c-text-muted)]">Autonomous AI assessment</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-5 rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)]">
          <div className="w-5 h-5 border-2 border-[var(--c-green)] border-t-transparent rounded-full animate-spin shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--c-text)]">Agent is running…</p>
            <p className="text-xs text-[var(--c-text-muted)]">
              Investigating documents, passport, finances, and questionnaire.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Completed assessment ───────────────────────────────────────────────────
  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[var(--r-lg)] bg-[var(--c-green-bg)] border border-[var(--c-green-light)] flex items-center justify-center">
            <Bot size={16} className="text-[var(--c-green-mid)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--c-text)]">Agent Readiness Assessment</h3>
            <p className="text-xs text-[var(--c-text-muted)]">Autonomous AI assessment</p>
          </div>
        </div>
        <RiskBadge risk={assessment.overallRisk} />
      </div>

      {/* Readiness label */}
      <div className="mb-4 rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-0.5">
          Readiness Label
        </p>
        <p className="text-sm font-bold text-[var(--c-text)]">{assessment.readinessLabel}</p>
      </div>

      {/* Actions */}
      {assessment.actions?.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--c-text-muted)] font-semibold mb-2">
            Priority Actions
          </p>
          <ul className="space-y-2">
            {assessment.actions.map((action, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 rounded-[var(--r-md)] border border-[var(--c-border)] bg-[var(--c-bg)] px-3 py-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-[var(--c-green)] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-xs text-[var(--c-text-mid)] leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reasoning */}
      {assessment.reasoning && (
        <div className="mb-2">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--c-text-muted)] font-semibold mb-2">
            Agent Reasoning
          </p>
          <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3">
            <p className="text-xs text-[var(--c-text-mid)] leading-relaxed">{assessment.reasoning}</p>
          </div>
        </div>
      )}

      {/* Tool call log */}
      <ToolCallLog toolCallLog={assessment.toolCallLog} />

      {/* Timestamp */}
      {assessment.runAt && (
        <p className="text-[11px] text-[var(--c-text-muted)] mt-4 text-right">
          Assessment run {formatDate(assessment.runAt)}
        </p>
      )}

    </div>
  );
}

export default AgentAssessmentPanel;