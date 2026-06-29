// src/components/output/ConfidenceScoreGauge.jsx
//
// REDESIGNED in Feature 8 patch:
//   - Fixed SVG gauge (strokeLinecap="butt" removes endpoint blobs)
//   - Added zone tick marks (25, 50, 75 markers)
//   - Added per-component explanations with actionable advice
//   - Added "Priority Actions" section showing what improves the score most
//   - Added Link navigation to relevant pages

import { useState }              from "react";
import { Link }                  from "react-router-dom";
import { RefreshCw, ArrowRight } from "lucide-react";
import { generateConfidenceScore } from "../../services/api.js";

// ── Colour helpers ────────────────────────────────────────────────────────────
function scoreHex(s) {
  if (s >= 80) return "#22C55E";
  if (s >= 65) return "#84CC16";
  if (s >= 45) return "#F59E0B";
  if (s >= 25) return "#EF4444";
  return "#DC2626";
}
function scorePill(s) {
  if (s >= 80) return "bg-green-100  text-green-700";
  if (s >= 65) return "bg-lime-100   text-lime-700";
  if (s >= 45) return "bg-amber-100  text-amber-700";
  return "bg-red-100 text-red-700";
}

// ── SVG Gauge ─────────────────────────────────────────────────────────────────
// Semi-circle: left → top → right (sweep-flag = 0, CCW in SVG)
// strokeLinecap="butt" — flat ends, no blobs
function GaugeSVG({ score }) {
  const cx = 110, cy = 108;
  const r  = 82;
  const sw = 15;

  // Arc circumference for the semi-circle = π × r
  const C      = Math.PI * r;                      // ≈ 257.6
  const filled = Math.max(0, Math.min(score, 100)) / 100 * C;
  const color  = scoreHex(score);

  // Needle: score 0 = points left, score 100 = points right
  const needleAngle = (1 - score / 100) * Math.PI;
  const nLen = r - 16;
  const nx   = cx + nLen * Math.cos(needleAngle);
  const ny   = cy - nLen * Math.sin(needleAngle);

  // Zone tick mark positions (at 25, 50, 75%)
  const tickPcts = [25, 50, 75];
  const ticks = tickPcts.map((pct) => {
    const a = (1 - pct / 100) * Math.PI;
    return {
      x1: cx + (r - sw / 2 - 2) * Math.cos(a),
      y1: cy - (r - sw / 2 - 2) * Math.sin(a),
      x2: cx + (r + sw / 2 + 2) * Math.cos(a),
      y2: cy - (r + sw / 2 + 2) * Math.sin(a),
    };
  });

  // Zone end-cap labels (L / M / H at 0, 50, 100%)
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`;

  return (
    <svg viewBox="0 0 220 120" className="w-full max-w-[260px] mx-auto select-none">

      {/* ── Background track ──────────────────────────────────────────── */}
      <path
        d={arcPath}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={sw}
        strokeLinecap="butt"
      />

      {/* ── Filled score arc ──────────────────────────────────────────── */}
      {score > 0 && (
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="butt"
          strokeDasharray={`${filled} ${C}`}
          strokeDashoffset="0"
        />
      )}

      {/* ── Zone tick marks ───────────────────────────────────────────── */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke="white"
          strokeWidth={2}
        />
      ))}

      {/* ── Zone labels ───────────────────────────────────────────────── */}
      <text x={cx - r - 4} y={cy + 14} textAnchor="middle" fill="#EF4444" fontSize="9" fontWeight="700">LOW</text>
      <text x={cx}         y={cy - r - 6} textAnchor="middle" fill="#6B7280" fontSize="9" fontWeight="700">MED</text>
      <text x={cx + r + 4} y={cy + 14} textAnchor="middle" fill="#22C55E" fontSize="9" fontWeight="700">HIGH</text>

      {/* ── Needle ────────────────────────────────────────────────────── */}
      <line
        x1={cx} y1={cy}
        x2={nx} y2={ny}
        stroke="#1F2937"
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* ── Needle hub ────────────────────────────────────────────────── */}
      <circle cx={cx} cy={cy} r={6}  fill="#1F2937" />
      <circle cx={cx} cy={cy} r={3}  fill="white"   />

      {/* ── Score number ──────────────────────────────────────────────── */}
      <text
        x={cx} y={cy - 20}
        textAnchor="middle"
        fill="#111827"
        fontSize="34"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {score}
      </text>

      {/* ── Out of 100 ────────────────────────────────────────────────── */}
      <text
        x={cx} y={cy - 6}
        textAnchor="middle"
        fill="#9CA3AF"
        fontSize="10"
        fontFamily="system-ui"
      >
        out of 100
      </text>
    </svg>
  );
}

// ── Per-component insight logic ───────────────────────────────────────────────
function getInsights(breakdown) {
  const {
    documentScore      = null,
    questionnaireScore = null,
    passportScore      = null,
    countryRiskScore   = null,
  } = breakdown || {};

  return [
    {
      key:    "documentScore",
      label:  "Documents",
      value:  documentScore,
      weight: "40%",
      icon:   "📄",
      explanation:
        documentScore === null  ? "Not yet calculated." :
        documentScore === 0     ? "No documents have been verified yet." :
        documentScore < 33      ? "Very few documents verified. Mandatory documents (passport, bank statement, etc.) carry double weight." :
        documentScore < 60      ? "Some documents verified, but several mandatory ones are still missing." :
        documentScore < 80      ? "Good progress. Finish the remaining mandatory documents to push this higher." :
        documentScore < 95      ? "Almost complete. A few supporting documents left." :
                                  "All documents verified. This component is maxed out.",
      action:
        documentScore !== null && documentScore < 95
          ? { text: "Upload & verify documents", to: "/documents" }
          : null,
      canImprove: documentScore !== null && documentScore < 100,
    },
    {
      key:    "questionnaireScore",
      label:  "Questionnaire",
      value:  questionnaireScore,
      weight: "30%",
      icon:   "📝",
      explanation:
        questionnaireScore === null ? "Not yet calculated." :
        questionnaireScore === 0    ? "Questionnaire not submitted yet. This component contributes 30% of your total score." :
        questionnaireScore < 40     ? "Weak questionnaire profile. Vague financial details and travel history are reducing this score." :
        questionnaireScore < 60     ? "Reasonable answers, but financial capacity and travel history sections need more detail." :
        questionnaireScore < 75     ? "Good answers. Strengthening your financial capacity section can raise this score." :
        questionnaireScore < 90     ? "Strong questionnaire profile. Minor improvements possible." :
                                      "Excellent questionnaire responses.",
      action:
        questionnaireScore === 0
          ? { text: "Complete the questionnaire", to: "/questionnaire" }
          : questionnaireScore !== null && questionnaireScore < 60
          ? { text: "Review & update your questionnaire", to: "/questionnaire" }
          : null,
      canImprove: questionnaireScore !== null && questionnaireScore < 85,
    },
    {
      key:    "passportScore",
      label:  "Passport",
      value:  passportScore,
      weight: "20%",
      icon:   "🛂",
      explanation:
        passportScore === null ? "Not yet calculated." :
        passportScore === 0    ? "Passport not uploaded, or data could not be extracted. This is a critical gap." :
        passportScore < 30     ? "Your passport has expired or expires very soon. This is likely to cause a rejection." :
        passportScore < 60     ? "Passport expires within 6 months. Most countries require 6+ months validity." :
        passportScore < 80     ? "Passport expires within 12 months. Check if your destination requires longer validity." :
                                 "Passport is valid. This component is in good shape.",
      action:
        passportScore === 0
          ? { text: "Upload your passport", to: "/documents" }
          : passportScore !== null && passportScore < 60
          ? { text: "Check passport expiry requirements", to: "/documents" }
          : null,
      canImprove: passportScore !== null && passportScore < 80,
    },
    {
      key:    "countryRiskScore",
      label:  "Country & Visa",
      value:  countryRiskScore,
      weight: "10%",
      icon:   "🌍",
      explanation:
        countryRiskScore === null ? "Not yet calculated." :
        countryRiskScore < 30     ? "High-difficulty destination and visa type. This requires a very strong overall profile to compensate." :
        countryRiskScore < 55     ? "Moderately difficult destination. Focus on maximising your documents and questionnaire scores." :
        countryRiskScore < 75     ? "Average difficulty. A well-prepared application should succeed." :
                                    "Relatively straightforward destination for this visa type.",
      action:       null, // Country risk cannot be changed
      canImprove:   false,
      isFixed:      true,
    },
  ];
}

// ── Breakdown bar ─────────────────────────────────────────────────────────────
function BreakdownItem({ item, expanded, onToggle }) {
  const { label, value, weight, icon, explanation, action, isFixed } = item;
  const pct   = value ?? 0;
  const color = scoreHex(pct);

  return (
    <div className={`rounded-[var(--r-xl)] border transition-all ${
      value !== null && value < 40
        ? "border-[var(--c-error-border)] bg-[var(--c-error-bg)]"
        : "border-[var(--c-border)] bg-[var(--c-bg)]"
    }`}>

      {/* Row — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 py-3"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">{icon}</span>
            <span className="text-sm font-semibold text-[var(--c-text)]">{label}</span>
            <span className="text-[9px] text-[var(--c-text-muted)] uppercase tracking-[0.1em]">{weight}</span>
            {isFixed && (
              <span className="text-[9px] text-[var(--c-text-muted)] bg-[var(--c-border)] rounded-full px-1.5 py-0.5">
                fixed
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color }}>
              {value !== null ? value : "—"}
            </span>
            <span className="text-[var(--c-text-muted)] text-xs">
              {expanded ? "▲" : "▼"}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-[var(--c-border)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </button>

      {/* Expanded explanation */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-[var(--c-border)]">
          <p className="text-xs text-[var(--c-text-mid)] leading-relaxed mt-2">
            {explanation}
          </p>
          {action && (
            <Link
              to={action.to}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--c-green)] hover:text-[var(--c-green-mid)] hover:underline underline-offset-2 transition"
            >
              <ArrowRight size={11} />
              {action.text}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ── Priority actions ──────────────────────────────────────────────────────────
function PriorityActions({ breakdown, score }) {
  if (score >= 80) return null;

  const items = [];

  if ((breakdown?.passportScore ?? 0) < 40) {
    items.push({
      icon:   "🛂",
      text:   "Upload your passport",
      why:    "Passport score is 0 — worth up to +20 pts on overall score",
      to:     "/documents",
      impact: "high",
    });
  }

  if ((breakdown?.questionnaireScore ?? 0) === 0) {
    items.push({
      icon:   "📝",
      text:   "Complete the questionnaire",
      why:    "Not submitted — contributes 30% of your total score",
      to:     "/questionnaire",
      impact: "high",
    });
  }

  if ((breakdown?.documentScore ?? 0) < 50) {
    items.push({
      icon:   "📄",
      text:   "Verify more documents",
      why:    "Mandatory documents carry double weight in the score",
      to:     "/documents",
      impact: "high",
    });
  } else if ((breakdown?.documentScore ?? 0) < 80) {
    items.push({
      icon:   "📄",
      text:   "Complete remaining documents",
      why:    "Documents carry 40% weight — each new verification improves your score",
      to:     "/documents",
      impact: "medium",
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="rounded-[var(--r-xl)] border border-[var(--c-green-light)] bg-[var(--c-green-bg)] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--c-green-mid)] mb-3">
        🎯 Priority Actions
      </p>
      <ul className="space-y-2.5">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
            <div className="min-w-0">
              <Link
                to={item.to}
                className="text-sm font-semibold text-[var(--c-green)] hover:underline underline-offset-2 inline-flex items-center gap-1"
              >
                {item.text} <ArrowRight size={11} />
              </Link>
              <p className="text-xs text-[var(--c-text-muted)] mt-0.5 leading-relaxed">{item.why}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function ConfidenceScoreGauge({ caseId, score: scoreData, onScoreUpdate }) {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalcError,     setRecalcError]     = useState("");
  const [expandedKey,     setExpandedKey]     = useState(null);

  const hasScore = scoreData?.score !== null && scoreData?.score !== undefined;
  const running  = scoreData?.running || isRecalculating;

  const score     = scoreData?.score     ?? 0;
  const breakdown = scoreData?.breakdown ?? {};
  const label     = scoreData?.label     ?? "";
  const genAt     = scoreData?.generatedAt;

  const insights = getInsights(breakdown);

  const handleRecalculate = async () => {
    if (!caseId || isRecalculating) return;
    setIsRecalculating(true);
    setRecalcError("");
    try {
      const result = await generateConfidenceScore(caseId);
      if (result?.visaConfidenceScore) onScoreUpdate(result.visaConfidenceScore);
    } catch (err) {
      setRecalcError("Recalculation failed. Please try again.");
    } finally {
      setIsRecalculating(false);
    }
  };

  const toggleExpand = (key) => setExpandedKey((prev) => prev === key ? null : key);

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-card)] overflow-hidden">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-1">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold">
            AI Analysis
          </p>
          <h2 className="text-base font-bold text-[var(--c-text)]">Visa Confidence Score</h2>
        </div>
        <button
          type="button"
          onClick={handleRecalculate}
          disabled={running}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--c-text-muted)] hover:text-[var(--c-green)] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RefreshCw size={12} className={running ? "animate-spin" : ""} />
          {running ? "Calculating..." : "Recalculate"}
        </button>
      </div>

      {/* ── Gauge ─────────────────────────────────────────────────────── */}
      {running ? (
        <div className="py-10 flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-[var(--c-border)] border-t-[var(--c-green)] animate-spin" />
          <p className="text-xs text-[var(--c-text-muted)]">Analysing your profile...</p>
        </div>
      ) : hasScore ? (
        <>
          <div className="px-4 pt-4">
            <GaugeSVG score={score} />
          </div>

          {/* Label + timestamp */}
          <div className="text-center pb-4 px-6">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${scorePill(score)}`}>
              {label}
            </span>
            {genAt && (
              <p className="text-[10px] text-[var(--c-text-muted)] mt-2">
                Last calculated {new Date(genAt).toLocaleString("en-IN", {
                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </>
      ) : (
        /* No score yet */
        <div className="text-center px-6 py-8">
          <div className="w-14 h-14 rounded-full bg-[var(--c-green-bg)] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-sm font-semibold text-[var(--c-text)] mb-1">Score not generated yet</p>
          <p className="text-xs text-[var(--c-text-muted)] mb-4 leading-relaxed max-w-xs mx-auto">
            Your score is calculated from your documents, questionnaire, passport validity, and destination country.
          </p>
          <button
            type="button"
            onClick={handleRecalculate}
            className="inline-flex items-center gap-2 rounded-[var(--r-lg)] bg-[var(--c-green)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--c-green-mid)] transition active:scale-[0.98]"
          >
            <RefreshCw size={14} />
            Generate Score
          </button>
        </div>
      )}

      {/* ── Breakdown + insights ───────────────────────────────────────── */}
      {hasScore && !running && (
        <div className="border-t border-[var(--c-border)] px-5 py-5 space-y-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--c-text-muted)] font-semibold mb-4">
            Score Breakdown
            <span className="ml-2 font-normal normal-case tracking-normal text-[var(--c-text-muted)]">
              tap any row to learn more
            </span>
          </p>

          {insights.map((item) => (
            <BreakdownItem
              key={item.key}
              item={item}
              expanded={expandedKey === item.key}
              onToggle={() => toggleExpand(item.key)}
            />
          ))}

          <PriorityActions breakdown={breakdown} score={score} />
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────────── */}
      {recalcError && (
        <div className="mx-5 mb-5 rounded-[var(--r-lg)] border border-[var(--c-error-border)] bg-[var(--c-error-bg)] px-4 py-2.5 text-xs text-[var(--c-error)]">
          {recalcError}
        </div>
      )}

    </div>
  );
}

export default ConfidenceScoreGauge;