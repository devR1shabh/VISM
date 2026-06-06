import { useState } from "react";

function DocumentChecklist({ documents = [] }) {
  const [completed, setCompleted] = useState([]);

  const toggleDocument = (document) => {
    if (completed.includes(document)) {
      setCompleted(
        completed.filter(
          (item) => item !== document
        )
      );
    } else {
      setCompleted([
        ...completed,
        document,
      ]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-3">
        Required Documents
      </h2>

      <p className="mb-4 text-gray-600">
        Progress: {completed.length} / {documents.length}
      </p>

      <div className="space-y-3">

        {documents.map((doc) => (
          <label
            key={doc}
            className="flex items-center gap-3"
          >
            <input
              type="checkbox"
              checked={completed.includes(doc)}
              onChange={() =>
                toggleDocument(doc)
              }
            />

            <span
              className={
                completed.includes(doc)
                  ? "line-through text-gray-500"
                  : ""
              }
            >
              {doc}
            </span>

          </label>
        ))}

      </div>

    </div>
  );
}

export default DocumentChecklist;