import { useState } from "react";

function DocumentChecklist({ documents = [] }) {
  const [completed, setCompleted] = useState([]);

  const toggleDocument = (document) => {
    if (completed.includes(document)) {
      setCompleted(completed.filter((item) => item !== document));
    } else {
      setCompleted([...completed, document]);
    }
  };

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">

      <h2 className="text-lg font-bold text-[var(--c-text)] mb-2">Required Documents</h2>
      <p className="mb-4 text-sm text-[var(--c-text-muted)]">
        Progress: {completed.length} / {documents.length}
      </p>

      <div className="space-y-3">
        {documents.map((doc) => (
          <label key={doc} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={completed.includes(doc)}
              onChange={() => toggleDocument(doc)}
              className="accent-[var(--c-green)]"
            />
            <span className={`text-sm ${completed.includes(doc) ? "line-through text-[var(--c-text-muted)]" : "text-[var(--c-text-mid)]"}`}>
              {doc}
            </span>
          </label>
        ))}
      </div>

    </div>
  );
}

export default DocumentChecklist;