// src/pages/Journey.jsx

import { useNavigate } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../context/CaseContext";
import VisaJourneyTimeline from "../components/output/VisaJourneyTimeline";
import ComplianceNotes from "../components/output/ComplianceNotes";

function RequirementsChecklist() {
  const { caseData, uploadedDocuments } = useCase();
  const requiredDocuments = caseData?.analysis?.documents || [];

  const checks = [
    { label: "Visa Type Selected", met: Boolean(caseData?.visaType) },
    { label: "Destination Country Selected", met: Boolean(caseData?.country) },
    ...requiredDocuments.map((doc) => ({
      label: `${doc} Verified`,
      met: uploadedDocuments.some(
        (u) => u.requiredDocument === doc && u.valid
      ),
    })),
  ];

  const metCount = checks.filter((c) => c.met).length;

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 p-6 shadow-[0_20px_60px_-20px_rgba(34,231,197,0.18)] backdrop-blur-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white">Requirements Checklist</h2>
        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white/5 text-[#B8C5D1]">
          {metCount} / {checks.length} Complete
        </span>
      </div>

      <ul className="space-y-3">
        {checks.map(({ label, met }) => (
          <li
            key={label}
            className={`flex items-center gap-3 p-3 rounded-xl border ${
              met
                ? "border-[#22E7C5] bg-[#22E7C5]/8"
                : "border-white/6 bg-white/3"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                met ? "bg-[#22E7C5]" : "bg-white/10"
              }`}
            >
              {met ? (
                <svg
                  className="w-4 h-4 text-[#061A28]"
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
                  className="w-4 h-4 text-[#B8C5D1]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01"
                  />
                </svg>
              )}
            </div>
            <span className={`text-sm font-medium ${met ? "text-white" : "text-[#B8C5D1]"}`}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Journey() {
  const navigate = useNavigate();
  const { caseData, setWorkflowStep } = useCase();

  const visaJourney = caseData?.analysis?.visaJourney || [];
  const complianceNotes = caseData?.analysis?.complianceNotes || [];

  const handleProceed = () => {
    // Advance workflow: journey done → unlock Dashboard
    setWorkflowStep(WORKFLOW_STEPS.JOURNEY_DONE);
    navigate("/dashboard");
  };

  const caseId = caseData?.caseId || caseData?.id || "—";
  const status = caseData?.status || "In Progress";

  return (
    <main className="min-h-screen bg-[#061A28] text-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero */}
        <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_40px_120px_-40px_rgba(34,231,197,0.35)] backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#22E7C5] mb-2">Immigration Journey Tracker</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Immigration Journey Tracker</h1>
              <p className="mt-4 text-lg leading-7 text-[#B8C5D1] max-w-3xl">
                Track every milestone of your visa application journey from assessment to approval.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { label: "Case ID", value: caseId },
                { label: "Visa Type", value: caseData?.visaType || "—" },
                { label: "Destination", value: caseData?.country || "—" },
              ].map((card) => (
                <div key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#B8C5D1]">{card.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <VisaJourneyTimeline visaJourney={visaJourney} />
          </div>

          <ComplianceNotes notes={complianceNotes} />
          <RequirementsChecklist />
        </div>

        {/* Proceed To Dashboard */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleProceed}
            className="inline-flex items-center gap-2 rounded-3xl px-6 py-3 text-sm font-semibold bg-[#22E7C5] text-[#061A28] hover:bg-[#39F5D5] shadow-md transition"
          >
            Proceed To Dashboard
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}

export default Journey;