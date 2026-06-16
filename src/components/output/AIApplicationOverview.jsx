function AIApplicationOverview({ aiOverview }) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-lg font-bold text-[var(--c-text)]">AI Application Overview</h2>
        <span className="inline-flex items-center rounded-full border border-[var(--c-green-light)] bg-[var(--c-green-bg)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--c-green)]">
          AI Generated
        </span>
      </div>

      {aiOverview ? (
        <p className="text-[var(--c-text-mid)] leading-relaxed text-sm">{aiOverview}</p>
      ) : (
        <div className="space-y-3">
          <div className="h-4 rounded-full bg-[var(--c-border)] animate-pulse" />
          <div className="h-4 rounded-full bg-[var(--c-border)] animate-pulse w-5/6" />
          <div className="h-4 rounded-full bg-[var(--c-border)] animate-pulse w-4/6" />
        </div>
      )}
    </div>
  );
}

export default AIApplicationOverview;