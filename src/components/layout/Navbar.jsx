import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow mb-6">
      <div className="max-w-7xl mx-auto px-6 py-4 flex gap-6">

        <Link
          to="/"
          className="font-semibold text-blue-600"
        >
          VISM
        </Link>

        <Link
          to="/analysis"
          className="text-gray-700 hover:text-blue-600"
        >
          Analysis
        </Link>

        <Link
          to="/documents"
          className="text-gray-700 hover:text-blue-600"
        >
          Documents
        </Link>

        <Link
          to="/tasks"
          className="text-gray-700 hover:text-blue-600"
        >
          Tasks
        </Link>

        <Link
          to="/dashboard"
          className="text-gray-700 hover:text-blue-600"
        >
          Dashboard
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;