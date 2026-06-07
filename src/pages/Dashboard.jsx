import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">
          VISM Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          <Link
            to="/analysis"
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-xl font-bold">
              Analysis Report
            </h2>

            <p className="mt-2 text-gray-600">
              View immigration assessment.
            </p>
          </Link>

          <Link
            to="/documents"
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-xl font-bold">
              Document Center
            </h2>

            <p className="mt-2 text-gray-600">
              Manage uploaded documents.
            </p>
          </Link>

          <Link
            to="/tasks"
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-xl font-bold">
              Task Center
            </h2>

            <p className="mt-2 text-gray-600">
              Manage follow-up tasks.
            </p>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;