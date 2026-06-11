// src/components/upload/DocumentGuidelines.jsx

function CheckItem({ text }) {
  return (
    <li className="flex items-start gap-2 text-sm text-[#B8C5D1]">
      <svg
        className="w-4 h-4 text-[#22E7C5] mt-0.5 shrink-0"
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
    <li className="flex items-start gap-2 text-sm text-[#B8C5D1]">
      <svg
        className="w-4 h-4 text-[#39F5D5] mt-0.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      {text}
    </li>
  );
}

function DocumentGuidelines() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_30px_90px_-30px_rgba(34,231,197,0.3)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-[#22E7C5] mb-2">
            Document Upload Guidelines
          </p>
          <h2 className="text-2xl font-semibold text-white">How to prepare your documents</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#22E7C5]/15 text-[#22E7C5] text-xl">
              🛂
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#22E7C5]">
                Passport Requirements
              </p>
              <p className="text-sm text-[#B8C5D1] mt-1">
                Your passport image should be clear and complete.
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            <CheckItem text="Clear, well-lit image — all corners visible" />
            <CheckItem text="MRZ (machine-readable zone) clearly visible at bottom" />
            <CheckItem text="ICAO TD3 standard passport (full biographical page)" />
            <XItem text="No blur, glare, or shadows on the page" />
            <CheckItem text="Accepted formats: JPG, JPEG, PNG only" />
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#39F5D5]/15 text-[#39F5D5] text-xl">
              📄
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#39F5D5]">
                Other Documents
              </p>
              <p className="text-sm text-[#B8C5D1] mt-1">
                Ensure supporting docs are legible and complete.
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            <CheckItem text="Clear, high-resolution image — all text readable" />
            <CheckItem text="All pages visible and in correct orientation" />
            <CheckItem text="Document must be complete — no cropping of content" />
            <XItem text="No handwritten annotations or alterations" />
            <CheckItem text="Accepted formats: JPG, JPEG, PNG only" />
          </ul>
        </div>
      </div>
    </section>
  );
}

export default DocumentGuidelines;
