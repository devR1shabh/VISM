// src/components/processor/QuestionnairePanel.jsx
// Displays the applicant's submitted questionnaire answers to the processor.
// Also renders an auto-generated AI Profile Summary derived from the answers.

import { ClipboardList, User, BookOpen, Briefcase, Clock, Globe, AlertCircle, DollarSign, Users, MapPin, MessageSquare } from "lucide-react";

// ── Field definitions — label + icon ────────────────────────────────────────

const FIELDS = [
  { key: "purpose",               label: "Primary Purpose",        Icon: User         },
  { key: "education",             label: "Highest Education",       Icon: BookOpen     },
  { key: "occupation",            label: "Current Occupation",      Icon: Briefcase    },
  { key: "experience",            label: "Years of Experience",     Icon: Clock        },
  { key: "travelHistory",         label: "International Travel",    Icon: Globe        },
  { key: "previousRefusal",       label: "Previous Refusal",        Icon: AlertCircle  },
  { key: "previousRefusalDetails",label: "Refusal Details",         Icon: AlertCircle  },
  { key: "financialCapacity",     label: "Financial Capacity",      Icon: DollarSign   },
  { key: "hasSponsor",            label: "Has Sponsor/Supporter",   Icon: Users        },
  { key: "sponsorName",           label: "Supporter / Organization",Icon: Users        },
  { key: "existingArrangements",  label: "Existing Arrangements",   Icon: MapPin       },
  { key: "additionalNotes",       label: "Additional Notes",        Icon: MessageSquare},
];

// ── AI Profile Summary ───────────────────────────────────────────────────────
// Derived entirely from questionnaire data — no LLM required.

function buildProfileSummary(q) {
  const lines = [];
  if (q.purpose)             lines.push({ label: "Purpose",           value: q.purpose });
  if (q.education)           lines.push({ label: "Education",         value: q.education });
  if (q.occupation)          lines.push({ label: "Occupation",        value: q.occupation });
  if (q.experience)          lines.push({ label: "Experience",        value: q.experience });
  if (q.travelHistory)       lines.push({ label: "Travel History",    value: q.travelHistory });
  if (q.previousRefusal)     lines.push({ label: "Previous Refusal",  value: q.previousRefusal });
  if (q.financialCapacity)   lines.push({ label: "Financial Capacity",value: q.financialCapacity });
  if (q.hasSponsor === "Yes" && q.sponsorName)
    lines.push({ label: "Sponsor",           value: q.sponsorName });
  else if (q.hasSponsor)
    lines.push({ label: "Sponsor",           value: q.hasSponsor === "Yes" ? "Yes (name not provided)" : "No" });
  if (q.existingArrangements)
    lines.push({ label: "Arrangements",      value: q.existingArrangements });
  return lines;
}

function ProfileSummary({ questionnaire }) {
  const lines = buildProfileSummary(questionnaire);
  if (lines.length === 0) return null;

  return (
    <div className="bg-[var(--c-green-bg)] border border-[var(--c-green-light)] rounded-[var(--r-xl)] p-5 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-[var(--r-md)] bg-[var(--c-green)] flex items-center justify-center">
          <User size={14} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--c-green-mid)] font-semibold">
            AI Profile Summary
          </p>
          <p className="text-[11px] text-[var(--c-text-muted)]">Auto-generated from questionnaire</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {lines.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center gap-2 bg-white border border-[var(--c-green-light)] rounded-[var(--r-md)] px-3 py-2"
          >
            <span className="text-[11px] font-semibold text-[var(--c-green-mid)] w-28 shrink-0">
              {label}:
            </span>
            <span className="text-[11px] text-[var(--c-text-mid)] font-medium truncate" title={value}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

function QuestionnairePanel({ caseRecord }) {
  const questionnaire = caseRecord?.questionnaire;

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!questionnaire) {
    return (
      <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[var(--r-lg)] bg-[var(--c-bg)] border border-[var(--c-border)] flex items-center justify-center">
            <ClipboardList size={16} className="text-[var(--c-text-muted)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--c-text)]">Applicant Questionnaire</h3>
            <p className="text-xs text-[var(--c-text-muted)]">Post-document applicant profile</p>
          </div>
        </div>
        <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-5 py-6 text-center">
          <ClipboardList size={28} className="text-[var(--c-text-muted)] mx-auto mb-2" />
          <p className="text-sm font-medium text-[var(--c-text-muted)]">
            Questionnaire not yet submitted
          </p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">
            The applicant will complete this after uploading documents.
          </p>
        </div>
      </div>
    );
  }

  // ── Submitted state ────────────────────────────────────────────────────────
  const submittedAt = questionnaire.submittedAt
    ? new Date(questionnaire.submittedAt).toLocaleString("en-GB", {
        day:    "2-digit",
        month:  "short",
        year:   "numeric",
        hour:   "2-digit",
        minute: "2-digit",
      })
    : null;

  // Only show fields with actual values
  const populatedFields = FIELDS.filter(({ key }) => {
    const val = questionnaire[key];
    return val && val.toString().trim() !== "";
  });

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[var(--r-lg)] bg-[var(--c-green-bg)] border border-[var(--c-green-light)] flex items-center justify-center">
            <ClipboardList size={16} className="text-[var(--c-green-mid)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--c-text)]">Applicant Questionnaire</h3>
            <p className="text-xs text-[var(--c-text-muted)]">Post-document applicant profile</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[var(--c-success)]" />
          <span className="text-[11px] font-semibold text-[var(--c-success)]">Submitted</span>
        </div>
      </div>

      {/* Profile summary */}
      <ProfileSummary questionnaire={questionnaire} />

      {/* Full answers */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--c-text-muted)] font-semibold mb-3">
          Full Responses
        </p>
        <div className="space-y-0 rounded-[var(--r-xl)] border border-[var(--c-border)] overflow-hidden">
          {populatedFields.map(({ key, label, Icon }, idx) => (
            <div
              key={key}
              className={`flex items-start gap-3 px-4 py-3.5 ${
                idx !== populatedFields.length - 1 ? "border-b border-[var(--c-border)]" : ""
              } ${idx % 2 === 0 ? "bg-white" : "bg-[var(--c-bg)]"}`}
            >
              <Icon size={14} className="text-[var(--c-text-muted)] mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-[var(--c-text-muted)] mb-0.5">
                  {label}
                </p>
                <p className="text-sm text-[var(--c-text-mid)] font-medium leading-relaxed break-words">
                  {questionnaire[key]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submitted at footer */}
      {submittedAt && (
        <p className="text-[11px] text-[var(--c-text-muted)] mt-4 text-right">
          Submitted {submittedAt}
        </p>
      )}

    </div>
  );
}

export default QuestionnairePanel;