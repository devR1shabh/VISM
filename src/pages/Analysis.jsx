// src/pages/Analysis.jsx

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Briefcase,
  Plane,
  Globe,
  ShieldCheck,
  Sparkles,
  FileText,
  ArrowRight,
} from "lucide-react";

import { useCase, WORKFLOW_STEPS } from "../context/CaseContext";
import AIApplicationOverview from "../components/output/AIApplicationOverview";
import AIRiskPanel from "../components/output/AIRiskPanel";
import AIRecommendations from "../components/output/AIRecommendations";
import CaseSummary from "../components/output/CaseSummary";

import { generateAnalysis } from "../services/api";

const visaIconMap = {
  "Student Visa": GraduationCap,
  "Work Visa": Briefcase,
  "Tourist Visa": Plane,
};

function Analysis() {
  const navigate = useNavigate();
  const location = useLocation();

  const { caseData, setCaseData, setWorkflowStep } = useCase();

  const [analysis, setAnalysis] = useState(() => caseData?.analysis || null);
  const [isLoading, setIsLoading] = useState(false);

  // Show redirect message from ProtectedRoute if any
  const redirectMessage = location.state?.message;

  useEffect(() => {
    if (analysis) return;
    if (!caseData) return;

    async function runAnalysis() {
      try {
        setIsLoading(true);

        const result = await generateAnalysis(
          caseData.visaType,
          caseData.country,
          caseData.description
        );

        setAnalysis(result);

        setCaseData((prev) => ({
          ...prev,
          analysis: result,
        }));

        // Advance workflow: analysis is now complete → unlock Documents
        setWorkflowStep(WORKFLOW_STEPS.ANALYSIS_DONE);
      } catch (error) {
        console.error("Analysis failed:", error);
      } finally {
        setIsLoading(false);
      }
    }

    runAnalysis();
  }, [caseData, analysis, setCaseData, setWorkflowStep]);

  if (isLoading || !analysis) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#061A28] px-6 py-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#22E7C5] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <h2 className="text-3xl font-semibold text-white mb-3">
            Generating BlueprintAI Analysis...
          </h2>
          <p className="text-[#B8C5D1] max-w-xl mx-auto">
            AI is synthesizing your visa profile, risks, and recommended next steps.
          </p>
        </div>
      </div>
    );
  }

  const caseId = caseData?.caseId || caseData?.id || "—";
  const status = caseData?.status || "In Progress";
  const VisaIcon = visaIconMap[caseData?.visaType] || Globe;

  return (
    <main className="min-h-screen bg-[#061A28] text-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {redirectMessage && (
          <div className="rounded-3xl border border-[#22E7C5]/20 bg-[#083D4A]/80 p-4 text-sm text-[#B8C5D1] shadow-lg shadow-[#22E7C5]/10">
            {redirectMessage}
          </div>
        )}

        <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_40px_120px_-40px_rgba(34,231,197,0.35)] backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#22E7C5] mb-3">
                BlueprintAI Assessment Report
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                AI-powered visa eligibility and immigration intelligence analysis.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#B8C5D1]">
                Review your case status, eligibility view, and key recommendations from BlueprintAI so you can move forward with confidence.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Visa Type", value: caseData.visaType, icon: VisaIcon },
                { label: "Destination", value: caseData.country, icon: Globe },
                { label: "Status", value: status, icon: FileText },
                { label: "Case ID", value: caseId, icon: Sparkles },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22E7C5]/15 text-[#22E7C5] shadow-lg shadow-[#22E7C5]/10">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-[#B8C5D1]">{item.label}</p>
                      <p className="mt-2 font-semibold text-white">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_30px_90px_-30px_rgba(34,231,197,0.3)] backdrop-blur-xl">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#22E7C5] mb-2">Case Information</p>
              <h2 className="text-2xl font-bold text-white">Visa Case Details</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                <p className="text-sm uppercase tracking-[0.32em] text-[#B8C5D1] mb-2">Case ID</p>
                <p className="text-lg font-semibold text-white">{caseId}</p>
              </div>
              <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                <p className="text-sm uppercase tracking-[0.32em] text-[#B8C5D1] mb-2">Visa Type</p>
                <p className="text-lg font-semibold text-white">{caseData.visaType}</p>
              </div>
              <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                <p className="text-sm uppercase tracking-[0.32em] text-[#B8C5D1] mb-2">Destination Country</p>
                <p className="text-lg font-semibold text-white">{caseData.country}</p>
              </div>
              <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                <p className="text-sm uppercase tracking-[0.32em] text-[#B8C5D1] mb-2">Case Status</p>
                <p className="text-lg font-semibold text-white">{status}</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
              <p className="text-sm uppercase tracking-[0.32em] text-[#B8C5D1] mb-2">Case Description</p>
              <p className="text-[#B8C5D1] leading-relaxed">{caseData.description}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_30px_90px_-30px_rgba(34,231,197,0.3)] backdrop-blur-xl">
          <AIApplicationOverview aiOverview={analysis.aiOverview} />
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_30px_90px_-30px_rgba(34,231,197,0.3)] backdrop-blur-xl">
          <AIRiskPanel aiRisks={analysis.aiRisks || []} />
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_30px_90px_-30px_rgba(34,231,197,0.3)] backdrop-blur-xl">
          <CaseSummary documents={analysis.documents || []} />
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_30px_90px_-30px_rgba(34,231,197,0.3)] backdrop-blur-xl">
          <AIRecommendations aiRecommendations={analysis.aiRecommendations || []} />
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/documents")}
            className="inline-flex items-center gap-2 rounded-3xl bg-[#22E7C5] px-8 py-3 text-base font-semibold text-[#061A28] shadow-lg shadow-[#22E7C5]/20 transition hover:bg-[#39F5D5]"
          >
            Proceed To Documents
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </main>
  );
}

export default Analysis;
