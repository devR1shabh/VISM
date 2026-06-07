/**
 * Readiness Engine
 *
 * Pure utility for calculating application readiness.
 * Always derived from actual document state — never hardcoded.
 *
 * Designed to be replaceable: future AI scoring services
 * (OCR, LLM extraction, risk assessment) plug in here
 * by extending or replacing calculateReadiness.
 */

/**
 * @param {number} validDocumentCount  — documents that passed validation
 * @param {number} requiredDocumentCount — total documents required for visa type
 * @returns {{ score: number, label: string, color: string }}
 */
export function calculateReadiness(
  validDocumentCount,
  requiredDocumentCount
) {
  if (
    requiredDocumentCount === 0 ||
    typeof validDocumentCount !== "number" ||
    typeof requiredDocumentCount !== "number"
  ) {
    return { score: 0, label: "Not Started", color: "gray" };
  }

  const score = Math.round(
    (validDocumentCount / requiredDocumentCount) * 100
  );

  const clamped = Math.min(100, Math.max(0, score));

  let label;
  let color;

  if (clamped === 0) {
    label = "Not Started";
    color = "gray";
  } else if (clamped < 40) {
    label = "Early Stage";
    color = "red";
  } else if (clamped < 70) {
    label = "In Progress";
    color = "amber";
  } else if (clamped < 100) {
    label = "Nearly Ready";
    color = "blue";
  } else {
    label = "Ready to Submit";
    color = "green";
  }

  return { score: clamped, label, color };
}

/**
 * Derives document counts from context state.
 * Keeps calculation logic in one place.
 *
 * @param {string[]} requiredDocuments  — from analysis.documents
 * @param {Array}   uploadedDocuments  — from CaseContext
 * @returns {{ required: number, valid: number, invalid: number, missing: string[] }}
 */
export function deriveDocumentSummary(
  requiredDocuments = [],
  uploadedDocuments = []
) {
  const validDocs = uploadedDocuments.filter((d) => d.valid);
  const invalidDocs = uploadedDocuments.filter((d) => !d.valid);

  const uploadedRequiredNames = validDocs.map(
    (d) => d.requiredDocument
  );

  const missing = requiredDocuments.filter(
    (doc) => !uploadedRequiredNames.includes(doc)
  );

  return {
    required: requiredDocuments.length,
    valid: validDocs.length,
    invalid: invalidDocs.length,
    missing,
  };
}