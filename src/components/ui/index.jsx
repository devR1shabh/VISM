// src/components/ui/index.jsx
// Pure presentation primitives — zero business logic, zero API calls,
// zero context reads. Everything here accepts only display props.
//
// Updated in Phase 4: all cyan/navy hardcoded values replaced with
// green token system from tokens.css.
//
// Import as:
//   import { PageHeader, StatCard, StatusBadge, PremiumCard } from "../components/ui";
//
// DO NOT add hooks, state, or side effects to this file.

// ── PageHeader ─────────────────────────────────────────────────────────────
// Compact green page header used on all inner applicant and processor pages.
// Replaces the giant dark hero cards from the previous design.
//
// Props:
//   eyebrow:     string    — small uppercase label above the title (optional)
//   title:       string    — main page heading (required)
//   description: string    — subtitle below the title (optional)
//   children:    ReactNode — extra content below description e.g. stat pills (optional)
//
// Usage:
//   <PageHeader
//     eyebrow="Document Intelligence"
//     title="Upload & Verify Documents"
//     description="AI-powered passport extraction and document verification."
//   />

export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="bg-[var(--c-green)] text-white px-8 py-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/60 mb-2 font-semibold">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-bold text-white lg:text-4xl leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-white/65 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────
// Editorial metric card used on inner pages to show case info and metrics.
// Number displayed in Playfair Display for editorial weight.
//
// Props:
//   label:   string    — small uppercase label (required)
//   value:   string    — main display value (required)
//   sub:     string    — small subtitle below value (optional)
//   icon:    ReactNode — Lucide icon component (optional)
//   accent:  boolean   — adds a left green border accent (optional, default false)
//
// Usage:
//   <StatCard label="Visa Type" value="Student Visa" />
//   <StatCard label="Completion" value="75%" sub="On Track" accent />

export function StatCard({ label, value, sub, icon, accent = false }) {
  return (
    <div
      className={`bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] p-5 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)] ${
        accent ? "border-l-4 border-l-[var(--c-green)]" : ""
      }`}
    >
      {icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-[var(--r-lg)] bg-[var(--c-green-bg)] text-[var(--c-green-mid)] mb-3">
          {icon}
        </div>
      )}
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-muted)]">
        {label}
      </p>
      <p className="mt-1.5 font-display text-2xl font-bold text-[var(--c-text)] leading-tight">
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-xs text-[var(--c-text-muted)]">{sub}</p>
      )}
    </div>
  );
}

// ── StatusBadge ────────────────────────────────────────────────────────────
// Unified semantic status badge used across the entire application.
// All status string values preserved exactly — only visual colours updated.
//
// Covers all status values in the codebase:
//   Processor: Pending, Approved, Rejected, Need Documents
//   Document:  Verified, Submitted, Missing
//   Case:      In Progress
//
// Props:
//   status: string — one of the status values above (required)
//
// Usage:
//   <StatusBadge status="Approved" />
//   <StatusBadge status={caseRecord.processorStatus} />

export function StatusBadge({ status }) {
  const map = {
    // Processor case statuses
    Pending:          "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    Approved:         "bg-[var(--c-green-bg)] text-[var(--c-green)] border-[var(--c-green-light)]",
    Rejected:         "bg-[#FEE2E2] text-[#7F1D1D] border-[#FECACA]",
    "Need Documents": "bg-[#DBEAFE] text-[#1E3A8A] border-[#BFDBFE]",
    // Document statuses
    Verified:         "bg-[var(--c-green-bg)] text-[var(--c-green)] border-[var(--c-green-light)]",
    Submitted:        "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    Missing:          "bg-[#FEE2E2] text-[#7F1D1D] border-[#FECACA]",
    // Case workflow status
    "In Progress":    "bg-[#DBEAFE] text-[#1E3A8A] border-[#BFDBFE]",
  };

  const cls = map[status] || "bg-[var(--c-bg)] text-[var(--c-text-muted)] border-[var(--c-border)]";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-[0.06em] uppercase ${cls}`}
    >
      {status || "—"}
    </span>
  );
}

// ── PremiumCard ────────────────────────────────────────────────────────────
// White card wrapper with consistent border, radius, and subtle shadow.
// Used to wrap content sections on inner pages and processor panels.
//
// Props:
//   children:  ReactNode — card content (required)
//   className: string    — additional Tailwind classes (optional)
//   padding:   boolean   — whether to apply default p-6 padding (default: true)
//
// Usage:
//   <PremiumCard>
//     <h2>Card Title</h2>
//   </PremiumCard>
//
//   <PremiumCard padding={false} className="overflow-hidden">
//     <table>...</table>
//   </PremiumCard>

export function PremiumCard({ children, className = "", padding = true }) {
  return (
    <div
      className={`bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] ${
        padding ? "p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ── SectionEyebrow ─────────────────────────────────────────────────────────
// Small uppercase label used above section headings.
// Editorial style: muted gray, not coloured.
//
// Props:
//   children: string — eyebrow text (required)
//
// Usage:
//   <SectionEyebrow>Document Intelligence</SectionEyebrow>

export function SectionEyebrow({ children }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-3">
      {children}
    </p>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────
// Thin horizontal rule using the warm border token.
//
// Usage:
//   <Divider />
//   <Divider className="my-6" />

export function Divider({ className = "" }) {
  return (
    <hr className={`border-0 border-t border-[var(--c-border)] ${className}`} />
  );
}