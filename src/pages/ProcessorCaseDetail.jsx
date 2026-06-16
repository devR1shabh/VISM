// src/pages/ProcessorCaseDetail.jsx

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProcessorAuth }     from "../context/ProcessorAuthContext";
import CaseAssessmentPanel      from "../components/processor/CaseAssessmentPanel";
import CasePassportPanel        from "../components/processor/CasePassportPanel";
import CaseDocumentsPanel       from "../components/processor/CaseDocumentsPanel";
import ProcessorNotesPanel      from "../components/processor/ProcessorNotesPanel";
import ProcessorActions         from "../components/processor/ProcessorActions";
import AuditTimeline            from "../components/processor/AuditTimeline";

const API_URL = import.meta.env.VITE_API_URL;

async function fetchCase(id) {
  const res = await fetch(`${API_URL}/cases/${id}`);
  if (!res.ok) throw new Error("Case not found");
  return res.json();
}

async function sendProcessorAction(caseId, action, note) {
  const res = await fetch(`${API_URL}/cases/${caseId}/processor-action`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ action, note: note || "" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Action failed");
  }
  return res.json();
}

function StatusBadge({ status }) {
  const map = {
    Pending:          "border-amber-400/40 bg-amber-500/10 text-amber-300",
    Approved:         "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
    Rejected:         "border-red-400/40 bg-red-500/10 text-red-300",
    "Need Documents": "border-blue-400/40 bg-blue-500/10 text-blue-300",
  };
  const cls = map[status] || "border-white/10 bg-white/5 text-[#B8C5D1]";
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
      {status || "Pending"}
    </span>
  );
}

function formatDate(iso) {
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
}

function ProcessorCaseDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { auth }     = useProcessorAuth();

  const [caseRecord, setCaseRecord]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [notesSaving, setNotesSaving]   = useState(false);

  const viewLoggedRef = useRef(false);

  const loadCase = useCallback(async () => {
    try {
      const data = await fetchCase(id);
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
          // Non-critical — don't surface this error
        }
      }
    }
    init();
  }, [loadCase]);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#061A28] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#22E7C5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#B8C5D1]">Loading case...</p>
        </div>
      </main>
    );
  }

  if (error || !caseRecord) {
    return (
      <main className="min-h-screen bg-[#061A28] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-xl font-semibold text-white mb-2">Case Not Found</h2>
          <p className="text-[#B8C5D1] mb-6">{error || "This case does not exist."}</p>
          <button
            type="button"
            onClick={() => navigate("/processor")}
            className="rounded-xl bg-[#22E7C5] text-[#061A28] px-5 py-2.5 text-sm font-semibold hover:bg-[#39F5D5] transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const applicantName = caseRecord.passportData?.name || "—";

  return (
    <main className="min-h-screen bg-[#061A28] text-white">

      {/* Processor Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[#143045]/70 bg-[#061A28]/95 backdrop-blur-3xl shadow-[0_22px_60px_-35px_rgba(0,0,0,0.8)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 flex-wrap">

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/processor")}
              className="flex items-center gap-1.5 text-sm text-[#B8C5D1] hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              All Cases
            </button>
            <div className="w-px h-5 bg-white/15" />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#22E7C5] to-[#1AC9D6] shadow-lg">
                <span className="text-sm font-black tracking-[0.2em] text-slate-950">V</span>
              </div>
              <p className="text-sm font-semibold text-white hidden sm:block">VISM Processor</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22E7C5]" />
              <span className="text-xs text-[#B8C5D1]">{auth?.username}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Body */}
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">

        {/* Case Header */}
        <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_40px_120px_-40px_rgba(34,231,197,0.25)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#22E7C5] mb-2">Case Review</p>
              <h1 className="text-3xl font-bold text-white">{applicantName}</h1>
              <p className="mt-2 text-sm text-[#B8C5D1]">
                {caseRecord.visaType} · {caseRecord.country}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Case ID",     value: caseRecord.caseId },
                { label: "Visa Type",   value: caseRecord.visaType },
                { label: "Destination", value: caseRecord.country },
                { label: "Created",     value: formatDate(caseRecord.createdAt) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-[#B8C5D1]">{item.label}</p>
                  <p className="mt-1.5 text-sm font-semibold text-white leading-tight">
                    {item.value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#B8C5D1]">Status:</span>
              <StatusBadge status={caseRecord.processorStatus} />
            </div>
            <p className="text-xs text-[#B8C5D1]/60">
              {caseRecord.auditLog?.length || 0} audit events ·{" "}
              {caseRecord.processorNotes?.length || 0} notes
            </p>
          </div>
        </section>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">

          {/* Left: Assessment, Passport, Documents */}
          <div className="space-y-6 min-w-0">
            <CaseAssessmentPanel caseRecord={caseRecord} />
            <CasePassportPanel   caseRecord={caseRecord} />
            <CaseDocumentsPanel  caseRecord={caseRecord} />
          </div>

          {/* Right: Actions, Notes, Audit Timeline */}
          <div className="space-y-6">
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