function TimelineEstimate({ timeline = [] }) {
  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <h2 className="text-lg font-bold text-[var(--c-text)] mb-4">Timeline Estimate</h2>

      {timeline.length === 0 ? (
        <p className="text-sm text-[var(--c-text-muted)]">No timeline available.</p>
      ) : (
        <ul className="space-y-3">
          {timeline.map((item, index) => (
            <li
              key={index}
              className="border-l-4 border-[var(--c-green)] pl-4"
            >
              <p className="text-sm font-semibold text-[var(--c-text)]">
                {typeof item === "string"
                  ? item
                  : item.stage || item.name || "Timeline Stage"}
              </p>
              {typeof item === "object" && (
                <p className="text-xs text-[var(--c-text-muted)] mt-0.5">
                  {item.duration || item.status || item.notes || ""}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TimelineEstimate;