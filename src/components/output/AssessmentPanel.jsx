function AssessmentPanel({ assessment }) {
  if (!assessment) return null;

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">

      <h2 className="text-lg font-bold text-[var(--c-text)] mb-5">Case Assessment</h2>

      <div className="mb-5">
        <span className="font-display text-4xl font-bold text-[var(--c-green)]">
          {assessment.score}%
        </span>
        <p className="text-sm text-[var(--c-text-muted)] mt-1">Application Completion Score</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-bold text-[var(--c-success)] mb-2">Strengths</h3>
        <ul className="list-disc ml-5 space-y-1 text-sm text-[var(--c-text-mid)]">
          {assessment.strengths?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-bold text-[var(--c-warning)] mb-2">Areas Requiring Attention</h3>
        <ul className="list-disc ml-5 space-y-1 text-sm text-[var(--c-text-mid)]">
          {assessment.concerns?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold text-[var(--c-info)] mb-2">Recommended Next Step</h3>
        <div className="bg-[var(--c-info-bg)] border border-[var(--c-info-border)] rounded-[var(--r-md)] p-3">
          <p className="text-sm text-[var(--c-text-mid)]">{assessment.recommendation}</p>
        </div>
      </div>

    </div>
  );
}

export default AssessmentPanel;