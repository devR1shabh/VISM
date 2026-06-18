function ApplicationOverview({ overview }) {
  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <h2 className="text-lg font-bold text-[var(--c-text)] mb-3">Application Overview</h2>
      <p className="text-sm text-[var(--c-text-mid)] leading-relaxed">{overview}</p>
    </div>
  );
}

export default ApplicationOverview;