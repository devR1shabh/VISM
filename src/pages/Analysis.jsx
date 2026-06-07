import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCase } from "../context/CaseContext";

import ApplicationOverview from "../components/output/ApplicationOverview";
import DocumentUploadPanel from "../components/output/DocumentUploadPanel";
import RiskPanel from "../components/output/RiskPanel";
import JourneySteps from "../components/output/JourneySteps";
import ReadinessScore from "../components/output/ReadinessScore";
import ComplianceNotes from "../components/output/ComplianceNotes";
import TimelineEstimate from "../components/output/TimelineEstimate";
import FollowUpActions from "../components/output/FollowUpActions";
import AssessmentPanel from "../components/output/AssessmentPanel";
import NotificationPanel from "../components/output/NotificationPanel";

import VisaJourneyDiagram from "../components/diagram/VisaJourneyDiagram";

import { generateVisaAnalysis } from "../engines/aiEngine";
import { OrchestratorAgent } from "../agents/OrchestratorAgent";

function Analysis() {
  const {
    caseData,
    setCaseData,
  } = useCase();

  const [analysis, setAnalysis] =
    useState(null);

  useEffect(() => {
    async function runAnalysis() {
      if (!caseData) return;

      const result =
        await generateVisaAnalysis(
          caseData.visaType,
          caseData.country,
          caseData.description
        );

      const agentResults =
        await OrchestratorAgent(result);

      const finalAnalysis = {
        ...result,

        journey:
          agentResults.workflow,

        documents:
          agentResults.documents,

        risks:
          agentResults.risks,

        complianceNotes:
          agentResults.compliance,

        score:
          agentResults.readiness,

        timeline:
          agentResults.timeline,

        assessment:
          agentResults.assessment,

        notification:
          agentResults.notification,
      };

      setAnalysis(finalAnalysis);

      setCaseData((prev) => ({
        ...prev,
        analysis: finalAnalysis,
      }));
    }

    runAnalysis();
  }, [
    caseData?.visaType,
    caseData?.country,
    caseData?.description,
    setCaseData,
  ]);

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-semibold">
          No Active Case Found
        </h2>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-semibold">
          Analyzing Visa Case...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-6">
          Visa Analysis Report
        </h1>

        <div className="flex gap-4 mb-8">

          <Link
            to="/documents"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Documents
          </Link>

          <Link
            to="/tasks"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Tasks
          </Link>

        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">

          <h2 className="text-2xl font-semibold mb-4">
            Case Information
          </h2>

          <p className="mb-3">
            <strong>Case ID:</strong>{" "}
            {caseData.caseId}
          </p>

          <p className="mb-3">
            <strong>Visa Type:</strong>{" "}
            {caseData.visaType}
          </p>

          <p className="mb-3">
            <strong>Destination Country:</strong>{" "}
            {caseData.country}
          </p>

          <div>
            <strong>Case Description:</strong>

            <p className="mt-2 text-gray-700">
              {caseData.description}
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <ApplicationOverview
            overview={analysis.overview}
          />

          <DocumentUploadPanel
            documents={analysis.documents}
          />

          <RiskPanel
            risks={analysis.risks}
          />

          <JourneySteps
            journey={analysis.journey}
          />

          <ReadinessScore
            score={analysis.score}
          />

          <AssessmentPanel
            assessment={analysis.assessment}
          />

          <NotificationPanel
            notification={analysis.notification}
          />

          <ComplianceNotes
            notes={analysis.complianceNotes}
          />

          <TimelineEstimate
            timeline={analysis.timeline}
          />

          <FollowUpActions
            actions={analysis.followUpActions}
          />

          <VisaJourneyDiagram />

        </div>

      </div>
    </div>
  );
}

export default Analysis;