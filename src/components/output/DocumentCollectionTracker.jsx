import { useState } from "react";

function DocumentCollectionTracker({ documents = [] }) {
  const [uploadedDocs, setUploadedDocs] = useState([]);

  const toggleUploaded = (doc) => {
    if (uploadedDocs.includes(doc)) {
      setUploadedDocs(uploadedDocs.filter((item) => item !== doc));
    } else {
      setUploadedDocs([...uploadedDocs, doc]);
    }
  };

  const uploadedCount = uploadedDocs.length;
  const totalCount    = documents.length;
  const progress      = totalCount === 0 ? 0 : Math.round((uploadedCount / totalCount) * 100);

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">

      <h2 className="text-lg font-bold text-[var(--c-text)] mb-4">Document Collection Status</h2>

      <div className="mb-4">
        <p className="text-sm font-medium text-[var(--c-text-mid)] mb-2">
          Uploaded: {uploadedCount} / {totalCount}
        </p>
        <div className="w-full bg-[var(--c-border)] rounded-full h-2">
          <div
            className="bg-[var(--c-green)] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[var(--c-text-muted)] mt-1.5">{progress}% Complete</p>
      </div>

      <div className="space-y-2.5">
        {documents.map((doc) => (
          <div
            key={doc}
            className="flex items-center justify-between border-b border-[var(--c-border)] pb-2.5"
          >
            <span className="text-sm text-[var(--c-text-mid)]">{doc}</span>
            <button
              onClick={() => toggleUploaded(doc)}
              className={`px-3 py-1 rounded-[var(--r-md)] text-white text-xs font-semibold transition ${
                uploadedDocs.includes(doc)
                  ? "bg-[var(--c-green)] hover:bg-[var(--c-green-mid)]"
                  : "bg-[var(--c-text-muted)] hover:bg-[var(--c-text)]"
              }`}
            >
              {uploadedDocs.includes(doc) ? "Uploaded" : "Pending"}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default DocumentCollectionTracker;