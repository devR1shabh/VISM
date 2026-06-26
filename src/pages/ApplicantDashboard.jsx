// src/pages/ApplicantDashboard.jsx

import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate }                from "react-router-dom";

import { useApplicantAuth }     from "../context/ApplicantAuthContext.jsx";
import { getApplicantCases }    from "../services/api.js";
import { PageHeader }           from "../components/ui/index.jsx";
import { formatDate, formatDateTime } from "../utils/dateUtils.js";
import CaseCard                 from "../components/applicant/CaseCard.jsx";
import ProcessorRemarksPanel    from "../components/applicant/ProcessorRemarksPanel.jsx";

const FILTER_TABS = ["All", "Pending", "Approved", "Rejected", "Need Documents"];

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    "Pending":        "bg-[var(--c-warning-bg)]  text-[var(--c-warning)]  border-[var(--c-warning-border)]",
    "Approved":       "bg-[var(--c-green-bg)]    text-[var(--c-green)]    border-[var(--c-green-light)]",
    "Rejected":       "bg-[var(--c-error-bg)]    text-[var(--c-error)]    border-[var(--c-error-border)]",
    "Need Documents": "bg-[var(--c-info-bg)]     text-[var(--c-info)]     border-[var(--c-info-border)]",
  };
  const cls = map[status] || map["Pending"];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] ${cls}`}>
      {status || "Pending"}
    </span>
  );
}

// ── KPI summary cards ─────────────────────────────────────────────────────────
function SummaryCards({ cases }) {
  const total    = cases.length;
  const approved = cases.filter((c) => c.processorStatus === "Approved").length;
  const pending  = cases.filter((c) => !c.processorStatus || c.processorStatus === "Pending").length;
  const needDocs = cases.filter((c) => c.processorStatus === "Need Documents").length;
  const rejected = cases.filter((c) => c.processorStatus === "Rejected").length;

  const cards = [
    { label: "Total Cases",    value: total,    color: "border-l-[var(--c-green)]",   text: "text-[var(--c-green)]"   },
    { label: "Approved",       value: approved,  color: "border-l-[var(--c-success)]", text: "text-[var(--c-success)]" },
    { label: "Pending Review", value: pending,   color: "border-l-[var(--c-warning)]", text: "text-[var(--c-warning)]" },
    { label: "Need Documents", value: needDocs,  color: "border-l-[var(--c-info)]",    text: "text-[var(--c-info)]"    },
    { label: "Rejected",       value: rejected,  color: "border-l-[var(--c-error)]",   text: "text-[var(--c-error)]"   },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(({ label, value, color, text }) => (
        <div
          key={label}
          className={`bg-[var(--c-card)] border border-[var(--c-border)] border-l-4 ${color} rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-5`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-muted)]">{label}</p>
          <p className={`mt-2 text-3xl font-bold ${text}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Audit timeline ────────────────────────────────────────────────────────────
function AuditTimeline({ entries = [] }) {
  if (!entries.length) return null;
  const recent = [...entries].reverse().slice(0, 5);

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <h2 className="text-sm font-bold text-[var(--c-text)] uppercase tracking-[0.08em] mb-4">
        Case Timeline
      </h2>
      <ol className="relative border-l border-[var(--c-border)] space-y-4 ml-2">
        {recent.map((entry, idx) => (
          <li key={idx} className="pl-5 relative">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[var(--c-green-bg)] border-2 border-[var(--c-green)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--c-green)]" />
            </div>
            <p className="text-sm font-semibold text-[var(--c-text)] leading-snug">{entry.event}</p>
            {entry.detail && (
              <p className="text-xs text-[var(--c-text-muted)] mt-0.5 leading-relaxed">{entry.detail}</p>
            )}
            <p className="text-[10px] text-[var(--c-text-muted)] mt-1">{formatDateTime(entry.timestamp)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── Documents panel ───────────────────────────────────────────────────────────
function DocumentsPanel({ uploadedDocuments = [], requiredDocuments = [] }) {
  const total    = requiredDocuments.length;
  const verified = uploadedDocuments.filter(
    (d) => d.verified && requiredDocuments.includes(d.type)
  ).length;

  if (!total) return null;

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[var(--c-text)] uppercase tracking-[0.08em]">Documents</h2>
        <span className="text-xs font-semibold text-[var(--c-text-muted)]">{verified} / {total} verified</span>
      </div>
      <div className="space-y-2">
        {requiredDocuments.map((docType) => {
          const uploaded   = uploadedDocuments.find((d) => d.type === docType);
          const isVerified = uploaded?.verified;
          const isUploaded = Boolean(uploaded);

          return (
            <div key={docType} className="flex items-center justify-between py-2 border-b border-[var(--c-border)] last:border-0">
              <span className="text-sm text-[var(--c-text-mid)] truncate flex-1 mr-4">{docType}</span>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--c-success)] bg-[var(--c-success-bg)] border border-[var(--c-success-border)] rounded-full px-2 py-0.5 shrink-0">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              ) : isUploaded ? (
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--c-warning)] bg-[var(--c-warning-bg)] border border-[var(--c-warning-border)] rounded-full px-2 py-0.5 shrink-0">
                  Uploaded
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--c-text-muted)] bg-[var(--c-bg)] border border-[var(--c-border)] rounded-full px-2 py-0.5 shrink-0">
                  Missing
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Case detail modal ─────────────────────────────────────────────────────────
function CaseDetailPanel({ caseRecord, onClose }) {
  const {
    caseId, visaType, country, createdAt,
    processorStatus, processorNotes = [],
    uploadedDocuments = [], analysis, auditLog = [],
    agentAssessment,
  } = caseRecord;

  const requiredDocuments = analysis?.documents || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 py-6 sm:py-12">
      <div className="bg-[var(--c-bg)] w-full max-w-2xl rounded-[var(--r-2xl)] shadow-[var(--shadow-modal)] flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[var(--c-border)] shrink-0">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-muted)]">{caseId}</p>
            <h2 className="text-lg font-bold text-[var(--c-text)] mt-0.5">{visaType}</h2>
            <p className="text-sm text-[var(--c-text-muted)]">{country}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={processorStatus || "Pending"} />
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-[var(--c-text-muted)] hover:bg-[var(--c-border)] transition"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] p-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--c-text-muted)] font-semibold">Submitted</p>
              <p className="text-[var(--c-text-mid)] mt-0.5">{formatDate(createdAt)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--c-text-muted)] font-semibold">Country</p>
              <p className="text-[var(--c-text-mid)] mt-0.5">{country}</p>
            </div>
            {agentAssessment?.readinessLabel && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--c-text-muted)] font-semibold">Readiness</p>
                <p className="text-[var(--c-text-mid)] mt-0.5">{agentAssessment.readinessLabel}</p>
              </div>
            )}
            {agentAssessment?.overallRisk && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--c-text-muted)] font-semibold">Risk Level</p>
                <p className="text-[var(--c-text-mid)] mt-0.5">{agentAssessment.overallRisk}</p>
              </div>
            )}
          </div>

          <ProcessorRemarksPanel notes={processorNotes} processorStatus={processorStatus} />
          <DocumentsPanel uploadedDocuments={uploadedDocuments} requiredDocuments={requiredDocuments} />
          <AuditTimeline entries={auditLog} />

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--c-border)] shrink-0">
          <button
            onClick={onClose}
            className="w-full rounded-[var(--r-lg)] border border-[var(--c-border)] py-2.5 text-sm font-semibold text-[var(--c-text-muted)] hover:bg-[var(--c-bg-alt)] transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

