function DocumentValidationPanel({ validation }) {
  if (!validation) return null;

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">

      <h2 className="text-lg font-bold text-[var(--c-text)] mb-4">Document Validation</h2>

      <div className="mb-4 space-y-1.5 text-sm text-[var(--c-text-mid)]">
        <p><strong className="text-[var(--c-text)]">Status:</strong> {validation.validationStatus}</p>
        <p><strong className="text-[var(--c-text)]">Completion:</strong> {validation.completionPercentage}%</p>
        <p><strong className="text-[var(--c-text)]">Readiness:</strong> {validation.readinessScore}%</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-bold text-[var(--c-text)] mb-2">Missing Documents</h3>
        {validation.missingDocuments.length === 0 ? (
          <p className="text-sm text-[var(--c-success)]">No missing documents.</p>
        ) : (
          <ul className="list-disc ml-5 space-y-1 text-sm text-[var(--c-text-mid)]">
            {validation.missingDocuments.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-sm font-bold text-[var(--c-text)] mb-2">Recommendations</h3>
        <ul className="list-disc ml-5 space-y-1 text-sm text-[var(--c-text-mid)]">
          {validation.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default DocumentValidationPanel;