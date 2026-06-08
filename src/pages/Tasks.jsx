
import { Link } from "react-router-dom";

import { useCase } from "../context/CaseContext";

import Navbar from "../components/layout/Navbar";
import TaskManagementPanel from "../components/output/TaskManagementPanel";

function Tasks() {
  const { caseData } = useCase();

  const tasks =
    caseData?.analysis?.tasks || [];

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

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <div className="flex items-center justify-between mb-8">

          <h1 className="text-4xl font-bold text-gray-800">
            Task Center
          </h1>

          <Link
            to="/analysis"
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            ← Back to Analysis
          </Link>

        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4 text-sm">

          <span className="text-gray-500">
            Case:
            {" "}
            <strong className="text-gray-800">
              {caseData.caseId || caseData.id}
            </strong>
          </span>

          <span className="text-gray-300">
            |
          </span>

          <span className="text-gray-500">
            Visa:
            {" "}
            <strong className="text-gray-800">
              {caseData.visaType}
            </strong>
          </span>

          <span className="text-gray-300">
            |
          </span>

          <span className="text-gray-500">
            Tasks:
            {" "}
            <strong className="text-gray-800">
              {tasks.length}
            </strong>
          </span>

        </div>

        <TaskManagementPanel
          tasks={tasks}
        />

      </div>

    </div>
  );
}

export default Tasks;

