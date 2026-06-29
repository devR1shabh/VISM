// src/components/output/CountryGuidelinesPanel.jsx
//
// Feature 7 — Collapsible panel showing visa-specific country guidelines.
// Used on the Analysis page (applicant) and ProcessorCaseDetail (processor).
//
// Props:
//   country   — destination country name from the case
//   visaType  — visa type string from the case
//   className — optional extra wrapper classes

import { useState, useEffect } from "react";
import {
  Globe, ChevronDown, ChevronUp,
  Clock, Banknote, BadgeCheck,
  CalendarDays, ExternalLink, Sparkles,
} from "lucide-react";

import { getCountryGuidelines } from "../../services/api.js";

// ── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, color = "green" }) {
  const colors = {
    green: "bg-[var(--c-green-bg)] text-[var(--c-green)]",
    blue:  "bg-[var(--c-info-bg)] text-[var(--c-info)]",
    amber: "bg-[var(--c-warning-bg)] text-[var(--c-warning)]",
  };
  return (
    <div className="flex items-start gap-3">
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 mt-0.5 ${colors[color]}`}>
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-[var(--c-text)] leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function GuidelinesSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="grid sm:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 rounded-[var(--r-lg)] bg-[var(--c-border)]" />
        ))}
      </div>
      <div className="h-20 rounded-[var(--r-lg)] bg-[var(--c-border)]" />
      <div className="h-16 rounded-[var(--r-lg)] bg-[var(--c-border)]" />
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
function CountryGuidelinesPanel({ country, visaType, className = "" }) {
  const [guidelines, setGuidelines] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [expanded,   setExpanded]   = useState(true);

  useEffect(() => {
    if (!country || !visaType) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    getCountryGuidelines(country, visaType)
      .then((data) => { if (!cancelled) setGuidelines(data); })
      .catch((err) => { if (!cancelled) setError(err.message || "Could not load guidelines."); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [country, visaType]);

  return (
    <div className={`bg-white border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-sm overflow-hidden ${className}`}>

      {/* ── Header — always visible ─────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-6 hover:bg-[var(--c-bg)] transition text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--r-lg)] bg-[var(--c-green-bg)]">
            <Globe size={18} className="text-[var(--c-green)]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--c-green-mid)]">
              Country Guidelines
            </p>
            <h3 className="text-base font-bold text-[var(--c-text)] leading-tight">
              {country} — {visaType}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!loading && guidelines?.source === "ai" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--c-green-bg)] border border-[var(--c-green-light)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--c-green)]">
              <Sparkles size={9} />
              AI Generated
            </span>
          )}
          {expanded
            ? <ChevronUp  size={16} className="text-[var(--c-text-muted)]" />
            : <ChevronDown size={16} className="text-[var(--c-text-muted)]" />
          }
        </div>
      </button>

      {/* ── Body — collapsible ──────────────────────────────────────────── */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-[var(--c-border)] pt-5">

          {/* Loading */}
          {loading && <GuidelinesSkeleton />}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-[var(--r-lg)] border border-[var(--c-error-border)] bg-[var(--c-error-bg)] px-4 py-3 text-sm text-[var(--c-error)]">
              {error}
            </div>
          )}

          {/* Content */}
          {!loading && !error && guidelines && (
            <div className="space-y-5">

              {/* Top 4 info rows — 2-col grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoRow
                  icon={Clock}
                  label="Processing Time"
                  value={guidelines.processingTime}
                  color="green"
                />
                <InfoRow
                  icon={Banknote}
                  label="Application Fee"
                  value={guidelines.applicationFee}
                  color="green"
                />
                <InfoRow
                  icon={BadgeCheck}
                  label="Financial Requirement"
                  value={guidelines.financialRequirement}
                  color="blue"
                />
                {guidelines.importantDates?.length > 0 && (
                  <InfoRow
                    icon={CalendarDays}
                    label="Key Deadline"
                    value={guidelines.importantDates[0]}
                    color="amber"
                  />
                )}
              </div>

              {/* Key requirements */}
              {guidelines.keyRequirements?.length > 0 && (
                <div className="rounded-[var(--r-xl)] border border-[var(--c-border)] bg-[var(--c-bg)] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-3">
                    Key Requirements
                  </p>
                  <ul className="space-y-2">
                    {guidelines.keyRequirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--c-green-bg)] shrink-0 mt-0.5">
                          <span className="text-[9px] font-bold text-[var(--c-green)]">{idx + 1}</span>
                        </span>
                        <span className="text-sm text-[var(--c-text-mid)] leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Important dates — rest beyond the first one */}
              {guidelines.importantDates?.length > 1 && (
                <div className="rounded-[var(--r-xl)] border border-[var(--c-warning-border)] bg-[var(--c-warning-bg)] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--c-warning)] mb-3">
                    Important Dates &amp; Deadlines
                  </p>
                  <ul className="space-y-1.5">
                    {guidelines.importantDates.slice(1).map((date, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CalendarDays size={13} className="text-[var(--c-warning)] shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--c-text-mid)] leading-relaxed">{date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes */}
              {guidelines.notes && (
                <div className="rounded-[var(--r-xl)] border border-[var(--c-info-border)] bg-[var(--c-info-bg)] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--c-info)] mb-2">
                    Additional Notes
                  </p>
                  <p className="text-sm text-[var(--c-text-mid)] leading-relaxed">{guidelines.notes}</p>
                </div>
              )}

              {/* Official link */}
              {guidelines.embassyWebsite && (
                <a
                  href={guidelines.embassyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--c-green)] hover:text-[var(--c-green-mid)] hover:underline underline-offset-2 transition"
                >
                  <ExternalLink size={13} />
                  Official visa information →
                </a>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CountryGuidelinesPanel;