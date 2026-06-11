// src/pages/ApplicationReady.jsx

import { useNavigate } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../context/CaseContext";
import { generateVisaPDF } from "../utils/pdfGenerator";

const FUTURE_ENHANCEMENTS = [
  {
    icon: "🤖",
    title: "AI Success Prediction",
    description:
      "Machine learning models trained on thousands of visa outcomes to predict your application's success probability before submission.",
  },
  {
    icon: "🌍",
    title: "More Visa Types",
    description:
      "Support for Permanent Residency, Working Holiday, Business, Transit, Family Reunion, and Investor visas across additional countries.",
  },
  {
    icon: "🖥️",
    title: "Processor Dashboard",
    description:
      "A dedicated immigration officer portal for reviewing applications, managing case queues, and communicating directly with applicants.",
  },
  {
    icon: "📱",
    title: "Real-Time Status Tracking",
    description:
      "Live push notifications for every stage of your application — from submission to embassy decision — with SMS and email alerts.",
  },
  {
    icon: "🔗",
    title: "Embassy API Integration",
    description:
      "Direct integration with embassy and consulate systems to auto-submit applications and receive official processing updates.",
  },
  {
    icon: "📊",
    title: "Multi-Applicant Management",
    description:
      "Manage family or group applications together, track dependants, and submit joint sponsorship documentation in a single workflow.",
  },
];

function ApplicationReady() {
  const navigate = useNavigate();
  const { caseData, uploadedDocuments, workflowStep, clearCase } = useCase();

  const caseId = caseData?.caseId || caseData?.id || "—";
  const completionDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // PDF download only available once all steps are done
  const canDownload = workflowStep >= WORKFLOW_STEPS.ALL_DONE && Boolean(caseData);

  const handleDownloadPDF = () => {
    if (!canDownload) return;
    generateVisaPDF(caseData, caseData.analysis, uploadedDocuments);
  };

  const handleStartNew = () => {
    // Clear all state so the app returns to a clean initial state
    clearCase();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#061A28] text-white px-4 py-8 lg:px-8">

      {/* Success Hero */}
      <section className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-[#083D4A]/80 p-10 shadow-[0_40px_120px_-40px_rgba(34,231,197,0.25)] backdrop-blur-xl mb-10">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#22E7C5] to-[#39F5D5] flex items-center justify-center mb-4 shadow-lg ring-8 ring-[#22E7C5]/10">
              <svg
                className="w-12 h-12 text-[#061A28]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute -inset-6 blur-3xl filter" style={{ boxShadow: '0 30px 80px -30px rgba(34,231,197,0.18)' }} />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight">Application Ready</h1>
          <p className="text-[#B8C5D1] text-lg max-w-2xl">
            Your visa application package is complete. Download your summary PDF to review and submit.
          </p>

          {/* Download PDF CTA */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={!canDownload}
              title={!canDownload ? "Complete all steps to enable PDF download" : ""}
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-3xl font-semibold text-sm transition shadow-md ${
                canDownload
                  ? "bg-[#22E7C5] text-[#061A28] hover:bg-[#39F5D5]"
                  : "bg-white/5 text-[#B8C5D1] cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>

          <div className="mt-2 text-sm text-[#B8C5D1]">
            <span className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
              <strong className="text-white">Completed</strong>
              <span className="text-[#B8C5D1]">{completionDate}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Application Summary */}
      <section className="mx-auto max-w-4xl rounded-[20px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_20px_60px_-20px_rgba(34,231,197,0.12)] backdrop-blur-xl mb-10">
        <h2 className="text-2xl font-semibold text-white mb-6">Application Summary</h2>

        <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
          {[
            { label: "Case ID", value: caseId },
            { label: "Visa Type", value: caseData?.visaType || "—" },
            { label: "Destination Country", value: caseData?.country || "—" },
            { label: "Completion Date", value: completionDate },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#B8C5D1] mb-1">{label}</p>
              <p className="text-lg font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Verified documents */}
        <div className="mt-8 pt-6 border-t border-white/6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#B8C5D1] mb-4">Verified Documents</p>
          <div className="flex flex-wrap gap-2">
            {(caseData?.analysis?.documents || []).map((doc) => {
              const verified = uploadedDocuments.some(
                (u) => u.requiredDocument === doc && u.valid
              );
              return (
                <span
                  key={doc}
                  className={`inline-flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full ${
                    verified
                      ? "bg-[#22E7C5]/12 text-white border border-[#22E7C5]"
                      : "bg-white/5 text-[#B8C5D1] border border-white/6"
                  }`}
                >
                  {verified ? (
                    <svg className="w-3.5 h-3.5 text-[#22E7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-[#B8C5D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {doc}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Future Enhancements */}
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/6" />
          <h2 className="text-2xl font-semibold text-white whitespace-nowrap">🚀 Future Enhancements</h2>
          <div className="flex-1 h-px bg-white/6" />
        </div>

        <p className="text-center text-[#B8C5D1] mb-8 max-w-xl mx-auto">The BlueprintAI roadmap — features being built to make visa applications faster, smarter, and more transparent.</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {FUTURE_ENHANCEMENTS.map(({ icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-white/6 bg-white/5 p-5 backdrop-blur transition hover:shadow-lg hover:scale-[1.01]">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-[#B8C5D1] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[#B8C5D1] text-sm mb-3">Want to start a new application?</p>
          <button
            type="button"
            onClick={handleStartNew}
            className="inline-flex items-center gap-2 rounded-3xl px-6 py-3 text-sm font-semibold bg-white/5 text-[#22E7C5] hover:bg-white/6 border border-white/6 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Start New Application
          </button>
        </div>
      </section>

    </main>
  );
}

export default ApplicationReady;