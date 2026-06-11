// src/pages/Analysis.jsx

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useCase, WORKFLOW_STEPS } from "../context/CaseContext";

import AIApplicationOverview from "../components/output/AIApplicationOverview";
import AIRiskPanel from "../components/output/AIRiskPanel";
import AIRecommendations from "../components/output/AIRecommendations";
import CaseSummary from "../components/output/CaseSummary";

import { generateAnalysis } from "../services/api";

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
      <div className="flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">
            Generating Visa Analysis...
          </h2>
          <p className="text-gray-500 mt-2">
            AI is preparing your case overview, risks, and recommendations
          </p>
        </div>
      </div>
    );
  }

  const caseId = caseData.caseId || caseData.id;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {redirectMessage && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          {redirectMessage}
        </div>
      )}

      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-1">
        Step 2 of 6
      </p>
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Visa Case Analysis
      </h1>

      {/* Case Information */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Case Information</h2>
        <p className="mb-3">
          <strong>Case ID:</strong> {caseId}
        </p>
        <p className="mb-3">
          <strong>Visa Type:</strong> {caseData.visaType}
        </p>
        <p className="mb-3">
          <strong>Destination Country:</strong> {caseData.country}
        </p>
        <div>
          <strong>Case Description:</strong>
          <p className="mt-2 text-gray-700">{caseData.description}</p>
        </div>
      </div>

      {/* AI Analysis Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <AIApplicationOverview aiOverview={analysis.aiOverview} />
        <AIRiskPanel aiRisks={analysis.aiRisks || []} />
        <AIRecommendations aiRecommendations={analysis.aiRecommendations || []} />
        <CaseSummary documents={analysis.documents || []} />
      </div>

      {/* Proceed To Documents */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/documents")}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold text-base shadow transition"
        >
          Proceed To Documents
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
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Analysis;