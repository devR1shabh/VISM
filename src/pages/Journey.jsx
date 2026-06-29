// src/pages/Journey.jsx
//
// FEATURE 8 CHANGE:
//   Added ConfidenceScoreGauge panel.
//   Auto-generates score on first visit if none exists.
//   Score stored in caseData.visaConfidenceScore via setCaseData.

import { useEffect, useState }      from "react";
import { useNavigate }              from "react-router-dom";
import { useCase, WORKFLOW_STEPS }  from "../context/CaseContext";
import VisaJourneyTimeline          from "../components/output/VisaJourneyTimeline";
import ComplianceNotes              from "../components/output/ComplianceNotes";
import ConfidenceScoreGauge         from "../components/output/ConfidenceScoreGauge";
import { PageHeader }               from "../components/ui";
import { generateConfidenceScore }  from "../services/api";

// ── Requirements checklist ────────────────────────────────────────────────────
function RequirementsChecklist() {
  const { caseData, uploadedDocuments } = useCase();
  const requiredDocuments = caseData?.analysis?.documents || [];

  const checks = [
    { label: "Visa Type Selected",           met: Boolean(caseData?.visaType) },
    { label: "Destination Country Selected", met: Boolean(caseData?.country)  },
    ...requiredDocuments.map((doc) => ({
      label: `${doc} Verified`,
      met:   uploadedDocuments.some(
        (u) => u.requiredDocument === doc && u.valid
      ),
    })),
  ];

  const metCount = checks.filter((c) => c.met).length;

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-[var(--c-text)]">Requirements Checklist</h2>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--c-bg)] border border-[var(--c-border)] text-[var(--c-text-muted)]">
          {metCount} / {checks.length} Complete
        </span>
      </div>
      <ul className="space-y-2.5">
        {checks.map(({ label, met }) => (
          <li
            key={label}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              met
                ? "border-[#BBF7D0] bg-[#DCFCE7]"
                : "border-[var(--c-border)] bg-[var(--c-bg)]"
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              met ? "bg-[#16A34A]" : "bg-[#E6E8EB]"
            }`}>
              {met ? (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                </svg>
              )}
            </div>
            <span className={`text-sm font-medium ${met ? "text-[#14532D]" : "text-[var(--c-text-mid)]"}`}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Journey page ──────────────────────────────────────────────────────────────
function Journey() {
  const navigate  = useNavigate();
  const { caseData, setCaseData, setWorkflowStep } = useCase();

  const [autoGenerating, setAutoGenerating] = useState(false);

  // Auto-generate score on first visit if none exists yet
  useEffect(() => {
    const caseId   = caseData?._id;
    const hasScore = caseData?.visaConfidenceScore?.score !== null &&
                     caseData?.visaConfidenceScore?.score !== undefined;

    if (!caseId || hasScore || autoGenerating) return;

    let cancelled = false;
    setAutoGenerating(true);

    // Mark locally as running so gauge shows spinner immediately
    setCaseData((prev) => ({
      ...prev,
      visaConfidenceScore: { ...prev?.visaConfidenceScore, running: true },
    }));

    generateConfidenceScore(caseId)
      .then((result) => {
        if (!cancelled && result?.visaConfidenceScore) {
          setCaseData((prev) => ({
            ...prev,
            visaConfidenceScore: result.visaConfidenceScore,
          }));
        }
      })
      .catch((err) => {
        console.error("[Journey] Auto-score failed:", err);
        if (!cancelled) {
          setCaseData((prev) => ({
            ...prev,
            visaConfidenceScore: { ...prev?.visaConfidenceScore, running: false },
          }));
        }
      })
      .finally(() => {
        if (!cancelled) setAutoGenerating(false);
      });

    return () => { cancelled = true; };
  }, [caseData?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!caseData) {
    return (
      <main className="min-h-screen bg-[var(--c-bg)]">
        <PageHeader
          eyebrow="Immigration Journey Tracker"
          title="Your Visa Journey"
          description="Track every milestone of your visa application from assessment to approval."
        />
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 text-center">
          <div className="bg-white border border-[var(--c-border)] rounded-xl shadow-sm p-12 max-w-md mx-auto">
            <svg className="w-10 h-10 text-[var(--c-text-muted)] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-2">No Case Yet</h2>
            <p className="text-sm text-[var(--c-text-muted)] mb-6">
              Create a case to view your visa journey and confidence score.
            </p>
            <button
              onClick={() => navigate("/packages")}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--c-green)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--c-green-mid)] transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </main>
    );
  }

  const visaJourney     = caseData?.analysis?.visaJourney     || [];
  const complianceNotes = caseData?.analysis?.complianceNotes || [];
  const caseId          = caseData?.caseId || caseData?.id || "—";
  const status          = caseData?.status || "In Progress";

  const handleScoreUpdate = (newScore) => {
    setCaseData((prev) => ({ ...prev, visaConfidenceScore: newScore }));
  };

  const handleProceed = () => {
    setWorkflowStep(WORKFLOW_STEPS.JOURNEY_DONE);
    navigate("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[var(--c-bg)]">

      <PageHeader
        eyebrow="Immigration Journey Tracker"
        title="Your Visa Journey"
        description="Track every milestone of your visa application from assessment to approval."
      >
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { label: "Case ID",     value: caseId                    },
            { label: "Visa Type",   value: caseData?.visaType || "—" },
            { label: "Destination", value: caseData?.country  || "—" },
            { label: "Status",      value: status                     },
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

        {/* ── FEATURE 8: Confidence Score + Journey in 2-col layout ────── */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* Left: journey timeline */}
          <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
            <VisaJourneyTimeline visaJourney={visaJourney} />
          </div>

          {/* Right: confidence score gauge */}
          <ConfidenceScoreGauge
            caseId={caseData?._id}
            score={caseData?.visaConfidenceScore}
            onScoreUpdate={handleScoreUpdate}
          />
        </div>

        {/* ── Compliance + checklist ────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
            <ComplianceNotes notes={complianceNotes} />
          </div>
          <RequirementsChecklist />
        </div>

        {/* ── Proceed ──────────────────────────────────────────────────── */}
        <div className="flex justify-end pb-4">
          <button
            type="button"
            onClick={handleProceed}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--c-green)] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--c-green-mid)] active:scale-[0.98]"
          >
            Proceed To Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

      </div>
    </main>
  );
}

export default Journey;