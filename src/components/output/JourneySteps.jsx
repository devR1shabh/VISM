function JourneySteps({ journey = [] }) {
  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">

      <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">Immigration Journey</h2>

      {journey.length === 0 ? (
        <p className="text-sm text-[var(--c-text-muted)]">No journey information available.</p>
      ) : (
        <ol className="list-decimal ml-5 space-y-2">
          {journey.map((step, index) => (
            <li key={index} className="text-sm text-[var(--c-text-mid)]">
              {typeof step === "string" ? (
                step
              ) : (
                <>
                  <span className="font-medium text-[var(--c-text)]">
                    {step.stage || step.name || "Journey Step"}
                  </span>
                  {(step.duration || step.status) && (
                    <span className="text-[var(--c-text-muted)] ml-2">
                      ({step.duration || step.status})
                    </span>
                  )}
                </>
              )}
            </li>
          ))}
        </ol>
      )}

    </div>
  );
}

export default JourneySteps;