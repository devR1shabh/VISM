import { useState } from "react";
import { parseDocument } from "../../services/documentParser";

function DocumentUploadPanel({
  documents = [],
}) {
  const [uploadedFiles, setUploadedFiles] =
    useState({});

  const [parsedDocuments, setParsedDocuments] =
    useState({});

  const handleUpload = (
    documentName,
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const parsedResult =
      parseDocument(file.name);

    setUploadedFiles((prev) => ({
      ...prev,
      [documentName]: file.name,
    }));

    setParsedDocuments((prev) => ({
      ...prev,
      [documentName]: parsedResult,
    }));
  };

  const uploadedCount =
    Object.keys(uploadedFiles).length;

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
        Document Upload Center
      </h2>

      <div className="mb-6">

        <p className="font-medium">
          Uploaded: {uploadedCount} / {totalCount}
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="text-sm text-gray-600 mt-2">
          {progress}% Complete
        </p>

      </div>

      <div className="space-y-4">

        {documents.map((doc) => (
          <div
            key={doc}
            className="border rounded-lg p-4"
          >

            <div className="flex justify-between items-center">

              <div>

                <h3 className="font-medium">
                  {doc}
                </h3>

                {uploadedFiles[doc] ? (
                  <>
                    <p className="text-green-600 text-sm mt-1">
                      Uploaded: {uploadedFiles[doc]}
                    </p>

                    <p className="text-blue-600 text-sm mt-1">
                      Type: {
                        parsedDocuments[doc]?.type
                      }
                    </p>

                    <p className="text-gray-600 text-sm">
                      Status: {
                        parsedDocuments[doc]?.status
                      }
                    </p>

                    {parsedDocuments[doc]
                      ?.extractedData &&
                      Object.entries(
                        parsedDocuments[doc]
                          .extractedData
                      ).map(
                        ([key, value]) => (
                          <p
                            key={key}
                            className="text-xs text-gray-500"
                          >
                            {key}: {value}
                          </p>
                        )
                      )}
                  </>
                ) : (
                  <p className="text-red-500 text-sm mt-1">
                    Not Uploaded
                  </p>
                )}

              </div>

              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">

                Upload

                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    handleUpload(
                      doc,
                      e
                    )
                  }
                />

              </label>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default DocumentUploadPanel;