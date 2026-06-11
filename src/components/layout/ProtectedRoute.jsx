// src/components/layout/ProtectedRoute.jsx

import { Navigate, useLocation } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../../context/CaseContext";

// Maps each protected route to the minimum workflowStep required to access it.
const ROUTE_STEP_REQUIREMENTS = {
  "/analysis":         WORKFLOW_STEPS.CASE_CREATED,   // 1 — case must exist
  "/documents":        WORKFLOW_STEPS.ANALYSIS_DONE,  // 2 — analysis must be done
  "/journey":          WORKFLOW_STEPS.DOCUMENTS_DONE, // 3 — documents must be done
  "/dashboard":        WORKFLOW_STEPS.JOURNEY_DONE,   // 4 — journey must be done
  "/application-ready": WORKFLOW_STEPS.ALL_DONE,      // 5 — everything done
};

const ROUTE_MESSAGES = {
  "/analysis":          "Please create a case on the Home page before accessing Analysis.",
  "/documents":         "Please complete the AI Analysis before accessing Document Upload.",
  "/journey":           "Please upload and verify your documents before accessing the Journey.",
  "/dashboard":         "Please complete the Journey step before accessing the Dashboard.",
  "/application-ready": "Please complete all required steps before downloading your application.",
};

function ProtectedRoute({ children }) {
  const { workflowStep } = useCase();
  const location = useLocation();

  const required = ROUTE_STEP_REQUIREMENTS[location.pathname] ?? WORKFLOW_STEPS.CASE_CREATED;
  const message  = ROUTE_MESSAGES[location.pathname] ?? "Please complete the required steps to access this section.";

  if (workflowStep < required) {
    // Decide where to redirect:
    // If no case exists at all → Home
    // If case exists but step is insufficient → the last valid page
    let redirectTo = "/";
    if (workflowStep >= WORKFLOW_STEPS.JOURNEY_DONE && required === WORKFLOW_STEPS.ALL_DONE) {
      redirectTo = "/dashboard";
    } else if (workflowStep >= WORKFLOW_STEPS.DOCUMENTS_DONE && required > WORKFLOW_STEPS.DOCUMENTS_DONE) {
      redirectTo = "/journey";
    } else if (workflowStep >= WORKFLOW_STEPS.ANALYSIS_DONE && required > WORKFLOW_STEPS.ANALYSIS_DONE) {
      redirectTo = "/documents";
    } else if (workflowStep >= WORKFLOW_STEPS.CASE_CREATED && required > WORKFLOW_STEPS.CASE_CREATED) {
      redirectTo = "/analysis";
    }

    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          from: location.pathname,
          message,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;