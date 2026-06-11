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
    <main className="max-w-4xl mx-auto p-6">

      {/* Success Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white p-10 mb-10 shadow-xl text-center">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative">
          <div className="mx-auto w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-5 border-2 border-white/40">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            Application Ready!
          </h1>
          <p className="text-green-100 text-lg max-w-lg mx-auto">
            Your visa application package has been completed successfully.
            Download your summary PDF to review and submit.
          </p>

          {/* Download PDF — only available on this page after all steps complete */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={!canDownload}
            title={!canDownload ? "Complete all steps to enable PDF download" : ""}
            className={`mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-base shadow-lg transition ${
              canDownload
                ? "bg-white text-green-700 hover:bg-green-50"
                : "bg-white/40 text-white/60 cursor-not-allowed"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Case Details */}
      <div className="bg-white rounded-xl shadow p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Application Summary
        </h2>

        <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
          {[
            { label: "Case ID", value: caseId },
            { label: "Visa Type", value: caseData?.visaType || "—" },
            { label: "Destination Country", value: caseData?.country || "—" },
            { label: "Completion Date", value: completionDate },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                {label}
              </p>
              <p className="text-lg font-bold text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Verified documents */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
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
                  className={`inline-flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full ${
                    verified
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {verified ? (
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
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
          <div className="flex-1 h-px bg-gray-200" />
          <h2 className="text-2xl font-bold text-gray-700 whitespace-nowrap">
            🚀 Future Enhancements
          </h2>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <p className="text-center text-gray-500 mb-8 max-w-xl mx-auto">
          The BlueprintAI roadmap — features being built to make visa
          applications faster, smarter, and more transparent.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {FUTURE_ENHANCEMENTS.map(({ icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border border-gray-100"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm mb-3">
            Want to start a new application?
          </p>
          <button
            type="button"
            onClick={handleStartNew}
            className="inline-flex items-center gap-2 border border-blue-300 text-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-50 font-semibold text-sm transition"
          >
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Start New Application
          </button>
        </div>
      </div>

    </main>
  );
}

export default ApplicationReady;