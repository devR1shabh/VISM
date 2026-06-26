// src/pages/ProcessorDashboard.jsx

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProcessorAuth } from "../context/ProcessorAuthContext";
import KPICards   from "../components/processor/KPICards";
import CasesTable from "../components/processor/CasesTable";

import { getAllCases } from "../services/api.js";

function ProcessorDashboard() {
  // ── Logic completely unchanged ─────────────────────────────────────────────
  const { auth, logout } = useProcessorAuth();
  const navigate = useNavigate();

  const [cases, setCases]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [lastFetch, setLastFetch] = useState(null);

  const loadCases = useCallback(async () => {
    try {
      const data = await getAllCases();
      setCases(data);
      setLastFetch(new Date());
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load cases. Check that the server is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCases(); }, [loadCases]);

  useEffect(() => {
    const interval = setInterval(loadCases, 30_000);
    return () => clearInterval(interval);
  }, [loadCases]);

  const handleLogout = () => {
    logout();
    navigate("/processor");
  };

  return (
    <main className="min-h-screen bg-[var(--c-bg)]">

      {/* ── Processor Navbar ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[var(--c-green)] shadow-[0_1px_0_rgba(255,255,255,0.1)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5 flex-wrap">

          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold text-white tracking-[-0.01em]">
              VISM
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/55 font-semibold">
              Processor Portal
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {lastFetch && (
              <span className="hidden sm:block text-xs text-white/60">
                Updated {lastFetch.toLocaleTimeString()}
              </span>
            )}
            <button
              type="button"
              onClick={loadCases}
              className="rounded-[var(--r-md)] border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition"
            >
              ↻ Refresh
            </button>
            <div className="flex items-center gap-2 rounded-[var(--r-md)] border border-white/20 bg-white/10 px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
              <span className="text-xs text-white font-medium">{auth?.username}</span>
            </div>
            <a
              href="/"
              className="text-xs text-white/65 hover:text-white transition font-medium"
            >
              Applicant Portal
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-[var(--r-md)] border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--c-error-bg)] hover:border-[var(--c-error-border)] hover:text-[var(--c-error)] transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="bg-[var(--c-green)] border-b border-white/15 px-6 pb-6 pt-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/60 font-semibold mb-1">
            Case Management
          </p>
          <h1 className="font-display text-3xl font-bold text-white">Processor Dashboard</h1>
          <p className="mt-1.5 text-sm text-white/65">
            Review, assess, and action incoming visa applications. Cases are sorted newest first.
          </p>
        </div>
      </div>

      {/* ── Page Body ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6 lg:px-8">

        {error && (
          <div className="rounded-[var(--r-lg)] border border-[var(--c-error-border)] bg-[var(--c-error-bg)] px-5 py-4 text-sm text-[var(--c-error)]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-10 h-10 border-[3px] border-[var(--c-green)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-[var(--c-text-muted)]">Loading cases...</p>
            </div>
          </div>
        ) : (
          <>
            <KPICards   cases={cases} />
            <CasesTable cases={cases} />
          </>
        )}

      </div>
    </main>
  );
}

export default ProcessorDashboard;