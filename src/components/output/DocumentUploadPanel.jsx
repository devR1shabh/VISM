import { useState } from "react";
import { parseDocument } from "../../services/documentParser";
import { useCase } from "../../context/CaseContext";

function DocumentUploadPanel({
  documents = [],
}) {
  const {
    addDocument,
  } = useCase();

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

    const detectedType =
      parsedResult.type;

    const isValid =
      detectedType === documentName;

    const documentRecord = {
      requiredDocument:
        documentName,

      fileName:
        file.name,

      detectedType,

      valid:
        isValid,
    };

    addDocument(
      documentRecord
    );

    setParsedDocuments((prev) => ({
      ...prev,
      [documentName]: {
        ...parsedResult,
        isValid,
      },
    }));

    if (isValid) {
      setUploadedFiles((prev) => ({
        ...prev,
        [documentName]:
          file.name,
      }));
    }
  };

  const uploadedCount =
    Object.keys(
      uploadedFiles
    ).length;

  const totalCount =
    documents.length;

  const progress =
    totalCount === 0
      ? 0
      : Math.round(
          (
            uploadedCount /
            totalCount
          ) * 100
        );

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Document Upload Center
      </h2>

      <div className="mb-6">

        <p className="font-medium">
          Uploaded:
          {" "}
          {uploadedCount}
          {" / "}
          {totalCount}
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{
              width:
                `${progress}%`,
            }}
          />
        </div>

        <p className="text-sm text-gray-600 mt-2">
          {progress}% Complete
        </p>

      </div>

      <div className="space-y-4">

        {documents.map(
          (doc) => (
            <div
              key={doc}
              className="border rounded-lg p-4"
            >

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="font-medium">
                    {doc}
                  </h3>

                  {uploadedFiles[
                    doc
                  ] ? (
                    <>
                      <p className="text-green-600 text-sm mt-1">
                        Uploaded:
                        {" "}
                        {
                          uploadedFiles[
                            doc
                          ]
                        }
                      </p>

                      <p className="text-blue-600 text-sm mt-1">
                        Type:
                        {" "}
                        {
                          parsedDocuments[
                            doc
                          ]?.type
                        }
                      </p>

                      <p className="text-green-600 text-sm">
                        ✓ Valid
                        Document
                      </p>
                    </>
                  ) : parsedDocuments[
                      doc
                    ] ? (
                    <>
                      <p className="text-red-600 text-sm mt-1">
                        Invalid Upload
                      </p>

                      <p className="text-gray-600 text-sm">
                        Expected:
                        {" "}
                        {doc}
                      </p>

                      <p className="text-gray-600 text-sm">
                        Detected:
                        {" "}
                        {
                          parsedDocuments[
                            doc
                          ]?.type
                        }
                      </p>
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
                    onChange={(
                      e
                    ) =>
                      handleUpload(
                        doc,
                        e
                      )
                    }
                  />

                </label>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default DocumentUploadPanel;