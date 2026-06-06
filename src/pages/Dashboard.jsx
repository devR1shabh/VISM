import { useState } from "react";

import Header from "../components/layout/Header";
import CaseForm from "../components/input/CaseForm";

import ApplicationOverview from "../components/output/ApplicationOverview";
import DocumentChecklist from "../components/output/DocumentChecklist";
import RiskPanel from "../components/output/RiskPanel";
import JourneySteps from "../components/output/JourneySteps";

function Dashboard() {
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Header />

      <div className="max-w-5xl mx-auto p-6">

        <CaseForm onAnalyze={handleAnalyze} />

        {showResults && (
          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <ApplicationOverview />

            <DocumentChecklist />

            <RiskPanel />

            <JourneySteps />

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;