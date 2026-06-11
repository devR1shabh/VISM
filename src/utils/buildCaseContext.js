// src/utils/buildCaseContext.js
//
// Generic case context builder.
// Always reads the full CaseContext state.
// When new features are added (tasks, notes, readiness score, etc.),
// add them here and Navi gains access automatically.

import { normalizeUploadedDocuments } from "./documentUtils.js";

const QUICK_TEMPLATES = [
  "What are the risks associated with this application?",
  "What should I prepare before submitting?",
  "What common mistakes should I avoid?",
  "What are the next steps in my visa journey?",
  "Explain the visa process for my visa type.",
  "Give me a checklist for this application.",
  "What should I know about living in this destination country?",
  "What can cause delays?",
];

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

  const normalizedDocuments = normalizeUploadedDocuments(uploadedDocuments);
  const requiredDocuments = caseData.analysis?.documents || [];

  // Extract passport data from uploaded documents
  // Passport is the ONLY trusted identity source
  const passportDoc = normalizedDocuments.find(
    (doc) => doc.requiredDocument === "Passport" && doc.valid && doc.passportData
  );

  const passportData = passportDoc ? passportDoc.passportData : null;

  // Build document summary — generic, works for any document type
  const documentSummary = normalizedDocuments.map((doc) => ({
    requiredDocument: doc.requiredDocument,
    fileName: doc.fileName,
    valid: doc.valid,
    confidence: doc.confidence,
    uploadedAt: doc.uploadedAt,
    // Deliberately exclude passportData fields from non-passport docs
    // to prevent personal info leakage into the prompt
  }));

  const validUploadedDocuments = documentSummary
    .filter((doc) => doc.valid && requiredDocuments.includes(doc.requiredDocument))
    .map((doc) => doc.requiredDocument);

  const missingRequiredDocuments = requiredDocuments.filter(
    (requiredDocument) => !validUploadedDocuments.includes(requiredDocument)
  );

  return {
    caseId: caseData.id || null,
    visaType: caseData.visaType || caseData.caseDetails?.visaType || null,
    country: caseData.country || caseData.caseDetails?.country || null,
    description: caseData.description || caseData.caseDetails?.description || null,
    status: caseData.status || "In Progress",
    passportData,
    requiredDocuments,
    missingRequiredDocuments,
    validUploadedDocuments,
    uploadedDocuments: documentSummary,
    analysis: caseData.analysis || null,
  };
}

export function getSuggestedQuestions() {
  return QUICK_TEMPLATES;
}
