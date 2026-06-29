// src/pages/ProcessorCaseDetail.jsx
//
// FEATURE 7 CHANGE:
//   Added CountryGuidelinesPanel import.
//   Panel renders between AgentAssessmentPanel and QuestionnairePanel
//   so the processor sees country-specific visa requirements while
//   reviewing the case.

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate }                   from "react-router-dom";
import { useProcessorAuth }      from "../context/ProcessorAuthContext";
import CaseAssessmentPanel       from "../components/processor/CaseAssessmentPanel";
import CasePassportPanel         from "../components/processor/CasePassportPanel";
import CaseDocumentsPanel        from "../components/processor/CaseDocumentsPanel";
import ProcessorNotesPanel       from "../components/processor/ProcessorNotesPanel";
import ProcessorActions          from "../components/processor/ProcessorActions";
import AuditTimeline             from "../components/processor/AuditTimeline";
import QuestionnairePanel        from "../components/processor/QuestionnairePanel";
import AgentAssessmentPanel      from "../components/processor/AgentAssessmentPanel";
import CountryGuidelinesPanel    from "../components/output/CountryGuidelinesPanel.jsx";

import {
  getCaseByIdProcessor,
  sendProcessorAction,
} from "../services/api.js";
import { formatDate, formatDateTime } from "../utils/dateUtils.js";

function StatusBadge({ status }) {
  const map = {
    Pending:          "bg-[var(--c-warning-bg)] text-[var(--c-warning)] border-[var(--c-warning-border)]",
    Approved:         "bg-[var(--c-green-bg)] text-[var(--c-green)] border-[var(--c-green-light)]",
    Rejected:         "bg-[var(--c-error-bg)] text-[var(--c-error)] border-[var(--c-error-border)]",
    "Need Documents": "bg-[var(--c-info-bg)] text-[var(--c-info)] border-[var(--c-info-border)]",
  };
  const cls = map[status] || "bg-[var(--c-bg)] text-[var(--c-text-muted)] border-[var(--c-border)]";
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ${cls}`}>
      {status || "Pending"}
    </span>
  );
}

function ProcessorCaseDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { auth } = useProcessorAuth();

  const [caseRecord,   setCaseRecord]   = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [notesSaving,  setNotesSaving]  = useState(false);

  const viewLoggedRef = useRef(false);
  const pollRef       = useRef(null);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  const loadCase = useCallback(async () => {
    try {
      const data = await getCaseByIdProcessor(id);
      setCaseRecord(data);
      setError("");
      return data;
    } catch (err) {
      setError(err.message || "Failed to load case.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    async function init() {
      const data = await loadCase();
      if (data && !viewLoggedRef.current) {
        viewLoggedRef.current = true;
        try {
          const updated = await sendProcessorAction(data._id, "view_case", "");
          setCaseRecord(updated);
        } catch {
          // Non-critical
        }
      }
      if (data?.agentAssessment?.running) {
        startAgentPolling(data._id);
      }
    }
    init();
    return () => stopPolling();
  }, [loadCase]);

  function startAgentPolling(caseId) {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const record = await getCaseByIdProcessor(caseId);
        if (!record.agentAssessment?.running) {
          stopPolling();
          setCaseRecord(record);
        }
      } catch {
        // Silent
      }
    }, 3000);
  }

  const handleActionSuccess = useCallback((updatedCase) => {
    setCaseRecord(updatedCase);
  }, []);

  const handleAddNote = useCallback(async (noteText) => {
    if (!caseRecord) return;
    setNotesSaving(true);
    try {
      const updated = await sendProcessorAction(caseRecord._id, "add_note", noteText);
      setCaseRecord(updated);
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setNotesSaving(false);
    }
  }, [caseRecord]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[var(--c-green)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--c-text-muted)]">Loading case...</p>
        </div>
      </main>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !caseRecord) {
    return (
      <main className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-xl font-bold text-[var(--c-text)] mb-2">Case Not Found</h2>
          <p className="text-sm text-[var(--c-text-muted)] mb-6">{error || "This case does not exist."}</p>
          <button
            type="button"
            onClick={() => navigate("/processor")}
            className="rounded-[var(--r-lg)] bg-[var(--c-green)] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[var(--c-green-mid)] transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const applicantName = caseRecord.passportData?.name || "—";

  return (
    <main className="min-h-screen bg-[var(--c-bg)]">

      {/* ── Processor Navbar ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[var(--c-green)] shadow-[0_1px_0_rgba(255,255,255,0.1)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/processor")}
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              All Cases
            </button>
            <div className="w-px h-4 bg-white/25" />
            <span className="font-display text-lg font-bold text-white">VISM</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/55 font-semibold hidden sm:block">
              Processor
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-[var(--r-md)] border border-white/20 bg-white/10 px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
            <span className="text-xs text-white font-medium">{auth?.username}</span>
          </div>
        </div>
      </nav>

      {/* ── Case Header ───────────────────────────────────────────────────── */}
      <div className="bg-[var(--c-green)] border-b border-white/15 px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/60 font-semibold mb-1">
                Case Review
              </p>
              <h1 className="font-display text-3xl font-bold text-white">{applicantName}</h1>
              <p className="mt-1.5 text-sm text-white/65">
                {caseRecord.visaType} · {caseRecord.country}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Case ID",     value: caseRecord.caseId               },
                { label: "Visa Type",   value: caseRecord.visaType             },
                { label: "Destination", value: caseRecord.country              },
                { label: "Created",     value: formatDate(caseRecord.createdAt) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[var(--r-lg)] border border-white/15 bg-white/10 px-4 py-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/55">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-white leading-tight">
                    {item.value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-white/15 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/65">Status:</span>
              <StatusBadge status={caseRecord.processorStatus} />
            </div>
            <p className="text-xs text-white/50">
              {caseRecord.auditLog?.length || 0} audit events ·{" "}
              {caseRecord.processorNotes?.length || 0} notes
            </p>
          </div>
        </div>
      </div>

      {/* ── Page Body ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ── Left column — case content ──────────────────────────────── */}
          <div className="space-y-5 min-w-0">

            <CaseAssessmentPanel  caseRecord={caseRecord} />
            <AgentAssessmentPanel caseRecord={caseRecord} />

            {/* FEATURE 7: Country-specific visa guidelines for the processor */}
            <CountryGuidelinesPanel
              country={caseRecord.country}
              visaType={caseRecord.visaType}
            />

            <QuestionnairePanel   caseRecord={caseRecord} />
            <CasePassportPanel    caseRecord={caseRecord} />
            <CaseDocumentsPanel   caseRecord={caseRecord} />

          </div>

          {/* ── Right column — actions + notes + audit ──────────────────── */}
          <div className="space-y-5">
            <ProcessorActions
              caseId={caseRecord._id}
              currentStatus={caseRecord.processorStatus}
              onActionSuccess={handleActionSuccess}
            />
            <ProcessorNotesPanel
              notes={caseRecord.processorNotes || []}
              onAddNote={handleAddNote}
              isSaving={notesSaving}
            />
            <AuditTimeline caseRecord={caseRecord} />
          </div>

        </div>
      </div>
    </main>
  );
}

export default ProcessorCaseDetail;