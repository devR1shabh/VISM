import { useLocation } from "react-router-dom";

import ApplicationOverview from "../components/output/ApplicationOverview";
import DocumentChecklist from "../components/output/DocumentChecklist";
import RiskPanel from "../components/output/RiskPanel";
import JourneySteps from "../components/output/JourneySteps";
import ReadinessScore from "../components/output/ReadinessScore";
import ComplianceNotes from "../components/output/ComplianceNotes";
import TimelineEstimate from "../components/output/TimelineEstimate";

import VisaJourneyDiagram from "../components/diagram/VisaJourneyDiagram";

import { generateMockAnalysis } from "../services/mockAnalysis";

function Analysis() {
  const location = useLocation();

  const {
    visaType,
    country,
    description,
  } = location.state || {};

  const analysis = generateMockAnalysis(
    visaType,
    country,
    description
  );

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">
          Visa Analysis Report
        </h1>

        {/* Case Information */}
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

        {/* Analysis Results */}
        <div className="grid md:grid-cols-2 gap-6">

          <ApplicationOverview
            overview={analysis.overview}
          />

          <DocumentChecklist
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

          <ComplianceNotes
            notes={analysis.complianceNotes}
          />

          <TimelineEstimate
            timeline={analysis.timeline}
          />

          <VisaJourneyDiagram />

        </div>

      </div>

    </div>
  );
}

export default Analysis;