import { Link } from "react-router-dom";
import { useCase } from "../context/CaseContext";
import ApplicantProfile from "../components/output/ApplicantProfile";

function Documents() {
  const { caseData, uploadedDocuments } = useCase();

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No Active Case Found
          </h2>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create New Case
          </Link>
        </div>
      </div>
    );
  }

  const validDocuments = uploadedDocuments.filter((doc) => doc.valid);
  const invalidDocuments = uploadedDocuments.filter((doc) => !doc.valid);

  const requiredDocuments = caseData.analysis?.documents || [];
  const uploadedRequiredNames = validDocuments.map((d) => d.requiredDocument);
  const missingDocuments = requiredDocuments.filter(
    (doc) => !uploadedRequiredNames.includes(doc)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Document Repository
          </h1>

          <div className="flex gap-3">
            <Link
              to="/analysis"
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              ← Analysis
            </Link>
            <Link
              to="/tasks"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Tasks →
            </Link>
          </div>
        </div>

        {/* Section 1: Applicant Profile */}
        <div className="mb-6">
          <ApplicantProfile
            caseData={caseData}
            uploadedDocuments={uploadedDocuments}
          />
        </div>

        {/* Sections 2–4: Document lists */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Valid documents */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
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
                {validDocuments.map((doc, i) => (
                  <div
                    key={i}
                    className="border border-green-100 bg-green-50 rounded-lg p-3"
                  >
                    <p className="text-sm font-semibold text-gray-700">
                      {doc.requiredDocument}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      ✓ Validated
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invalid documents */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
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
                {invalidDocuments.map((doc, i) => (
                  <div
                    key={i}
                    className="border border-red-100 bg-red-50 rounded-lg p-3"
                  >
                    <p className="text-sm font-semibold text-gray-700">
                      {doc.requiredDocument}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Uploaded: {doc.fileName}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Detected as: {doc.detectedType}
                    </p>
                    <p className="text-xs text-red-600 font-medium">
                      ✗ Wrong document type
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missing documents */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
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
                    <p className="text-sm font-semibold text-gray-700">
                      {doc}
                    </p>
                    <p className="text-xs text-orange-600 mt-1 font-medium">
                      ⚠ Not yet uploaded
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Documents;