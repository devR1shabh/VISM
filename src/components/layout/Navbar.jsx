// src/components/layout/Navbar.jsx

import { NavLink } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../../context/CaseContext";

// Each nav item requires a minimum workflowStep to be clickable.
const NAV_ITEMS = [
  { to: "/analysis",  label: "Analysis",  requiredStep: WORKFLOW_STEPS.CASE_CREATED   },
  { to: "/documents", label: "Documents", requiredStep: WORKFLOW_STEPS.ANALYSIS_DONE  },
  { to: "/journey",   label: "Journey",   requiredStep: WORKFLOW_STEPS.DOCUMENTS_DONE },
  { to: "/dashboard", label: "Dashboard", requiredStep: WORKFLOW_STEPS.JOURNEY_DONE   },
];

const LOCK_TITLES = {
  "/analysis":  "Create a case on the Home page to unlock Analysis",
  "/documents": "Complete Analysis to unlock Document Upload",
  "/journey":   "Upload and verify documents to unlock Journey",
  "/dashboard": "Complete the Journey step to unlock Dashboard",
};

function LockIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 ml-1.5 shrink-0 opacity-80"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function getNavItemClass(isActive, isDisabled) {
  if (isDisabled) {
    return "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed select-none";
  }
  if (isActive) {
    return "inline-flex items-center px-3 py-2 rounded-md text-sm font-semibold text-blue-700 bg-blue-50 border-b-2 border-blue-600";
  }
  return "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors";
}

function Navbar() {
  const { workflowStep } = useCase();

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-1 sm:gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "mr-4 sm:mr-6 text-lg font-bold text-blue-700 border-b-2 border-blue-600 pb-0.5"
              : "mr-4 sm:mr-6 text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors"
          }
        >
          BlueprintAI
        </NavLink>

        {NAV_ITEMS.map((item) => {
          const isUnlocked = workflowStep >= item.requiredStep;

          if (!isUnlocked) {
            return (
              <span
                key={item.to}
                className={getNavItemClass(false, true)}
                title={LOCK_TITLES[item.to]}
                aria-disabled="true"
              >
                {item.label}
                <LockIcon />
              </span>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => getNavItemClass(isActive, false)}
            >
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;