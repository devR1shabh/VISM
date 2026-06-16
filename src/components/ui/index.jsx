// src/components/ui/index.jsx
// Pure presentation primitives — zero business logic, zero API calls,
// zero context reads. Everything here accepts only display props.
//
// Used by later phases to replace repeated inline className patterns.
// Import as: import { PageHeader, StatCard, StatusBadge, PremiumCard } from "../ui";
//
// DO NOT add hooks, state, or side effects to this file.

// ── PageHeader ─────────────────────────────────────────────────────────────
// Compact navy page header used on all inner applicant and processor pages.
// Replaces the giant rounded-[32px] dark hero cards on Analysis, Documents,
// Journey, Dashboard, and ApplicationReady.
//
// Props:
//   eyebrow:     string — small uppercase label above the title (optional)
//   title:       string — main page heading (required)
//   description: string — subtitle below the title (optional)
//   children:    ReactNode — extra content below description (optional)
//
// Usage:
//   <PageHeader
//     eyebrow="Document Intelligence"
//     title="Upload & Verify Documents"
//     description="AI-powered passport extraction and document verification."
//   />

export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="bg-[#0A2E57] text-white px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.18em] text-[#4DC7F7] mb-2 font-semibold">
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
// Premium metric/stat card used on inner pages to show case info.
// Replaces the dark semi-transparent cards (bg-white/5 backdrop-blur)
// on Analysis, Documents, Journey, and Dashboard.
//
// Props:
//   label:   string — small uppercase label (required)
//   value:   string — main display value (required)
//   sub:     string — small subtitle below value (optional)
//   icon:    ReactNode — Lucide icon component (optional)
//   accent:  boolean — adds a left cyan border accent (optional)
//
// Usage:
//   <StatCard label="Visa Type" value="Student Visa" icon={<GraduationCap size={20} />} />
//   <StatCard label="Case ID" value="CASE-123456" accent />

export function StatCard({ label, value, sub, icon, accent = false }) {
  return (
    <div
      className={`bg-white border border-[#E6E8EB] rounded-xl p-5 shadow-sm transition hover:shadow-md ${
        accent ? "border-l-4 border-l-[#4DC7F7]" : ""
      }`}
    >
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F4FD] text-[#2AA6D8] mb-3">
          {icon}
        </div>
      )}
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-bold text-[#0A2E57] leading-tight">
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-xs text-[#6B7280]">{sub}</p>
      )}
    </div>
  );
}

// ── StatusBadge ────────────────────────────────────────────────────────────
// Unified semantic status badge used across the entire application.
// Replaces the locally-defined StatusBadge in CasesTable.jsx and
// ProcessorCaseDetail.jsx, and the inline status styles in ApplicantProfile.
//
// Covers all status values used in the codebase:
//   Processor statuses: Pending, Approved, Rejected, Need Documents
//   Document statuses:  Verified, Submitted, Missing
//   Case statuses:      In Progress
//
// Props:
//   status: string — one of the status values above (required)
//
// Usage:
//   <StatusBadge status="Approved" />
//   <StatusBadge status="Verified" />
//   <StatusBadge status={caseRecord.processorStatus} />

export function StatusBadge({ status }) {
  const map = {
    // Processor case statuses
    Pending:          "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    Approved:         "bg-[#DCFCE7] text-[#14532D] border-[#BBF7D0]",
    Rejected:         "bg-[#FEE2E2] text-[#7F1D1D] border-[#FECACA]",
    "Need Documents": "bg-[#DBEAFE] text-[#1E3A8A] border-[#BFDBFE]",
    // Document statuses
    Verified:         "bg-[#DCFCE7] text-[#14532D] border-[#BBF7D0]",
    Submitted:        "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    Missing:          "bg-[#FEE2E2] text-[#7F1D1D] border-[#FECACA]",
    // Case workflow status
    "In Progress":    "bg-[#DBEAFE] text-[#1E3A8A] border-[#BFDBFE]",
  };

  const cls = map[status] || "bg-[#F7F8FA] text-[#6B7280] border-[#E6E8EB]";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      {status || "—"}
    </span>
  );
}

// ── PremiumCard ────────────────────────────────────────────────────────────
// White card wrapper with consistent border, radius, and shadow.
// Replaces the dark glass cards (bg-[#083D4A]/80 border-white/10 backdrop-blur-xl)
// used inside output components and processor panels.
//
// Props:
//   children:  ReactNode — card content (required)
//   className: string — additional Tailwind classes (optional)
//   padding:   boolean — whether to add default padding (default: true)
//
// Usage:
//   <PremiumCard>
//     <h2>Card Title</h2>
//     <p>Card content</p>
//   </PremiumCard>
//
//   <PremiumCard className="col-span-2" padding={false}>
//     <table>...</table>
//   </PremiumCard>

export function PremiumCard({ children, className = "", padding = true }) {
  return (
    <div
      className={`bg-white border border-[#E6E8EB] rounded-xl shadow-sm ${
        padding ? "p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ── SectionEyebrow ─────────────────────────────────────────────────────────
// Small uppercase cyan label used above section headings.
// Replaces the repeated pattern:
//   <p className="text-xs uppercase tracking-[0.32em] text-[#22E7C5] mb-1">
//
// Props:
//   children: string — eyebrow text (required)
//
// Usage:
//   <SectionEyebrow>Document Intelligence</SectionEyebrow>

export function SectionEyebrow({ children }) {
  return (
    <p className="text-xs uppercase tracking-[0.18em] text-[#2AA6D8] font-semibold mb-1">
      {children}
    </p>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────
// Thin horizontal rule using the design system border colour.
// Replaces ad-hoc border-t border-white/8 or border-[#E6E8EB] dividers.
//
// Usage:
//   <Divider />
//   <Divider className="my-6" />

export function Divider({ className = "" }) {
  return (
    <hr className={`border-0 border-t border-[#E6E8EB] ${className}`} />
  );
}