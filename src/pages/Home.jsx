import CaseForm from "../components/input/CaseForm";
import { useCase } from "../context/CaseContext";
import { Link } from "react-router-dom";

import Navbar from "../components/layout/Navbar";

function Home() {
  const {
    caseData,
    clearCase,
  } = useCase();

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-4xl mx-auto p-8">

        <h1 className="text-5xl font-bold mb-4">
          VISM
        </h1>

        <p className="text-gray-600 mb-8">
          Visa Intelligence & Immigration
          Management Platform
        </p>

        {caseData && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">

            <h2 className="text-2xl font-bold mb-4">
              Current Application
            </h2>

            <p className="mb-2">
              <strong>Case ID:</strong>{" "}
              {caseData.caseId}
            </p>

            <p className="mb-2">
              <strong>Visa Type:</strong>{" "}
              {caseData.visaType}
            </p>

            <p className="mb-2">
              <strong>Country:</strong>{" "}
              {caseData.country}
            </p>

            <p className="mb-6">
              <strong>Description:</strong>{" "}
              {caseData.description}
            </p>

            <div className="flex gap-4">

              <Link
                to="/analysis"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Resume Application
              </Link>

              <button
                onClick={() => {
                  const confirmed =
                    window.confirm(
                      "Starting a new application will remove the current case. Continue?"
                    );

                  if (confirmed) {
                    clearCase();
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Start New Application
              </button>

            </div>

          </div>
        )}

        {!caseData && (
          <CaseForm />
        )}

      </div>

    </div>
  );
}

export default Home;