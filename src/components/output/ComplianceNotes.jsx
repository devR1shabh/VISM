function ComplianceNotes({ notes }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Compliance Notes
      </h2>

      <ul className="list-disc ml-5 space-y-2">
        {notes.map((note) => (
          <li key={note}>
            {note}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default ComplianceNotes;