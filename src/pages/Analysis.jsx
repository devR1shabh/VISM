import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCase } from "../context/CaseContext";

import Navbar from "../components/layout/Navbar";

import ApplicationOverview from "../components/output/ApplicationOverview";
import DocumentUploadPanel from "../components/output/DocumentUploadPanel";
import CaseSummary from "../components/output/CaseSummary";
import RiskPanel from "../components/output/RiskPanel";
import JourneySteps from "../components/output/JourneySteps";

import ComplianceNotes from "../components/output/ComplianceNotes";
import TimelineEstimate from "../components/output/TimelineEstimate";
import FollowUpActions from "../components/output/FollowUpActions";
import AssessmentPanel from "../components/output/AssessmentPanel";

import VisaJourneyDiagram from "../components/diagram/VisaJourneyDiagram";

import { generateAnalysis } from "../services/api";

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
  try {
    setIsLoading(true);

    const result =
      await generateAnalysis(
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
    console.error(
      "Analysis failed:",
      error
    );
  } finally {
    setIsLoading(false);
  }
}

runAnalysis();


}, [
caseData,
analysis,
setCaseData,
]);

if (!caseData) {
return ( <div className="min-h-screen bg-gray-100"> <Navbar />


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
return ( <div className="min-h-screen bg-gray-100"> <Navbar />


    <div className="flex items-center justify-center mt-20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

        <h2 className="text-2xl font-semibold text-gray-700">
          Generating Visa Analysis...
        </h2>

        <p className="text-gray-500 mt-2">
          Preparing application insights and document requirements
        </p>
      </div>
    </div>
  </div>
);


}

const caseId =
caseData.caseId ||
caseData.id;

return ( <div className="min-h-screen bg-gray-100"> <Navbar />


  <div className="max-w-7xl mx-auto p-6">

    <h1 className="text-4xl font-bold mb-6 text-gray-800">
      Visa Case Analysis
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
          {caseData.description}
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
          analysis.documents || []
        }
      />

      <CaseSummary
  documents={
    analysis.documents || []
  }
/>

      <RiskPanel
        risks={
          analysis.risks || []
        }
      />

      <JourneySteps
        journey={
          analysis.journey || []
        }
      />

      <VisaJourneyDiagram />

      <TimelineEstimate
        timeline={
          analysis.timeline || []
        }
      />

      <ComplianceNotes
        notes={
          analysis.complianceNotes || []
        }
      />

      <FollowUpActions
        actions={
          analysis.followUpActions || []
        }
      />

      <AssessmentPanel
        assessment={
          analysis.assessment
        }
      />

    </div>

  </div>
</div>


);
}

export default Analysis;
