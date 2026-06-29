// src/components/applicant/ProcessorRemarksPanel.jsx

import { formatDateTime } from "../../utils/dateUtils.js";

function ProcessorRemarksPanel({ notes = [], processorStatus }) {
  const hasNotes       = notes.length > 0;
  const needsDocuments = processorStatus === "Need Documents";
  const isRejected     = processorStatus === "Rejected";
  const isApproved     = processorStatus === "Approved";

  if (!hasNotes && !needsDocuments && !isRejected && !isApproved) return null;

  const bannerConfig = {
    "Need Documents": {
      bg:   "bg-[var(--c-info-bg)] border-[var(--c-info-border)]",
      text: "text-[var(--c-info)]",
      icon: "📎",
      msg:  "Your processor has requested additional documents. Please review the notes below and upload the required files.",
    },
    "Rejected": {
      bg:   "bg-[var(--c-error-bg)] border-[var(--c-error-border)]",
      text: "text-[var(--c-error)]",
      icon: "❌",
      msg:  "Your visa case has been rejected. Please review the processor's notes for more details.",
    },
    "Approved": {
      bg:   "bg-[var(--c-green-bg)] border-[var(--c-green-light)]",
      text: "text-[var(--c-green)]",
      icon: "✅",
      msg:  "Congratulations! Your visa case has been approved.",
    },
  };

  const banner = bannerConfig[processorStatus];

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">

      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-[var(--c-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <h2 className="text-sm font-bold text-[var(--c-text)] uppercase tracking-[0.08em]">
          Processor Remarks
        </h2>
      </div>

      {banner && (
        <div className={`rounded-[var(--r-lg)] border px-4 py-3 mb-4 flex items-start gap-3 ${banner.bg}`}>
          <span className="text-base leading-none mt-0.5 shrink-0">{banner.icon}</span>
          <p className={`text-sm leading-relaxed ${banner.text}`}>{banner.msg}</p>
        </div>
      )}

      {hasNotes ? (
        <div className="space-y-3">
          {notes.map((note, idx) => (
            <div
              key={note.noteId || idx}
              className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--c-green-mid)]">
                  Processor Note
                </span>
                {note.addedAt && (
                  <span className="text-xs text-[var(--c-text-muted)]">
                    {formatDateTime(note.addedAt)}
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--c-text-mid)] leading-relaxed">{note.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--c-text-muted)]">No notes have been added yet.</p>
      )}

    </div>
  );
}

export default ProcessorRemarksPanel;