function ComplianceNotes({ notes }) {
  return (
    <div>
      <h2 className="text-base font-bold text-[var(--c-text)] mb-4">Compliance Notes</h2>

      {(!notes || notes.length === 0) ? (
        <p className="text-sm text-[var(--c-text-muted)]">No compliance notes available.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note} className="flex items-start gap-3">
              <span className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-[var(--c-green-mid)] shrink-0" />
              <p className="text-sm text-[var(--c-text-mid)] leading-relaxed">{note}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ComplianceNotes;