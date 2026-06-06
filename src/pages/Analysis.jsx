import { useLocation } from "react-router-dom";

import ApplicationOverview from "../components/output/ApplicationOverview";
import DocumentChecklist from "../components/output/DocumentChecklist";
import RiskPanel from "../components/output/RiskPanel";
import JourneySteps from "../components/output/JourneySteps";
import ReadinessScore from "../components/output/ReadinessScore";
import ComplianceNotes from "../components/output/ComplianceNotes";
import TimelineEstimate from "../components/output/TimelineEstimate";

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
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Visa Analysis Report
        </h1>

        <div className="bg-white p-6 rounded-lg shadow mb-8">

          <h2 className="text-2xl font-semibold mb-4">
            Case Information
          </h2>

          <p className="mb-2">
            <strong>Visa Type:</strong>{" "}
            {visaType || "Not Provided"}
          </p>

          <p className="mb-2">
            <strong>Country:</strong>{" "}
            {country || "Not Provided"}
          </p>

          <div className="mt-4">
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

        </div>

      </div>

    </div>
  );
}

export default Analysis;