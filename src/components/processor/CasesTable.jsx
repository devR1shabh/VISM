// src/components/processor/CasesTable.jsx

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const FILTER_TABS = ["All", "Pending", "Approved", "Rejected", "Need Documents"];

function StatusBadge({ status }) {
  const map = {
    Pending:          "border-amber-400/40 bg-amber-500/10 text-amber-300",
    Approved:         "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
    Rejected:         "border-red-400/40 bg-red-500/10 text-red-300",
    "Need Documents": "border-blue-400/40 bg-blue-500/10 text-blue-300",
  };
  const cls = map[status] || "border-white/10 bg-white/5 text-[#B8C5D1]";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {status || "Pending"}
    </span>
  );
}

function getApplicantName(c) {
  return c.passportData?.name || c.applicantName || "—";
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day:   "2-digit",
      month: "short",
      year:  "numeric",
    });
  } catch {
    return "—";
  }
}

function CasesTable({ cases = [] }) {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch]             = useState("");

  const filtered = useMemo(() => {
    let result = cases;

    if (activeFilter !== "All") {
      result = result.filter(
        (c) => (c.processorStatus || "Pending") === activeFilter
      );
    }

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (c) =>
          c.caseId?.toLowerCase().includes(q) ||
          getApplicantName(c).toLowerCase().includes(q)
      );
    }

    return result;
  }, [cases, activeFilter, search]);

  const counts = useMemo(() => {
    const out = { All: cases.length };
    ["Pending", "Approved", "Rejected", "Need Documents"].forEach((s) => {
      out[s] = cases.filter((c) => (c.processorStatus || "Pending") === s).length;
    });
    return out;
  }, [cases]);

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 backdrop-blur-xl overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Cases</h2>
            <p className="text-sm text-[#B8C5D1] mt-0.5">
              {filtered.length} of {cases.length} total
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8C5D1]"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Case ID or Name..."
              className="w-full bg-[#061A28] border border-white/10 text-white text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22E7C5] focus:border-[#22E7C5] placeholder-[#B8C5D1]/60 transition"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition border ${
                activeFilter === tab
                  ? "bg-[#22E7C5] text-[#061A28] border-[#22E7C5]"
                  : "bg-white/5 text-[#B8C5D1] border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab}
              <span className="ml-1.5 opacity-70">{counts[tab] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#B8C5D1]">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">No cases found</p>
            <p className="text-sm mt-1 text-[#B8C5D1]/70">
              {search ? "Try a different search term." : "No cases match this filter."}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Case ID", "Applicant Name", "Visa Type", "Destination", "Status", "Created"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B8C5D1]"
                  >
                    {h}
                  </th>
                ))}
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c._id || c.caseId}
                  onClick={() => navigate(`/processor/case/${c._id}`)}
                  className={`border-b border-white/5 cursor-pointer transition hover:bg-white/5 ${
                    i % 2 === 0 ? "" : "bg-white/[0.02]"
                  }`}
                >
                  <td className="px-6 py-4 font-mono text-xs text-[#22E7C5] font-semibold whitespace-nowrap">
                    {c.caseId || "—"}
                  </td>
                  <td className="px-6 py-4 text-white font-medium whitespace-nowrap">
                    {getApplicantName(c)}
                  </td>
                  <td className="px-6 py-4 text-[#B8C5D1] whitespace-nowrap">
                    {c.visaType || "—"}
                  </td>
                  <td className="px-6 py-4 text-[#B8C5D1] whitespace-nowrap">
                    {c.country || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={c.processorStatus || "Pending"} />
                  </td>
                  <td className="px-6 py-4 text-[#B8C5D1] whitespace-nowrap">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#22E7C5] text-xs font-semibold hover:underline">
                      Review →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CasesTable;