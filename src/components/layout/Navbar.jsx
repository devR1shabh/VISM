// src/components/layout/Navbar.jsx

import { NavLink } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../../context/CaseContext";

const NAV_ITEMS = [
  {
    to: "/analysis",
    label: "Analysis",
    requiredStep: WORKFLOW_STEPS.CASE_CREATED,
  },
  {
    to: "/documents",
    label: "Documents",
    requiredStep: WORKFLOW_STEPS.ANALYSIS_DONE,
  },
  {
    to: "/journey",
    label: "Journey",
    requiredStep: WORKFLOW_STEPS.DOCUMENTS_DONE,
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    requiredStep: WORKFLOW_STEPS.JOURNEY_DONE,
  },
];

const LOCK_TITLES = {
  "/analysis":
    "Create a case to unlock Analysis",
  "/documents":
    "Complete Analysis to unlock Documents",
  "/journey":
    "Upload and verify documents to unlock Journey",
  "/dashboard":
    "Complete Journey to unlock Dashboard",
};

function LockIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 ml-1.5"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Navbar() {
  const { workflowStep } = useCase();

  const progressPercentage = Math.min(
    Math.round((workflowStep / 4) * 100),
    100
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 shadow-lg shadow-cyan-500/20" />

          <div>
            <h1 className="text-lg font-bold text-white">
              VISM
            </h1>

            <p className="text-xs text-slate-400">
              Visa Immigration Services
            </p>
          </div>
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-2">

          {NAV_ITEMS.map((item) => {
            const isUnlocked =
              workflowStep >= item.requiredStep;

            if (!isUnlocked) {
              return (
                <span
                  key={item.to}
                  title={LOCK_TITLES[item.to]}
                  className="inline-flex items-center rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-slate-500 cursor-not-allowed"
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
                className={({ isActive }) =>
                  isActive
                    ? "rounded-xl bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-300 border border-cyan-500/20"
                    : "rounded-xl px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>

        {/* Progress */}
        <div className="hidden lg:block w-48">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400">
              Progress
            </span>

            <span className="text-xs font-semibold text-cyan-300">
              {progressPercentage}%
            </span>
          </div>

          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;