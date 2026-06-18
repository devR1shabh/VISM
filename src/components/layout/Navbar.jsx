// src/components/layout/Navbar.jsx

import { NavLink } from "react-router-dom";
import { useCase } from "../../context/CaseContext";

const NAV_ITEMS = [
  { to: "/analysis",  label: "Analysis"  },
  { to: "/documents", label: "Documents" },
  { to: "/journey",   label: "Journey"   },
  { to: "/dashboard", label: "Dashboard" },
];

function Navbar() {
  const { workflowStep } = useCase();
  const progressPercentage = Math.min(Math.round((workflowStep / 5) * 100), 100);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-[var(--shadow-nav)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">

        {/* ── Brand ──────────────────────────────────────────────────────── */}
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--c-green)]">
            <span className="text-base font-black tracking-[0.1em] text-white">V</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-[var(--c-green)]">
              VISM
            </h1>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)]">
              Visa Immigration Services
            </p>
          </div>
        </NavLink>

        {/* ── Navigation items ───────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-1">

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "rounded-[var(--r-md)] bg-[var(--c-green-bg)] px-4 py-2 text-sm font-semibold text-[var(--c-green)] transition"
                  : "rounded-[var(--r-md)] px-4 py-2 text-sm font-medium text-[var(--c-text-muted)] transition hover:bg-[var(--c-bg)] hover:text-[var(--c-text)]"
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="w-px h-4 bg-[var(--c-border)] mx-2" />

          {/* ── Processor Portal ─────────────────────────────────────────
          <a
            href="/processor"
            title="Immigration Processor Dashboard"
            className="inline-flex items-center gap-1.5 rounded-[var(--r-md)] border border-[var(--c-border)] px-4 py-2 text-sm font-medium text-[var(--c-text-muted)] transition hover:border-[var(--c-green)] hover:text-[var(--c-green)]"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Processor
          </a> */}

          {/* ── Start Assessment CTA ───────────────────────────────────── */}
          <a
            href="/#assessment"
            className="ml-2 inline-flex items-center gap-1.5 rounded-[var(--r-md)] bg-[var(--c-green)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--c-green-mid)]"
          >
            Start Assessment
          </a>

        </div>
{/* 
        ── Progress bar ─────────────────────────────────────────────────
        {progressPercentage > 0 && (
          <div className="hidden lg:flex w-full max-w-[16rem] flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--c-text-muted)] font-medium">
                Progress
              </span>
              <span className="text-[10px] font-semibold text-[var(--c-green)]">
                {progressPercentage}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--c-border)]">
              <div
                className="h-full bg-[var(--c-green)] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )} */}

      </div>
    </nav>
  );
}

export default Navbar;