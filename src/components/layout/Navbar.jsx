// src/components/layout/Navbar.jsx

import { NavLink } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../../context/CaseContext";

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

function LockIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
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

  const progressPercentage = Math.min(Math.round((workflowStep / 4) * 100), 100);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#143045]/70 bg-[#061A28]/95 backdrop-blur-3xl shadow-[0_22px_60px_-35px_rgba(0,0,0,0.8)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">

        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22E7C5] to-[#1AC9D6] shadow-[0_18px_40px_-28px_rgba(34,231,197,0.85)]">
            <span className="text-lg font-black tracking-[0.2em] text-slate-950">V</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">VISM</h1>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Visa Immigration Services</p>
          </div>
        </NavLink>

        {/* Navigation items */}
        <div className="flex flex-wrap items-center gap-2">

          {NAV_ITEMS.map((item) => {
            const isUnlocked = workflowStep >= item.requiredStep;

            if (!isUnlocked) {
              return (
                <span
                  key={item.to}
                  title={LOCK_TITLES[item.to]}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-400 opacity-80 cursor-not-allowed transition"
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
                    ? "rounded-2xl border border-[#22E7C5]/60 bg-[#0F3D54] px-4 py-2 text-sm font-semibold text-[#DDF9F0] shadow-[0_0_0_1px_rgba(34,231,197,0.25)] transition"
                    : "rounded-2xl border border-transparent px-4 py-2 text-sm font-medium text-slate-200 transition duration-200 ease-out hover:border-[#22E7C5]/30 hover:bg-white/10 hover:text-white"
                }
              >
                {item.label}
              </NavLink>
            );
          })}

          {/* Divider */}
          <div className="w-px h-5 bg-white/15 mx-1" />

          {/* Processor Portal link */}
          <a
            href="/processor"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-[#22E7C5]/20 bg-[#22E7C5]/8 px-4 py-2 text-sm font-medium text-[#22E7C5] transition hover:bg-[#22E7C5]/15 hover:border-[#22E7C5]/40"
            title="Immigration Processor Dashboard"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Processor
          </a>

        </div>

        {/* Progress bar */}
        <div className="hidden lg:flex w-full max-w-[18rem] flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Progress</span>
            <span className="text-xs font-semibold text-[#22E7C5]">{progressPercentage}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-900/80">
            <div
              className="h-full bg-gradient-to-r from-[#22E7C5] via-[#22d5c7] to-[#0ec8c3] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;