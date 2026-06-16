// src/pages/ProcessorDashboard.jsx

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProcessorAuth } from "../context/ProcessorAuthContext";
import KPICards   from "../components/processor/KPICards";
import CasesTable from "../components/processor/CasesTable";

const API_URL = import.meta.env.VITE_API_URL;

async function fetchAllCases() {
  const res = await fetch(`${API_URL}/cases`);
  if (!res.ok) throw new Error("Failed to fetch cases");
  return res.json();
}

function ProcessorDashboard() {
  const { auth, logout } = useProcessorAuth();
  const navigate = useNavigate();

  const [cases, setCases]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [lastFetch, setLastFetch] = useState(null);

  const loadCases = useCallback(async () => {
    try {
      const data = await fetchAllCases();
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

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  useEffect(() => {
    const interval = setInterval(loadCases, 30_000);
    return () => clearInterval(interval);
  }, [loadCases]);

  const handleLogout = () => {
    logout();
    navigate("/processor");
  };

  return (
    <main className="min-h-screen bg-[#061A28] text-white">

      {/* Processor Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[#143045]/70 bg-[#061A28]/95 backdrop-blur-3xl shadow-[0_22px_60px_-35px_rgba(0,0,0,0.8)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 flex-wrap">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22E7C5] to-[#1AC9D6] shadow-[0_18px_40px_-28px_rgba(34,231,197,0.85)]">
              <span className="text-lg font-black tracking-[0.2em] text-slate-950">V</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">VISM</h1>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Processor Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {lastFetch && (
              <span className="hidden sm:block text-xs text-[#B8C5D1]">
                Updated {lastFetch.toLocaleTimeString()}
              </span>
            )}
            <button
              type="button"
              onClick={loadCases}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-[#B8C5D1] hover:bg-white/10 hover:text-white transition"
            >
              ↻ Refresh
            </button>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-[#22E7C5]" />
              <span className="text-sm text-[#B8C5D1]">{auth?.username}</span>
            </div>
            
            <a
              href="/"
              className="text-xs text-[#B8C5D1] hover:text-white transition"
            >
              Applicant Portal
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-[#B8C5D1] hover:bg-red-500/10 hover:border-red-400/30 hover:text-red-300 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Page Body */}
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">

        {/* Hero */}
        <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_40px_120px_-40px_rgba(34,231,197,0.25)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.32em] text-[#22E7C5] mb-2">Case Management</p>
          <h2 className="text-4xl font-bold tracking-tight text-white">Processor Dashboard</h2>
          <p className="mt-3 text-lg text-[#B8C5D1] max-w-2xl">
            Review, assess, and action incoming visa applications. Cases are sorted newest first.
          </p>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#22E7C5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#B8C5D1]">Loading cases...</p>
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