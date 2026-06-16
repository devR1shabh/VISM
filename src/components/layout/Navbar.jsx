// src/components/layout/Navbar.jsx

import { NavLink } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../../context/CaseContext";

// ── Workflow nav items — data completely unchanged ─────────────────────────
const NAV_ITEMS = [
  { to: "/analysis",  label: "Analysis",  requiredStep: WORKFLOW_STEPS.CASE_CREATED   },
  { to: "/documents", label: "Documents", requiredStep: WORKFLOW_STEPS.ANALYSIS_DONE  },
  { to: "/journey",   label: "Journey",   requiredStep: WORKFLOW_STEPS.DOCUMENTS_DONE },
  { to: "/dashboard", label: "Dashboard", requiredStep: WORKFLOW_STEPS.JOURNEY_DONE   },
];

const LOCK_TITLES = {
  "/analysis":  "Create a case to unlock Analysis",
  "/documents": "Complete Analysis to unlock Documents",
  "/journey":   "Upload and verify documents to unlock Journey",
  "/dashboard": "Complete Journey to unlock Dashboard",
};

// ── LockIcon — SVG path unchanged ─────────────────────────────────────────
function LockIcon() {
  return (
    <svg
      className="w-3 h-3 text-[#9CA3AF]"
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
  // ── Logic completely unchanged ────────────────────────────────────────────
  const { workflowStep } = useCase();
  const progressPercentage = Math.min(Math.round((workflowStep / 4) * 100), 100);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[var(--c-border)] shadow-[var(--shadow-nav)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-0 h-16">

        {/* ── Brand — text-only wordmark, no icon box ────────────────────── */}
        <NavLink
          to="/"
          className="flex items-center gap-3 shrink-0"
        >
          <span className="font-display text-[22px] font-bold text-[var(--c-green)] leading-none tracking-[-0.01em]">
            VISM
          </span>
        </NavLink>

        {/* ── Nav links + CTA ───────────────────────────────────────────── */}
        <div className="flex items-center gap-1">

          {NAV_ITEMS.map((item) => {
            const isUnlocked = workflowStep >= item.requiredStep;

            if (!isUnlocked) {
              return (
                <span
                  key={item.to}
                  title={LOCK_TITLES[item.to]}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-[#D1D5DB] cursor-not-allowed select-none"
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
                    ? "px-4 py-2 text-sm font-semibold text-[var(--c-text)] rounded-md bg-[var(--c-bg)] transition"
                    : "px-4 py-2 text-sm font-normal text-[var(--c-text-muted)] rounded-md transition hover:text-[var(--c-text)]"
                }
              >
                {item.label}
              </NavLink>
            );
          })}

          {/* Divider */}
          <div className="w-px h-4 bg-[var(--c-border)] mx-2" />

          {/* Processor link — subtle text link, same visual weight as nav items */}
          <a
            href="/processor"
            title="Immigration Processor Dashboard"
            className="px-4 py-2 text-sm font-normal text-[var(--c-text-muted)] rounded-md transition hover:text-[var(--c-text)]"
          >
            Processor
          </a>

          {/* Divider */}
          <div className="w-px h-4 bg-[var(--c-border)] mx-2" />

          {/* Start Assessment CTA — the only green element in the navbar */}
          <a
            href="#assessment"
            className="inline-flex items-center gap-2 bg-[var(--c-green)] text-white text-sm font-semibold px-5 py-2.5 rounded-[var(--r-lg)] transition hover:bg-[var(--c-green-mid)] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:ring-offset-2"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Start Assessment
          </a>

        </div>

      </div>

      {/* ── Progress indicator — thin green strip under the nav ───────────────
          Shown only after a case is created (workflowStep > 0).
          The progressPercentage calculation and style={{ width }} are
          completely unchanged from before — only presentation updated.
          A 3px strip is subtler and more editorial than the old pill widget.
      ──────────────────────────────────────────────────────────────────────── */}
      {workflowStep > 0 && (
        <div className="h-[3px] bg-[var(--c-border)] w-full">
          <div
            className="h-full bg-[var(--c-green)] transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

    </nav>
  );
}

export default Navbar;