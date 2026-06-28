// server/config/constants.js
// ══════════════════════════════════════════════════════════════════════════════
// Single source of truth for all shared application constants.
//
// Rules:
//   1. Import from here in ALL server-side services and controllers.
//   2. The frontend reads these via GET /api/config — never duplicate here.
//   3. Adding a document? Add it here only. It propagates everywhere.
// ══════════════════════════════════════════════════════════════════════════════

export const MANDATORY_DOCUMENTS = [
  "Passport",
  "Bank Statement",
  "Employment Letter",
  "Resume / CV",
  "Academic Transcript",
  "Degree Certificate",
  "Statement of Purpose",
  "Police Clearance Certificate",
  "Address Proof",
];

export const SUPPORTING_DOCUMENTS = [
  "Passport Size Photograph",
  "National ID Card",
  "Birth Certificate",
  "Travel History Document",
  "Proof of Funds",
  "Medical Certificate",
];

// Combined flat list — mandatory first, then supporting.
export const ALL_DOCUMENTS = [...MANDATORY_DOCUMENTS, ...SUPPORTING_DOCUMENTS];

export const VISA_TYPES = [
  "Student Visa",
  "Tourist Visa",
  "Work Visa",
  "Permanent Residency Visa",
  "Business Visa",
  "Family Sponsorship Visa",
  "Investor Visa",
];

// Maps each document name → its category.
// Used by Feature 2 (UI), Feature 8 (confidence score), Feature 9 (processor view).
export const DOCUMENT_CATEGORY_MAP = {
  ...Object.fromEntries(MANDATORY_DOCUMENTS.map((d) => [d, "mandatory"])),
  ...Object.fromEntries(SUPPORTING_DOCUMENTS.map((d) => [d, "supporting"])),
};