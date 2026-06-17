// src/components/layout/Navbar.jsx

import { NavLink } from "react-router-dom";
import { useCase } from "../../context/CaseContext";

// All nav items are always accessible — no lock step requirements.
const NAV_ITEMS = [
  { to: "/analysis",  label: "Analysis"  },
  { to: "/documents", label: "Documents" },
  { to: "/journey",   label: "Journey"   },
  { to: "/dashboard", label: "Dashboard" },
];

function Navbar() {
  const { workflowStep } = useCase();
  // Progress bar: steps 1–5 map to 0–100%.
  const progressPercentage = Math.min(Math.round((workflowStep / 5) * 100), 100);

  return (
    <nav className="sticky top-0 z-50 bg-[#0A2E57] shadow-[0_2px_8px_rgba(10,46,87,0.25)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">

        {/* ── Brand ──────────────────────────────────────────────────────── */}
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4DC7F7] to-[#2AA6D8] shadow-[0_8px_24px_-8px_rgba(77,199,247,0.6)]">
            <span className="text-lg font-black tracking-[0.2em] text-[#0A2E57]">V</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-white">
              VISM
            </h1>
            <p className="text-xs uppercase tracking-[0.24em] text-white/50">
              Visa Immigration Services
            </p>
          </div>
        </NavLink>

        {/* ── Navigation items — always clickable, no locks ──────────────── */}
        <div className="flex flex-wrap items-center gap-1.5">

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "rounded-lg border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold text-white transition"
                  : "rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-white/15 mx-1" />

          {/* ── Processor Portal link ──────────────────────────────────── */}
          <a
            href="/processor"
            title="Immigration Processor Dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#4DC7F7]/30 px-4 py-2 text-sm font-medium text-[#4DC7F7] transition hover:bg-[#4DC7F7]/10 hover:border-[#4DC7F7]/50"
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

        {/* ── Progress bar ───────────────────────────────────────────────── */}
        <div className="hidden lg:flex w-full max-w-[18rem] flex-col gap-2 rounded-xl border border-white/15 bg-white/8 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.28em] text-white/50 font-medium">
              Progress
            </span>
            <span className="text-xs font-semibold text-[#4DC7F7]">
              {progressPercentage}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-[#4DC7F7] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;