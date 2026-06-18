function VisaJourneyTimeline({ visaJourney = [] }) {
  // ── Logic completely unchanged ──────────────────────────────────
  const lastIndex = Math.max(0, visaJourney.length - 1);

  return (
    <div>
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] mb-1">
          Visa Journey
        </p>
        <h2 className="text-lg font-bold text-[var(--c-text)]">Immigration Journey</h2>
      </div>

      {visaJourney.length === 0 ? (
        <p className="text-sm text-[var(--c-text-muted)]">No journey information available.</p>
      ) : (
        <ol className="relative flex flex-col gap-5">
          {visaJourney.map((step, index) => {
            const isLast      = index === visaJourney.length - 1;
            const isCompleted = index < lastIndex;
            const isCurrent   = index === lastIndex;

            return (
              <li key={index} className="flex items-start gap-4">
                {/* Connector column */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition ${
                      isCompleted
                        ? "bg-[var(--c-green)] text-white"
                        : isCurrent
                        ? "bg-[var(--c-green)] text-white ring-4 ring-[var(--c-green-bg)]"
                        : "bg-[var(--c-border)] text-[var(--c-text-muted)]"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-px flex-1 mt-2 ${
                        isCompleted ? "bg-[var(--c-green)]" : "bg-[var(--c-border)]"
                      }`}
                      style={{ minHeight: "20px" }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-1">
                  <div
                    className={`rounded-[var(--r-lg)] px-4 py-3 border ${
                      isCompleted
                        ? "border-[var(--c-success-border)] bg-[var(--c-success-bg)]"
                        : isCurrent
                        ? "border-[var(--c-green-light)] bg-[var(--c-green-bg)]"
                        : "border-[var(--c-border)] bg-[var(--c-bg)]"
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        isCompleted || isCurrent
                          ? "text-[var(--c-text)]"
                          : "text-[var(--c-text-muted)]"
                      }`}
                    >
                      {step.stage}
                    </p>
                    {step.duration && (
                      <p className="text-xs mt-0.5 text-[var(--c-text-muted)]">
                        {step.duration}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export default VisaJourneyTimeline;