import { useEffect, useState } from "react";

import { useCase } from "../context/CaseContext";

import AIApplicationOverview from "../components/output/AIApplicationOverview";
import AIRiskPanel from "../components/output/AIRiskPanel";
import AIRecommendations from "../components/output/AIRecommendations";
import VisaJourneyTimeline from "../components/output/VisaJourneyTimeline";

import DocumentUploadPanel from "../components/output/DocumentUploadPanel";
import CaseSummary from "../components/output/CaseSummary";
import ComplianceNotes from "../components/output/ComplianceNotes";

import VisaJourneyDiagram from "../components/diagram/VisaJourneyDiagram";

import { generateVisaPDF } from "../utils/pdfGenerator";
import { generateAnalysis } from "../services/api";

function Analysis() {
  const {
    caseData,
    setCaseData,
    uploadedDocuments,
  } = useCase();

  const [analysis, setAnalysis] = useState(
    () => caseData?.analysis || null
  );

  const [isLoading, setIsLoading] = useState(false);

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
      } catch (error) {
        console.error("Analysis failed:", error);
      } finally {
        setIsLoading(false);
      }
    }

    runAnalysis();
  }, [caseData, analysis, setCaseData]);

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
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Visa Case Analysis
      </h1>

      {/* Case Information */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-2xl font-semibold">Case Information</h2>
          <button
            type="button"
            onClick={() =>
              generateVisaPDF(caseData, analysis, uploadedDocuments)
            }
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium text-sm shrink-0"
          >
            Download PDF
          </button>
        </div>

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

      {/* Analysis Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* LLM-generated */}
        <AIApplicationOverview aiOverview={analysis.aiOverview} />

        <AIRiskPanel aiRisks={analysis.aiRisks || []} />

        <AIRecommendations aiRecommendations={analysis.aiRecommendations || []} />

        {/* Rule-based */}
        <DocumentUploadPanel documents={analysis.documents || []} />

        <CaseSummary documents={analysis.documents || []} />

        <ComplianceNotes notes={analysis.complianceNotes || []} />

        <VisaJourneyTimeline visaJourney={analysis.visaJourney || []} />

        <VisaJourneyDiagram />
      </div>
    </div>
  );
}

export default Analysis;