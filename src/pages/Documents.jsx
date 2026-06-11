// src/pages/Documents.jsx

import { useCase } from "../context/CaseContext";
import DocumentGuidelines from "../components/upload/DocumentGuidelines";
import PassportUploadSection from "../components/upload/PassportUploadSection";
import SecondaryDocSection from "../components/upload/SecondaryDocSection";
import DocumentProgress from "../components/upload/DocumentProgress";

const SECONDARY_DOCS = {
  "Student Visa": "Academic Transcript",
  "Work Visa": "Resume",
  "Tourist Visa": "Bank Statement",
};

function Documents() {
  const { caseData } = useCase();
  const secondaryDoc = SECONDARY_DOCS[caseData?.visaType] || null;

  return (
    <main className="max-w-5xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-1">
          Step 3 of 6
        </p>
        <h1 className="text-4xl font-bold text-gray-800">Document Upload</h1>
        <p className="text-gray-500 mt-2">
          Upload and verify all required documents for your{" "}
          <strong>{caseData?.visaType}</strong> application to{" "}
          <strong>{caseData?.country}</strong>.
        </p>
      </div>

      {/* Section 1 — Guidelines */}
      <DocumentGuidelines />

      {/* Section 2 — Passport */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Section 2 — Passport
      </p>
      <PassportUploadSection />

      {/* Section 3 — Secondary Document */}
      {secondaryDoc && (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Section 3 — {secondaryDoc}
          </p>
          <div className="mb-8">
            <SecondaryDocSection documentName={secondaryDoc} />
          </div>
        </>
      )}

      {/* Section 4 — Progress */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Section 4 — Progress
      </p>
      <DocumentProgress />
    </main>
  );
}

export default Documents;