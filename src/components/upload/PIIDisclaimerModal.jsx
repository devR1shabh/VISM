// src/components/upload/PIIDisclaimerModal.jsx

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PIIDisclaimerModal({ onAccept }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="pii-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-modal)] animate-fade-in overflow-hidden"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >

        {/* Header */}
        <div className="bg-[var(--c-green)] px-6 py-5 flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-[var(--r-lg)] bg-white/15 flex items-center justify-center text-xl select-none">
            🔒
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 mb-1">
              Before You Continue
            </p>
            <h2
              id="pii-modal-title"
              className="font-display text-xl font-bold text-white leading-snug"
            >
              Confidentiality &amp; Privacy Notice
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-2">
          <p className="text-sm text-[var(--c-text-mid)] leading-relaxed">
            Your uploaded documents may contain sensitive personal information
            including identity documents, financial records, educational
            certificates, medical documents and other confidential information.
          </p>
          <p className="text-sm text-[var(--c-text-mid)] leading-relaxed mt-3">
            By continuing, you acknowledge that these documents may be securely
            accessed and reviewed by authorized immigration case processors for
            the purpose of evaluating and processing your visa application.
          </p>
          <p className="text-sm text-[var(--c-text-mid)] leading-relaxed mt-3">
            Your data will be handled in accordance with applicable privacy and
            security practices.
          </p>
        </div>

        {/* Learn More toggle */}
        <div className="px-6 pt-3 pb-2">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--c-green-mid)] hover:text-[var(--c-green)] transition-colors"
            aria-expanded={expanded}
            aria-controls="pii-learn-more"
          >
            {expanded ? (
              <><ChevronUp size={15} />Hide Details</>
            ) : (
              <><ChevronDown size={15} />Learn More</>
            )}
          </button>

          {expanded && (
            <div
              id="pii-learn-more"
              className="mt-3 rounded-[var(--r-lg)] bg-[var(--c-bg)] border border-[var(--c-border)] p-4 space-y-4 animate-fade-in"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--c-green-mid)] mb-1">
                  Why are these documents required?
                </p>
                <p className="text-xs text-[var(--c-text-mid)] leading-relaxed">
                  Immigration authorities require verified supporting documents
                  to assess your eligibility for a visa. These documents confirm
                  your identity, financial standing, educational background, and
                  other criteria relevant to your specific visa category.
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--c-green-mid)] mb-1">
                  Who can access my documents?
                </p>
                <p className="text-xs text-[var(--c-text-mid)] leading-relaxed">
                  Only authorized immigration case processors assigned to your
                  application have access to your documents. Access is strictly
                  controlled and logged.
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--c-green-mid)] mb-1">
                  How will my documents be used?
                </p>
                <p className="text-xs text-[var(--c-text-mid)] leading-relaxed">
                  Your documents are used exclusively for the purpose of
                  evaluating and processing your visa application. They will not
                  be shared with any third party outside of the immigration
                  processing workflow.
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--c-green-mid)] mb-1">
                  Who are authorized personnel?
                </p>
                <p className="text-xs text-[var(--c-text-mid)] leading-relaxed">
                  Authorized personnel are credentialed immigration case
                  processors who have undergone identity verification, training,
                  and are bound by confidentiality obligations. Only they can
                  view your submitted documents within this system.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-6 mt-4 border-t border-[var(--c-border)]" />

        {/* Buttons */}
        <div className="px-6 py-5 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center justify-center gap-1.5 rounded-[var(--r-md)] border border-[var(--c-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--c-text-mid)] hover:bg-[var(--c-bg)] transition-colors"
          >
            {expanded ? "Hide Details" : "Learn More"}
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex items-center justify-center gap-2 rounded-[var(--r-md)] bg-[var(--c-green)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--c-green-mid)] transition-colors"
          >
            I Understand &amp; Continue
          </button>
        </div>

      </div>
    </div>
  );
}