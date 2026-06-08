import { Link } from "react-router-dom";

import { useCase } from "../context/CaseContext";
import Navbar from "../components/layout/Navbar";
import ActivityFeed from "../components/output/ActivityFeed";

import {
  calculateReadiness,
  deriveDocumentSummary,
} from "../engines/readinessEngine";

function Dashboard() {
  const {
    caseData,
    uploadedDocuments,
    activityFeed,
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
      typeof task !== "object"
    ) {
      return false;
    }

    if (
      !task.title?.startsWith(
        "Upload "
      )
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
    tasks.length -
    completedTasks;

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Processor Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Real-time visa case monitoring
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-lg shadow">
            <p className="text-sm text-gray-500">
              Case ID
            </p>

            <p className="font-semibold">
              {caseData.caseId ||
                caseData.id}
            </p>
          </div>

        </div>

        {/* SUMMARY */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">

            <p className="text-sm text-gray-500">
              Readiness
            </p>

            <h2 className="text-3xl font-bold mt-2 text-blue-600">
              {readiness.score}%
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {readiness.label}
            </p>

          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">

            <p className="text-sm text-gray-500">
              Valid Documents
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {valid}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Ready
            </p>

          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">

            <p className="text-sm text-gray-500">
              Missing Documents
            </p>

            <h2 className="text-3xl font-bold mt-2 text-orange-600">
              {missing.length}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Required
            </p>

          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">

            <p className="text-sm text-gray-500">
              Activity Events
            </p>

            <h2 className="text-3xl font-bold mt-2 text-purple-600">
              {activityFeed.length}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Logged
            </p>

          </div>

        </div>

        {/* CASE + RISK */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-bold mb-4">
              Case Overview
            </h2>

            <div className="space-y-3">

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

              <p>
                <strong>Documents:</strong>{" "}
                {valid}/
                {requiredDocuments.length}
              </p>

            </div>

          </div>

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-bold mb-4">
              Workflow Progress
            </h2>

            <div className="space-y-3">

              <p>
                <strong>Completed Tasks:</strong>{" "}
                {completedTasks}
              </p>

              <p>
                <strong>Pending Tasks:</strong>{" "}
                {pendingTasks}
              </p>

              <p>
                <strong>Invalid Documents:</strong>{" "}
                {invalid}
              </p>

              <p>
                <strong>Activity Events:</strong>{" "}
                {activityFeed.length}
              </p>

            </div>

          </div>

        </div>

        {/* ACTIVITY FEED */}

        <div className="mb-8">
          <ActivityFeed />
        </div>

        {/* QUICK ACCESS */}

        <div className="grid md:grid-cols-3 gap-6">

          <Link
            to="/analysis"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold">
              Analysis Report
            </h2>

            <p className="mt-2 text-gray-600">
              View complete visa assessment.
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