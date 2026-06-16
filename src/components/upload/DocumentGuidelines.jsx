// src/components/upload/DocumentGuidelines.jsx

function CheckItem({ text }) {
  return (
    <li className="flex items-start gap-2 text-sm text-[var(--c-text-mid)]">
      <svg
        className="w-4 h-4 text-[var(--c-green-mid)] mt-0.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {text}
    </li>
  );
}

function XItem({ text }) {
  return (
    <li className="flex items-start gap-2 text-sm text-[var(--c-text-mid)]">
      <svg
        className="w-4 h-4 text-[var(--c-error)] mt-0.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      {text}
    </li>
  );
}

function DocumentGuidelines() {
  return (
    <section className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-card)] p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-7">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-1">
            Document Upload Guidelines
          </p>
          <h2 className="text-xl font-bold text-[var(--c-text)]">How to prepare your documents</h2>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Passport requirements */}
        <div className="rounded-[var(--r-xl)] border border-[var(--c-border)] bg-[var(--c-bg)] p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--r-lg)] bg-[var(--c-green-bg)] text-xl shrink-0">
              🛂
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--c-green-mid)]">
                Passport Requirements
              </p>
              <p className="text-xs text-[var(--c-text-muted)] mt-0.5">
                Your passport image should be clear and complete.
              </p>
            </div>
          </div>
          <ul className="space-y-2.5">
            <CheckItem text="Clear, well-lit image — all corners visible" />
            <CheckItem text="MRZ (machine-readable zone) clearly visible at bottom" />
            <CheckItem text="ICAO TD3 standard passport (full biographical page)" />
            <XItem     text="No blur, glare, or shadows on the page" />
            <CheckItem text="Accepted formats: JPG, JPEG, PNG only" />
          </ul>
        </div>

        {/* Other documents */}
        <div className="rounded-[var(--r-xl)] border border-[var(--c-border)] bg-[var(--c-bg)] p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--r-lg)] bg-[var(--c-bg-alt)] text-xl shrink-0">
              📄
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--c-text-muted)]">
                Other Documents
              </p>
              <p className="text-xs text-[var(--c-text-muted)] mt-0.5">
                Ensure supporting docs are legible and complete.
              </p>
            </div>
          </div>
          <ul className="space-y-2.5">
            <CheckItem text="Clear, high-resolution image — all text readable" />
            <CheckItem text="All pages visible and in correct orientation" />
            <CheckItem text="Document must be complete — no cropping of content" />
            <XItem     text="No handwritten annotations or alterations" />
            <CheckItem text="Accepted formats: JPG, JPEG, PNG only" />
          </ul>
        </div>
      </div>
    </section>
  );
}

export default DocumentGuidelines;