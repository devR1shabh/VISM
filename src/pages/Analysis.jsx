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
  Building2,
  Users,
  TrendingUp,
  Home,
  ArrowRight,
} from "lucide-react";

import { useCase, WORKFLOW_STEPS } from "../context/CaseContext";
import AIApplicationOverview from "../components/output/AIApplicationOverview";
import AIRiskPanel           from "../components/output/AIRiskPanel";
import AIRecommendations     from "../components/output/AIRecommendations";
import CaseSummary           from "../components/output/CaseSummary";
import { PageHeader }        from "../components/ui";

import { generateAnalysis, updateCase } from "../services/api";

const visaIconMap = {
  "Student Visa":             GraduationCap,
  "Work Visa":                Briefcase,
  "Tourist Visa":             Plane,
  "Permanent Residency Visa": Home,
  "Business Visa":            Building2,
  "Family Sponsorship Visa":  Users,
  "Investor Visa":            TrendingUp,
};

function Analysis() {
  const navigate = useNavigate();
  const location = useLocation();

  const { caseData, setCaseData, setWorkflowStep } = useCase();

  const [analysis, setAnalysis]   = useState(() => caseData?.analysis || null);
  const [isLoading, setIsLoading] = useState(false);

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

        if (caseData._id) {
          updateCase(caseData._id, { analysis: result }).catch((err) =>
            console.error("Failed to persist analysis to server:", err)
          );
        }

        setWorkflowStep(WORKFLOW_STEPS.ANALYSIS_DONE);
      } catch (error) {
        console.error("Analysis failed:", error);
      } finally {
        setIsLoading(false);
      }
    }

    runAnalysis();
  }, [caseData, analysis, setCaseData, setWorkflowStep]);

  // ── Empty state — no case exists yet ─────────────────────────────────────
  if (!caseData) {
    return (
      <main className="min-h-screen bg-[#F7F8FA]">
        <PageHeader
          eyebrow="BlueprintAI Assessment Report"
          title="AI Analysis & Eligibility Report"
          description="Review your case status, eligibility view, and key recommendations."
        />
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 text-center">
          <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-12 max-w-md mx-auto">
            <Globe size={40} className="text-[#9CA3AF] mx-auto mb-4" />
            <h2 className="text-lg font-bold text-[#0A2E57] mb-2">No Case Yet</h2>
            <p className="text-sm text-[#6B7280] mb-6">
              Start by creating a case on the home page to generate your AI analysis.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0A2E57] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0F3D6E] transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Generating state ──────────────────────────────────────────────────────
  if (isLoading || !analysis) {
    return (
      <div className="min-h-screen bg-[#F7F8FA]">
        <PageHeader
          eyebrow="BlueprintAI Assessment Report"
          title="Generating Your Analysis..."
          description="AI is synthesizing your visa profile, risks, and recommended next steps."
        />
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 space-y-4">
          <div className="skeleton h-48 rounded-xl" />
          <div className="skeleton h-36 rounded-xl" />
          <div className="skeleton h-36 rounded-xl" />
        </div>
      </div>
    );
  }

  const caseId   = caseData?.caseId || caseData?.id || "—";
  const status   = caseData?.status || "In Progress";
  const VisaIcon = visaIconMap[caseData?.visaType] || Globe;

  return (
    <main className="min-h-screen bg-[#F7F8FA]">

      <PageHeader
        eyebrow="BlueprintAI Assessment Report"
        title="AI Analysis & Eligibility Report"
        description="Review your case status, eligibility view, and key recommendations so you can move forward with confidence."
      />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-6">

        {redirectMessage && (
          <div className="rounded-lg border border-[#4DC7F7]/30 bg-[#E8F4FD] px-5 py-3 text-sm text-[#2AA6D8]">
            {redirectMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Visa Type",   value: caseData.visaType, Icon: VisaIcon },
            { label: "Destination", value: caseData.country,  Icon: Globe    },
            { label: "Status",      value: status,            Icon: FileText },
            { label: "Case ID",     value: caseId,            Icon: Sparkles },
          ].map(({ label, value, Icon }) => (
            <div
              key={label}
              className="bg-white border border-[#E6E8EB] rounded-xl p-4 shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F4FD] text-[#2AA6D8] mb-3">
                <Icon size={18} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
                {label}
              </p>
              <p className="mt-1 text-sm font-bold text-[#0A2E57] leading-tight">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2AA6D8] mb-1">
            Case Information
          </p>
          <h2 className="text-xl font-bold text-[#0A2E57] mb-5">
            Visa Case Details
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Case ID",             value: caseId            },
              { label: "Visa Type",           value: caseData.visaType },
              { label: "Destination Country", value: caseData.country  },
              { label: "Case Status",         value: status            },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg bg-[#F7F8FA] border border-[#E6E8EB] px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280] mb-1">
                  {label}
                </p>
                <p className="text-base font-semibold text-[#111827]">{value}</p>
              </div>
            ))}
          </div>
          {caseData.description && (
            <div className="mt-4 rounded-lg bg-[#F7F8FA] border border-[#E6E8EB] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280] mb-1">
                Case Description
              </p>
              <p className="text-sm text-[#374151] leading-relaxed">
                {caseData.description}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-6">
          <AIApplicationOverview aiOverview={analysis.aiOverview} />
        </div>

        <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-6">
          <AIRiskPanel aiRisks={analysis.aiRisks || []} />
        </div>

        <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-6">
          <CaseSummary documents={analysis.documents || []} />
        </div>

        <div className="bg-white border border-[#E6E8EB] rounded-xl shadow-sm p-6">
          <AIRecommendations aiRecommendations={analysis.aiRecommendations || []} />
        </div>

        <div className="flex justify-end pb-4">
          <button
            type="button"
            onClick={() => navigate("/documents")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A2E57] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F3D6E] active:scale-[0.98]"
          >
            Proceed To Documents
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </main>
  );
}

export default Analysis;