// ── ApplicantDashboard ────────────────────────────────────────────────────────
function ApplicantDashboard() {
  const { user }  = useApplicantAuth();
  const navigate  = useNavigate();

  const [cases, setCases]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [filter, setFilter]     = useState("All");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);

  const loadCases = useCallback(async () => {
    try {
      setError("");
      const data = await getApplicantCases();
      setCases(data);
    } catch (err) {
      console.error("[ApplicantDashboard]", err);
      setError("Failed to load your cases. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCases(); }, [loadCases]);

  const filtered = cases.filter((c) => {
    const status = c.processorStatus || "Pending";
    if (filter !== "All" && status !== filter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.caseId?.toLowerCase().includes(q)   ||
      c.visaType?.toLowerCase().includes(q) ||
      c.country?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--c-bg)]">
        <PageHeader eyebrow="My Cases" title="Application Dashboard" description="All your visa cases, statuses, documents and processor updates." />
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[var(--c-border)] border-t-[var(--c-green)] rounded-full animate-spin" />
            <p className="text-xs text-[var(--c-text-muted)] uppercase tracking-[0.15em]">Loading your cases...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!loading && cases.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--c-bg)]">
        <PageHeader eyebrow="My Cases" title="Application Dashboard" description="All your visa cases, statuses, documents and processor updates." />
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 text-center">
          <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-card)] p-12 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-[var(--c-green-bg)] flex items-center justify-center mx-auto mb-5">
              <svg className="w-6 h-6 text-[var(--c-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-2">No cases yet</h2>
            <p className="text-sm text-[var(--c-text-muted)] mb-6 leading-relaxed">
              Start your visa journey by creating your first case on the home page.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-[var(--r-lg)] bg-[var(--c-green)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--c-green-mid)] transition"
            >
              Start a New Case
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--c-bg)]">

      <PageHeader
        eyebrow="My Cases"
        title={`Welcome back, ${user?.name?.split(" ")[0] || "Applicant"}`}
        description="Track all your visa applications, documents, and processor updates in one place."
      >
        <div className="mt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-[var(--r-lg)] bg-white/15 border border-white/25 px-5 py-2 text-sm font-semibold text-white hover:bg-white/25 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Case
          </Link>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-6">

        {error && (
          <div className="rounded-[var(--r-lg)] border border-[var(--c-error-border)] bg-[var(--c-error-bg)] px-5 py-4 text-sm text-[var(--c-error)] flex items-center gap-3">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <SummaryCards cases={cases} />

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1 bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-lg)] p-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-[var(--r-md)] px-3 py-1.5 text-xs font-semibold transition ${
                  filter === tab
                    ? "bg-[var(--c-green)] text-white shadow-sm"
                    : "text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:bg-[var(--c-bg)]"
                }`}
              >
                {tab}
                {tab !== "All" && (
                  <span className="ml-1.5 opacity-70">
                    ({cases.filter((c) => (c.processorStatus || "Pending") === tab).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--c-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by case ID, visa type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-lg)] text-[var(--c-text)] placeholder-[var(--c-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-[var(--c-green)] transition"
            />
          </div>

          <span className="text-xs text-[var(--c-text-muted)] ml-auto">
            {filtered.length} {filtered.length === 1 ? "case" : "cases"}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-[var(--c-text-muted)]">No cases match your current filter.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <div key={c._id} className="relative">
                <CaseCard caseRecord={c} />
                <button
                  onClick={() => setSelected(c)}
                  className="absolute bottom-[52px] right-4 text-[10px] font-semibold text-[var(--c-text-muted)] hover:text-[var(--c-green)] transition underline underline-offset-2"
                >
                  View details
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {selected && (
        <CaseDetailPanel caseRecord={selected} onClose={() => setSelected(null)} />
      )}

    </main>
  );
}

export default ApplicantDashboard;