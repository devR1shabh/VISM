function AIRecommendations({ aiRecommendations = [] }) {
  const isLoading = aiRecommendations.length === 0;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <h2 className="text-lg font-bold text-[var(--c-text)]">Recommendations</h2>
        <span className="inline-flex items-center rounded-full border border-[var(--c-green-light)] bg-[var(--c-green-bg)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--c-green)]">
          AI Generated
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-10 rounded-[var(--r-lg)] bg-[var(--c-border)] animate-pulse" />
          <div className="h-10 rounded-[var(--r-lg)] bg-[var(--c-border)] animate-pulse" />
          <div className="h-10 rounded-[var(--r-lg)] bg-[var(--c-border)] animate-pulse" />
        </div>
      ) : (
        <ul className="space-y-3">
          {aiRecommendations.map((rec, index) => (
            <li
              key={index}
              className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-[var(--c-green-bg)] text-xs font-bold text-[var(--c-green)]">
                  {index + 1}
                </span>
                <p className="text-sm text-[var(--c-text-mid)] leading-relaxed">{rec}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AIRecommendations;