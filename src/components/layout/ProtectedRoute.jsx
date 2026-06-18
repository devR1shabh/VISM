// src/components/layout/ProtectedRoute.jsx

import { Navigate, useLocation } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../../context/CaseContext";

// Only /application-ready still requires full workflow completion.
// Analysis, Documents, Journey, and Dashboard are always accessible —
// each page renders its own empty state when no case exists.
const ROUTE_STEP_REQUIREMENTS = {
  "/application-ready": WORKFLOW_STEPS.ALL_DONE,
};

const ROUTE_MESSAGES = {
  "/application-ready": "Please complete all required steps before downloading your application.",
};

function ProtectedRoute({ children }) {
  const { workflowStep } = useCase();
  const location = useLocation();

  const required = ROUTE_STEP_REQUIREMENTS[location.pathname];

  // No requirement defined for this route — render it freely
  if (required === undefined) {
    return children;
  }

  if (workflowStep < required) {
    const message = ROUTE_MESSAGES[location.pathname] ?? "Please complete the required steps.";
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{ from: location.pathname, message }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;