import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import ApplicationOverview from "../components/output/ApplicationOverview";
import DocumentCollectionTracker from "../components/output/DocumentCollectionTracker";
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
  const location = useLocation();

  const {
    visaType,
    country,
    description,
  } = location.state || {};

  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    async function runAnalysis() {
      const result = await generateVisaAnalysis(
        visaType,
        country,
        description
      );

      const agentResults =
        await OrchestratorAgent(result);

      setAnalysis({
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
      });
    }

    runAnalysis();
  }, [visaType, country, description]);

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

        <h1 className="text-4xl font-bold mb-8">
          Visa Analysis Report
        </h1>

        <div className="bg-white p-6 rounded-lg shadow mb-8">

          <h2 className="text-2xl font-semibold mb-4">
            Case Information
          </h2>

          <p className="mb-3">
            <strong>Visa Type:</strong>{" "}
            {visaType || "Not Provided"}
          </p>

          <p className="mb-3">
            <strong>Destination Country:</strong>{" "}
            {country || "Not Provided"}
          </p>

          <div>
            <strong>Case Description:</strong>

            <p className="mt-2 text-gray-700">
              {description || "No description provided."}
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <ApplicationOverview
            overview={analysis.overview}
          />

          <DocumentCollectionTracker
            documents={analysis.documents}
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