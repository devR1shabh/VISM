function ComplianceNotes({ notes }) {
  return (
    <aside className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 p-6 shadow-[0_20px_60px_-20px_rgba(34,231,197,0.12)] backdrop-blur-xl">

      <div className="mb-3">
        <p className="text-sm uppercase tracking-[0.28em] text-[#22E7C5]">Compliance Notes</p>
      </div>

      <ul className="space-y-3">
        {notes.map((note) => (
          <li key={note} className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-[#22E7C5] flex-shrink-0" />
            <p className="text-sm text-[#B8C5D1]">{note}</p>
          </li>
        ))}
      </ul>

    </aside>
  );
}

export default ComplianceNotes;