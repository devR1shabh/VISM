import { useCase } from "../context/CaseContext";
import { deriveDocumentSummary } from "../engines/readinessEngine";

import ApplicantProfile from "../components/output/ApplicantProfile";

function Documents() {
  const {
    caseData,
    uploadedDocuments,
    activityFeed,
  } = useCase();

  const requiredDocuments =
    caseData.analysis?.documents || [];

  const {
    documents: normalizedDocuments,
    missing: missingDocuments,
  } = deriveDocumentSummary(requiredDocuments, uploadedDocuments);

  const validDocuments = normalizedDocuments.filter((doc) => doc.valid);
  const invalidDocuments = normalizedDocuments.filter((doc) => !doc.valid);

  return (
    <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Document Repository
          </h1>
        </div>

        {/* Applicant Profile */}

        <div className="mb-6">
          <ApplicantProfile
            caseData={caseData}
            uploadedDocuments={uploadedDocuments}
          />
        </div>

        {/* Documents Grid */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          {/* Valid Documents */}

          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-green-500" />

              <h2 className="text-lg font-bold text-green-700">
                Valid Documents
              </h2>

              <span className="ml-auto bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {validDocuments.length}
              </span>
            </div>

            {validDocuments.length === 0 ? (
              <p className="text-sm text-gray-400">
                No valid documents uploaded yet.
              </p>
            ) : (
              <div className="space-y-3">

                {validDocuments.map((doc) => (
                  <div
                    key={doc.requiredDocument}
                    className="border border-green-100 bg-green-50 rounded-lg p-3"
                  >

                    <p className="text-sm font-semibold">
                      {doc.requiredDocument}
                    </p>

                    <p className="text-xs text-gray-500">
                      {doc.fileName}
                    </p>

                    <p className="text-xs text-green-600 mt-1 font-medium">
                      ✓ Validated
                    </p>

                    {doc.uploadedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Uploaded:
                        {" "}
                        {new Date(
                          doc.uploadedAt
                        ).toLocaleString()}
                      </p>
                    )}

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Invalid Documents */}

          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500" />

              <h2 className="text-lg font-bold text-red-700">
                Invalid Documents
              </h2>

              <span className="ml-auto bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {invalidDocuments.length}
              </span>
            </div>

            {invalidDocuments.length === 0 ? (
              <p className="text-sm text-gray-400">
                No invalid documents.
              </p>
            ) : (
              <div className="space-y-3">

                {invalidDocuments.map((doc) => (
                  <div
                    key={doc.requiredDocument}
                    className="border border-red-100 bg-red-50 rounded-lg p-3"
                  >

                    <p className="text-sm font-semibold">
                      {doc.requiredDocument}
                    </p>

                    <p className="text-xs text-gray-500">
                      Uploaded: {doc.fileName}
                    </p>

                    <p className="text-xs text-red-600">
                      Detected as: {doc.detectedType}
                    </p>

                    {doc.uploadedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Uploaded:
                        {" "}
                        {new Date(
                          doc.uploadedAt
                        ).toLocaleString()}
                      </p>
                    )}

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Missing Documents */}

          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-orange-500" />

              <h2 className="text-lg font-bold text-orange-700">
                Missing Documents
              </h2>

              <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {missingDocuments.length}
              </span>
            </div>

            {missingDocuments.length === 0 ? (
              <p className="text-sm text-gray-400">
                All required documents uploaded.
              </p>
            ) : (
              <div className="space-y-3">

                {missingDocuments.map((doc, i) => (
                  <div
                    key={i}
                    className="border border-orange-100 bg-orange-50 rounded-lg p-3"
                  >

                    <p className="text-sm font-semibold">
                      {doc}
                    </p>

                    <p className="text-xs text-orange-600 mt-1">
                      ⚠ Not yet uploaded
                    </p>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

        {/* Activity Feed */}

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            Recent Activity
          </h2>

          {activityFeed.length === 0 ? (
            <p className="text-gray-500">
              No activity recorded yet.
            </p>
          ) : (
            <div className="space-y-3">

              {activityFeed
                .slice(0, 10)
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r"
                  >

                    <p className="font-medium">
                      {activity.message}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(
                        activity.timestamp
                      ).toLocaleString()}
                    </p>

                  </div>
                ))}

            </div>
          )}

        </div>
    </div>
  );
}

export default Documents;