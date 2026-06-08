import { Link } from "react-router-dom";

import { useCase } from "../context/CaseContext";
import Navbar from "../components/layout/Navbar";

import {
  calculateReadiness,
  deriveDocumentSummary,
} from "../engines/readinessEngine";

function Dashboard() {
  const {
    caseData,
    uploadedDocuments,
  } = useCase();

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="flex items-center justify-center mt-20">
          <div className="text-center">

            <h2 className="text-2xl font-semibold mb-4">
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

  const requiredDocuments =
    caseData.analysis?.documents || [];

  const {
    valid,
    invalid,
    missing,
  } = deriveDocumentSummary(
    requiredDocuments,
    uploadedDocuments
  );

  const readiness =
    calculateReadiness(
      valid,
      requiredDocuments.length
    );

  const tasks =
    caseData.analysis?.tasks || [];

  const completedTasks =
    tasks.filter((task) => {
      if (
        !task.title.startsWith("Upload ")
      ) {
        return false;
      }

      const documentName =
        task.title.replace(
          "Upload ",
          ""
        );

      return uploadedDocuments.some(
        (doc) =>
          doc.valid &&
          doc.requiredDocument ===
            documentName
      );
    }).length;

  const pendingTasks =
    tasks.length - completedTasks;

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Processor Dashboard
        </h1>

        {/* Summary Cards */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">
              Readiness
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {readiness.score}%
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {readiness.label}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">
              Valid Documents
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {valid}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">
              Missing Documents
            </p>

            <h2 className="text-3xl font-bold text-orange-600 mt-2">
              {missing.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">
              Completed Tasks
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {completedTasks}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {pendingTasks} pending
            </p>
          </div>

        </div>

        {/* Case + Risk */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-bold mb-4">
              Case Overview
            </h2>

            <div className="space-y-3">

              <p>
                <strong>Case ID:</strong>{" "}
                {caseData.caseId || caseData.id}
              </p>

              <p>
                <strong>Visa Type:</strong>{" "}
                {caseData.visaType}
              </p>

              <p>
                <strong>Destination:</strong>{" "}
                {caseData.country}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {readiness.label}
              </p>

            </div>

          </div>

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-bold mb-4">
              Risk Overview
            </h2>

            {(caseData.analysis?.risks || [])
              .length === 0 ? (
              <p className="text-gray-500">
                No risks identified.
              </p>
            ) : (
              <div className="space-y-2">

                {(caseData.analysis?.risks || [])
                  .map(
                    (
                      risk,
                      index
                    ) => (
                      <div
                        key={index}
                        className="border-l-4 border-red-500 pl-3 py-1"
                      >
                        {risk}
                      </div>
                    )
                  )}

              </div>
            )}

          </div>

        </div>

        {/* Quick Access */}

        <div className="grid md:grid-cols-3 gap-6">

          <Link
            to="/analysis"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >

            <h2 className="text-xl font-bold">
              Analysis Report
            </h2>

            <p className="mt-2 text-gray-600">
              View full visa assessment.
            </p>

          </Link>

          <Link
            to="/documents"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >

            <h2 className="text-xl font-bold">
              Document Repository
            </h2>

            <p className="mt-2 text-gray-600">
              Review uploaded documents.
            </p>

          </Link>

          <Link
            to="/tasks"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >

            <h2 className="text-xl font-bold">
              Task Center
            </h2>

            <p className="mt-2 text-gray-600">
              Track workflow progress.
            </p>

          </Link>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;