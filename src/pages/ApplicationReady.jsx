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
    <main className="min-h-screen bg-[#F7F8FA]">

      {/* Compact navy success header */}
      <PageHeader
        eyebrow="Application Complete"
        title="Application Ready"
        description="Your visa application package is complete. Download your summary PDF to review and submit."
      />

      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8 space-y-8">

        {/* Success card */}
        <div className="bg-white border border-[#E6E8EB] rounded-2xl shadow-sm p-10 text-center">
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

          <h2 className="text-2xl font-bold text-[#0A2E57] mb-2">
            Application Package Complete
          </h2>
          <p className="text-[#374151] mb-6 max-w-md mx-auto">
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
                ? "bg-[#0A2E57] text-white hover:bg-[#0F3D6E] active:scale-[0.98]"
                : "bg-[#E6E8EB] text-[#9CA3AF] cursor-not-allowed"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>

          <div className="mt-5 inline-flex items-center gap-2 bg-[#F7F8FA] border border-[#E6E8EB] px-4 py-1.5 rounded-full text-sm">
            <strong className="text-[#111827]">Completed</strong>
            <span className="text-[#6B7280]">{completionDate}</span>
          </div>
        </div>

        {/* Application Summary */}
        <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-6">
          <h2 className="text-base font-bold text-[#0A2E57] mb-5">Application Summary</h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { label: "Case ID",             value: caseId                    },
              { label: "Visa Type",           value: caseData?.visaType || "—" },
              { label: "Destination Country", value: caseData?.country  || "—" },
              { label: "Completion Date",     value: completionDate            },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280] mb-1">
                  {label}
                </p>
                <p className="text-base font-semibold text-[#111827]">{value}</p>
              </div>
            ))}
          </div>

          {/* Verified documents — logic unchanged */}
          <div className="mt-6 pt-5 border-t border-[#E6E8EB]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280] mb-3">
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
                        : "bg-[#F7F8FA] text-[#6B7280] border-[#E6E8EB]"
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

        {/* Future Enhancements */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#E6E8EB]" />
            <h2 className="text-lg font-bold text-[#0A2E57] whitespace-nowrap">
              🚀 Future Enhancements
            </h2>
            <div className="flex-1 h-px bg-[#E6E8EB]" />
          </div>

          <p className="text-center text-[#6B7280] text-sm mb-6 max-w-xl mx-auto">
            The BlueprintAI roadmap — features being built to make visa applications faster, smarter, and more transparent.
          </p>

          {/* Featured item — filter logic unchanged */}
          <div className="space-y-4 mb-4">
            {FUTURE_ENHANCEMENTS.filter((f) => f.featured).map(({ icon, title, description }) => (
              <div
                key={title}
                className="bg-white border border-[#4DC7F7]/30 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-none w-14 h-14 rounded-xl bg-[#E8F4FD] flex items-center justify-center text-2xl">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0A2E57]">{title}</h3>
                    <p className="mt-1 text-sm text-[#374151] leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grid items — filter logic unchanged */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FUTURE_ENHANCEMENTS.filter((f) => !f.featured).map(({ icon, title, description }) => (
              <div
                key={title}
                className="bg-white border border-[#E6E8EB] rounded-xl p-5 shadow-sm transition hover:border-[#4DC7F7] hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-none w-11 h-11 rounded-lg bg-[#E8F4FD] flex items-center justify-center text-xl">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0A2E57]">{title}</h4>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start New — onClick unchanged: clearCase → navigate("/") */}
        <div className="text-center pb-4">
          <p className="text-[#6B7280] text-sm mb-3">Want to start a new application?</p>
          <button
            type="button"
            onClick={handleStartNew}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E6E8EB] bg-white px-6 py-3 text-sm font-semibold text-[#0A2E57] shadow-sm transition hover:border-[#4DC7F7] hover:shadow-md active:scale-[0.98]"
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