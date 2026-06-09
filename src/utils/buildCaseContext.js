// src/utils/buildCaseContext.js
//
// Generic case context builder.
// Always reads the full CaseContext state.
// When new features are added (tasks, notes, readiness score, etc.),
// add them here and the copilot gains access automatically.

export function buildCaseContext(caseData, uploadedDocuments) {
  if (!caseData) {
    return {
      visaType: null,
      country: null,
      description: null,
      caseId: null,
      status: null,
      passportData: null,
      uploadedDocuments: [],
      analysis: null,
    };
  }

  // Extract passport data from uploaded documents
  // Passport is the ONLY trusted identity source
  const passportDoc = uploadedDocuments.find(
    (doc) => doc.requiredDocument === "Passport" && doc.valid && doc.passportData
  );

  const passportData = passportDoc ? passportDoc.passportData : null;

  // Build document summary — generic, works for any document type
  const documentSummary = uploadedDocuments.map((doc) => ({
    requiredDocument: doc.requiredDocument,
    fileName: doc.fileName,
    valid: doc.valid,
    confidence: doc.confidence,
    uploadedAt: doc.uploadedAt,
    // Deliberately exclude passportData fields from non-passport docs
    // to prevent personal info leakage into the prompt
  }));

  return {
    caseId: caseData.id || null,
    visaType: caseData.visaType || caseData.caseDetails?.visaType || null,
    country: caseData.country || caseData.caseDetails?.country || null,
    description: caseData.description || caseData.caseDetails?.description || null,
    status: caseData.status || "In Progress",
    passportData,
    uploadedDocuments: documentSummary,
    analysis: caseData.analysis || null,
  };
}

// Returns suggested questions based on visa type
export function getSuggestedQuestions(visaType) {
  const universal = [
    "Summarize my application",
    "What documents have I uploaded?",
    "What documents are missing?",
    "Am I ready for submission?",
    "What risks currently exist?",
    "What should I do next?",
  ];

  const byVisaType = {
    "Student Visa": [
      "Can I work while studying?",
      "What are common student visa requirements?",
      "What is the processing time?",
    ],
    "Work Visa": [
      "What are work visa requirements?",
      "What could delay my application?",
      "What additional documents are commonly requested?",
    ],
    "Tourist Visa": [
      "Why is a hotel reservation requested?",
      "What documents are commonly required?",
      "What are common reasons for rejection?",
    ],
    "Permanent Residency": [
      "What are the eligibility requirements?",
      "How long does permanent residency processing take?",
      "What documents are typically required?",
    ],
    "Family Sponsorship": [
      "What is required from the sponsor?",
      "How long does family sponsorship take?",
      "What documents does the applicant need?",
    ],
  };

  const specific = byVisaType[visaType] || [];

  return { universal, specific };
}