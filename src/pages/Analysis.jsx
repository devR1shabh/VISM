// src/pages/Analysis.jsx
// Phase 2: Added ExportPDFButton alongside existing Proceed button. Logic unchanged.

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Briefcase,
  Plane,
  Globe,
  Sparkles,
  FileText,
  ArrowRight,
} from "lucide-react";

import { useCase, WORKFLOW_STEPS } from "../context/CaseContext";
import AIApplicationOverview from "../components/output/AIApplicationOverview";
import AIRiskPanel           from "../components/output/AIRiskPanel";
import AIRecommendations     from "../components/output/AIRecommendations";
import CaseSummary           from "../components/output/CaseSummary";
import ExportPDFButton       from "../components/output/ExportPDFButton";
import { PageHeader }        from "../components/ui";

import { generateAnalysis, updateCase } from "../services/api";

const visaIconMap = {
  "Student Visa": GraduationCap,
  "Work Visa":    Briefcase,
  "Tourist Visa": Plane,
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

  if (isLoading || !analysis) {
    return (
      <div className="min-h-screen bg-[var(--c-bg)]">
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
    <main className="min-h-screen bg-[var(--c-bg)]">

      <PageHeader
        eyebrow="BlueprintAI Assessment Report"
        title="AI Analysis & Eligibility Report"
        description="Review your case status, eligibility view, and key recommendations so you can move forward with confidence."
      />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-6">

        {redirectMessage && (
          <div className="rounded-lg border border-[var(--c-green-light)] bg-[var(--c-green-bg)] px-5 py-3 text-sm text-[var(--c-green)]">
            {redirectMessage}
          </div>
        )}

        {/* Case context stat cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Visa Type",   value: caseData.visaType, Icon: VisaIcon },
            { label: "Destination", value: caseData.country,  Icon: Globe    },
            { label: "Status",      value: status,            Icon: FileText },
            { label: "Case ID",     value: caseId,            Icon: Sparkles },
          ].map(({ label, value, Icon }) => (
            <div
              key={label}
              className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] p-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--c-green-bg)] text-[var(--c-green-mid)] mb-3">
                <Icon size={18} />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-muted)]">
                {label}
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--c-text)] leading-tight">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Case details */}
        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--c-text-muted)] mb-1">
            Case Information
          </p>
          <h2 className="text-xl font-bold text-[var(--c-text)] mb-5">
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
                className="rounded-lg bg-[var(--c-bg)] border border-[var(--c-border)] px-4 py-3"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-1">
                  {label}
                </p>
                <p className="text-base font-semibold text-[var(--c-text)]">{value}</p>
              </div>
            ))}
          </div>
          {caseData.description && (
            <div className="mt-4 rounded-lg bg-[var(--c-bg)] border border-[var(--c-border)] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-1">
                Case Description
              </p>
              <p className="text-sm text-[var(--c-text-mid)] leading-relaxed">
                {caseData.description}
              </p>
            </div>
          )}
        </div>

        {/* AI output components */}
        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
          <AIApplicationOverview aiOverview={analysis.aiOverview} />
        </div>

        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
          <AIRiskPanel aiRisks={analysis.aiRisks || []} />
        </div>

        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
          <CaseSummary documents={analysis.documents || []} />
        </div>

        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
          <AIRecommendations aiRecommendations={analysis.aiRecommendations || []} />
        </div>

        {/* Action bar — Export PDF + Proceed */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <ExportPDFButton />

          <button
            type="button"
            onClick={() => navigate("/documents")}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--c-green)] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--c-green-mid)] active:scale-[0.98]"
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