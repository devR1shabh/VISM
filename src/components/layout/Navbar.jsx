// src/components/layout/Navbar.jsx
//
// PHASE 3 CHANGE:
// Added authenticated user display: shows the logged-in applicant's name
// and a logout button when isAuthenticated is true.
// All existing nav items, brand, and styling are completely unchanged.

import { NavLink, useNavigate } from "react-router-dom";
import { useCase }              from "../../context/CaseContext.jsx";
import { useApplicantAuth }     from "../../context/ApplicantAuthContext.jsx";

// Phase 4: /my-cases added — visible only to authenticated users (guarded below)
const NAV_ITEMS = [
  { to: "/my-cases",  label: "My Cases",  authOnly: true  },
  { to: "/analysis",  label: "Analysis",  authOnly: false },
  { to: "/documents", label: "Documents", authOnly: false },
  { to: "/journey",   label: "Journey",   authOnly: false },
  { to: "/dashboard", label: "Dashboard", authOnly: false },
];

function Navbar() {
  const { workflowStep, clearCase } = useCase();
  const { user, isAuthenticated, logout } = useApplicantAuth();
  const navigate = useNavigate();

  const progressPercentage = Math.min(Math.round((workflowStep / 5) * 100), 100);

  const handleLogout = () => {
    logout();
    clearCase();         // wipe the active case from context and localStorage
    navigate("/login");
  };

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

          {NAV_ITEMS.filter((item) => !item.authOnly || isAuthenticated).map((item) => (
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

          {/* ── Auth section ───────────────────────────────────────────────
              Authenticated: show user's name chip + logout button
              Not authenticated: show Login + Register links
          ── */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* User name chip */}
              <div className="flex items-center gap-2 rounded-[var(--r-md)] bg-[var(--c-green-bg)] border border-[var(--c-green-light)] px-3 py-1.5">
                {/* Avatar circle */}
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--c-green)] flex-shrink-0">
                  <span className="text-[9px] font-bold text-white uppercase">
                    {user?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[var(--c-green)] max-w-[120px] truncate">
                  {user?.name || "Applicant"}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="rounded-[var(--r-md)] border border-[var(--c-border)] px-3 py-1.5 text-xs font-medium text-[var(--c-text-muted)] transition hover:border-[var(--c-error-border)] hover:bg-[var(--c-error-bg)] hover:text-[var(--c-error)]"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="rounded-[var(--r-md)] px-4 py-2 text-sm font-medium text-[var(--c-text-muted)] transition hover:bg-[var(--c-bg)] hover:text-[var(--c-text)]"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-[var(--r-md)] bg-[var(--c-green)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--c-green-mid)]"
              >
                Get Started
              </NavLink>
            </div>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;