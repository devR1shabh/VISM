// src/pages/ApplicationReady.jsx

import { useNavigate } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../context/CaseContext";
import { generateVisaPDF } from "../utils/pdfGenerator";
import { PageHeader } from "../components/ui";

// ── FUTURE_ENHANCEMENTS — completely unchanged ─────────────────────────────
const FUTURE_ENHANCEMENTS = [
  {
    icon: "🏢",
    title: "PROCESSOR DASHBOARD",
    featured: true,
    description:
      "Dedicated immigration processor portal for reviewing applications, validating documents, managing queues, updating statuses, adding processor notes, and communicating with applicants.",
  },
  {
    icon: "🌍",
    title: "MORE VISA TYPES",
    description:
      "Support for: Permanent Residency Visa, Business Visa, Transit Visa, Family Reunion Visa. Future-ready architecture for additional visa categories.",
  },
  {
    icon: "📄",
    title: "MORE DOCUMENT SUPPORT",
    description:
      "Expanded document verification support for: Employment Letters, Sponsorship Letters, Bank Statements, Marriage Certificates, Property Documents, Invitation Letters.",
  },
  {
    icon: "🆔",
    title: "CASE ID APPLICATION RETRIEVAL",
    description:
      "Applicants will be able to enter Case ID, retrieve application, track status, and view progress without restarting the application process.",
  },
  {
    icon: "✉️",
    title: "EMAIL NOTIFICATIONS",
    description:
      "Automated notifications for: Application Submitted, Passport Verified, Documents Verified, Status Updated, Application Approved, Application Rejected.",
  },
];

function ApplicationReady() {
  // ── Logic completely unchanged ────────────────────────────────────────────
  const navigate = useNavigate();
  const { caseData, uploadedDocuments, workflowStep, clearCase } = useCase();

  const caseId = caseData?.caseId || caseData?.id || "—";
  const completionDate = new Date().toLocaleDateString("en-GB", {
    day:   "2-digit",
    month: "long",
    year:  "numeric",
  });

  const canDownload = workflowStep >= WORKFLOW_STEPS.ALL_DONE && Boolean(caseData);

  const handleDownloadPDF = () => {
    if (!canDownload) return;
    generateVisaPDF(caseData, caseData.analysis, uploadedDocuments);
  };

  const handleStartNew = () => {
    clearCase();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[var(--c-bg)]">

      <PageHeader
        eyebrow="Application Complete"
        title="Application Ready"
        description="Your visa application package is complete. Download your summary PDF to review and submit."
      />

      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8 space-y-8">

        {/* Success card */}
        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-card)] p-10 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-[#DCFCE7] border-4 border-[#BBF7D0] flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-[#16A34A]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-[var(--c-text)] mb-2">
            Application Package Complete
          </h2>
          <p className="text-[var(--c-text-mid)] mb-6 max-w-md mx-auto">
            Your visa application package is complete. Download your summary PDF to review and submit.
          </p>

          {/* Download PDF — onClick, disabled, title all unchanged */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={!canDownload}
            title={!canDownload ? "Complete all steps to enable PDF download" : ""}
            className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-lg font-semibold text-sm transition shadow-sm ${
              canDownload
                ? "bg-[var(--c-green)] text-white hover:bg-[var(--c-green-mid)] active:scale-[0.98]"
                : "bg-[var(--c-border)] text-[var(--c-text-muted)] cursor-not-allowed"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>

          <div className="mt-5 inline-flex items-center gap-2 bg-[var(--c-bg)] border border-[var(--c-border)] px-4 py-1.5 rounded-full text-sm">
            <strong className="text-[var(--c-text)]">Completed</strong>
            <span className="text-[var(--c-text-muted)]">{completionDate}</span>
          </div>
        </div>

        {/* Application Summary */}
        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
          <h2 className="text-base font-bold text-[var(--c-text)] mb-5">Application Summary</h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { label: "Case ID",             value: caseId                    },
              { label: "Visa Type",           value: caseData?.visaType || "—" },
              { label: "Destination Country", value: caseData?.country  || "—" },
              { label: "Completion Date",     value: completionDate            },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--c-text-muted)] mb-1">
                  {label}
                </p>
                <p className="text-base font-semibold text-[var(--c-text)]">{value}</p>
              </div>
            ))}
          </div>

          {/* Verified documents — logic unchanged */}
          <div className="mt-6 pt-5 border-t border-[var(--c-border)]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--c-text-muted)] mb-3">
              Verified Documents
            </p>
            <div className="flex flex-wrap gap-2">
              {(caseData?.analysis?.documents || []).map((doc) => {
                const verified = uploadedDocuments.some(
                  (u) => u.requiredDocument === doc && u.valid
                );
                return (
                  <span
                    key={doc}
                    className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full border ${
                      verified
                        ? "bg-[#DCFCE7] text-[#14532D] border-[#BBF7D0]"
                        : "bg-[var(--c-bg)] text-[var(--c-text-muted)] border-[var(--c-border)]"
                    }`}
                  >
                    {verified ? (
                      <svg className="w-3 h-3 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {doc}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

      

        {/* Start New — onClick unchanged: clearCase → navigate("/") */}
        <div className="text-center pb-4">
          <p className="text-[var(--c-text-muted)] text-sm mb-3">Want to start a new application?</p>
          <button
            type="button"
            onClick={handleStartNew}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--c-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--c-text)] shadow-sm transition hover:border-[var(--c-green)] hover:shadow-md active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Start New Application
          </button>
        </div>

      </div>
    </main>
  );
}

export default ApplicationReady;