import { useState } from "react";

function DocumentCollectionTracker({
  documents = [],
}) {
  const [uploadedDocs, setUploadedDocs] =
    useState([]);

  const toggleUploaded = (doc) => {
    if (uploadedDocs.includes(doc)) {
      setUploadedDocs(
        uploadedDocs.filter(
          (item) => item !== doc
        )
      );
    } else {
      setUploadedDocs([
        ...uploadedDocs,
        doc,
      ]);
    }
  };

  const uploadedCount =
    uploadedDocs.length;

  const totalCount =
    documents.length;

  const progress =
    totalCount === 0
      ? 0
      : Math.round(
          (uploadedCount / totalCount) * 100
        );

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Document Collection Status
      </h2>

      <div className="mb-4">
        <p className="font-medium">
          Uploaded: {uploadedCount} /{" "}
          {totalCount}
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="text-sm text-gray-600 mt-2">
          {progress}% Complete
        </p>
      </div>

      <div className="space-y-3">

        {documents.map((doc) => (
          <div
            key={doc}
            className="flex items-center justify-between border-b pb-2"
          >
            <span>{doc}</span>

            <button
              onClick={() =>
                toggleUploaded(doc)
              }
              className={`px-3 py-1 rounded text-white ${
                uploadedDocs.includes(doc)
                  ? "bg-green-600"
                  : "bg-gray-500"
              }`}
            >
              {uploadedDocs.includes(doc)
                ? "Uploaded"
                : "Pending"}
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default DocumentCollectionTracker;