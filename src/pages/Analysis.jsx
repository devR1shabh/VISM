
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCase } from "../context/CaseContext";

import Navbar from "../components/layout/Navbar";

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
    useState(
      () =>
        caseData?.analysis ||
        null
    );

  const [isLoading, setIsLoading] =
    useState(false);

  useEffect(() => {
    if (analysis) return;
    if (!caseData) return;

    async function runAnalysis() {
      setIsLoading(true);

      const result =
        await generateVisaAnalysis(
          caseData.visaType,
          caseData.country,
          caseData.description
        );

      const agentResults =
        await OrchestratorAgent(
          result
        );

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

        tasks:
          agentResults.tasks,
      };

      setAnalysis(
        finalAnalysis
      );

      setCaseData(
        (prev) => ({
          ...prev,
          analysis:
            finalAnalysis,
        })
      );

      setIsLoading(false);
    }

    runAnalysis();
  }, [
    caseData?.visaType,
    caseData?.country,
    caseData?.description,
  ]);

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-100">

        <Navbar />

        <div className="flex items-center justify-center mt-20">

          <div className="text-center">

            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              No Active Case Found
            </h2>

            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create New Case
            </Link>

          </div>

        </div>

      </div>
    );
  }

  if (
    isLoading ||
    !analysis
  ) {
    return (
      <div className="min-h-screen bg-gray-100">

        <Navbar />

        <div className="flex items-center justify-center mt-20">

          <div className="text-center">

            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

            <h2 className="text-2xl font-semibold text-gray-700">
              Analyzing Visa Case...
            </h2>

            <p className="text-gray-500 mt-2">
              Running multi-agent analysis
            </p>

          </div>

        </div>

      </div>
    );
  }

  const caseId =
    caseData.caseId ||
    caseData.id;

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Visa Analysis Report
        </h1>

        <div className="flex flex-wrap gap-4 mb-8">

          <Link
            to="/documents"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Document Repository
          </Link>

          <Link
            to="/tasks"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
          >
            Task Center
          </Link>

          <Link
            to="/dashboard"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
          >
            Dashboard
          </Link>

        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">

          <h2 className="text-2xl font-semibold mb-4">
            Case Information
          </h2>

          <p className="mb-3">
            <strong>Case ID:</strong>{" "}
            {caseId}
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

            <strong>
              Case Description:
            </strong>

            <p className="mt-2 text-gray-700">
              {
                caseData.description
              }
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <ApplicationOverview
            overview={
              analysis.overview
            }
          />

          <DocumentUploadPanel
            documents={
              analysis.documents
            }
          />

          <RiskPanel
            risks={
              analysis.risks
            }
          />

          <JourneySteps
            journey={
              analysis.journey
            }
          />

          <ReadinessScore />

          <AssessmentPanel
            assessment={
              analysis.assessment
            }
          />

          <NotificationPanel
            notification={
              analysis.notification
            }
          />

          <ComplianceNotes
            notes={
              analysis.complianceNotes
            }
          />

          <TimelineEstimate
            timeline={
              analysis.timeline
            }
          />

          <FollowUpActions
            actions={
              analysis.followUpActions
            }
          />

          <VisaJourneyDiagram />

        </div>

      </div>

    </div>
  );
}

export default Analysis;

