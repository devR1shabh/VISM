// src/components/processor/CasesTable.jsx

import { useState, useMemo }  from "react";
import { useNavigate }        from "react-router-dom";
import { formatDate }         from "../../utils/dateUtils.js";

const FILTER_TABS = ["All", "Pending", "Approved", "Rejected", "Need Documents"];

function StatusBadge({ status }) {
  const map = {
    Pending:          "bg-[var(--c-warning-bg)] text-[var(--c-warning)] border-[var(--c-warning-border)]",
    Approved:         "bg-[var(--c-green-bg)] text-[var(--c-green)] border-[var(--c-green-light)]",
    Rejected:         "bg-[var(--c-error-bg)] text-[var(--c-error)] border-[var(--c-error-border)]",
    "Need Documents": "bg-[var(--c-info-bg)] text-[var(--c-info)] border-[var(--c-info-border)]",
  };
  const cls = map[status] || "bg-[var(--c-bg)] text-[var(--c-text-muted)] border-[var(--c-border)]";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] ${cls}`}>
      {status || "Pending"}
    </span>
  );
}

function getApplicantName(c) {
  return c.passportData?.name || c.applicantName || "—";
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
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-[var(--c-border)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--c-text)]">Cases</h2>
            <p className="text-xs text-[var(--c-text-muted)] mt-0.5">
              {filtered.length} of {cases.length} total
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--c-text-muted)]"
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
              className="w-full bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-text)] text-sm pl-9 pr-4 py-2.5 rounded-[var(--r-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-[var(--c-green)] placeholder-[var(--c-text-muted)] transition"
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
                  ? "bg-[var(--c-green)] text-white border-[var(--c-green)]"
                  : "bg-[var(--c-bg)] text-[var(--c-text-muted)] border-[var(--c-border)] hover:border-[var(--c-green)] hover:text-[var(--c-green)]"
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
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium text-[var(--c-text-mid)]">No cases found</p>
            <p className="text-sm mt-1 text-[var(--c-text-muted)]">
              {search ? "Try a different search term." : "No cases match this filter."}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--c-border)] bg-[var(--c-green)]">
                {["Case ID", "Applicant Name", "Visa Type", "Destination", "Status", "Created"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/80"
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
                  className={`border-b border-[var(--c-border)] cursor-pointer transition hover:bg-[var(--c-bg)] ${
                    i % 2 === 0 ? "" : "bg-[var(--c-bg)]/40"
                  }`}
                >
                  <td className="px-6 py-4 font-mono text-xs text-[var(--c-green)] font-semibold whitespace-nowrap">
                    {c.caseId || "—"}
                  </td>
                  <td className="px-6 py-4 text-[var(--c-text)] font-medium whitespace-nowrap">
                    {getApplicantName(c)}
                  </td>
                  <td className="px-6 py-4 text-[var(--c-text-muted)] whitespace-nowrap">
                    {c.visaType || "—"}
                  </td>
                  <td className="px-6 py-4 text-[var(--c-text-muted)] whitespace-nowrap">
                    {c.country || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={c.processorStatus || "Pending"} />
                  </td>
                  <td className="px-6 py-4 text-[var(--c-text-muted)] whitespace-nowrap">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[var(--c-green)] text-xs font-semibold hover:underline underline-offset-2">
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