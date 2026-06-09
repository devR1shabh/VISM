import { extractTextFromImage } from "./ocrSpaceService.js";

const DOCUMENT_KEYWORDS = {
  Resume: [
    "experience",
    "education",
    "skills",
    "projects",
    "employment",
    "internship",
    "certifications",
  ],

  "Academic Transcript": [
    "transcript",
    "semester",
    "credits",
    "gpa",
    "cgpa",
    "university",
    "grade",
    "course",
  ],

  "Bank Statement": [
    "account",
    "balance",
    "transaction",
    "debit",
    "credit",
    "statement",
    "account number",
    "bank",
  ],
};

export async function verifyDocument(
  imageBuffer,
  documentType
) {
  try {
    const keywords =
      DOCUMENT_KEYWORDS[
        documentType
      ];

    if (!keywords) {
      return {
        documentType,
        valid: false,
        confidence: 0,
        matchedKeywords: [],
        error:
          `Unknown document type: ${documentType}`,
      };
    }

    const extractedText =
      await extractTextFromImage(
        imageBuffer
      );

    if (
      !extractedText ||
      extractedText.trim()
        .length === 0
    ) {
      return {
        documentType,
        valid: false,
        confidence: 0,
        matchedKeywords: [],
        error:
          "OCR returned no text. Please upload a clearer image.",
      };
    }

    const lowerText =
      extractedText.toLowerCase();

    const matchedKeywords =
      keywords.filter(
        (keyword) =>
          lowerText.includes(
            keyword.toLowerCase()
          )
      );

    const matchCount =
      matchedKeywords.length;

    let confidence = 0;

    if (matchCount >= 2)
      confidence = 60;

    if (matchCount >= 4)
      confidence = 80;

    if (matchCount >= 6)
      confidence = 95;

    const valid =
      matchCount >= 2;

    console.log(
      "\n===== DOCUMENT VERIFICATION ====="
    );

    console.log(
      "Document Type:",
      documentType
    );

    console.log(
      "Matched Keywords:",
      matchedKeywords
    );

    console.log(
      "Match Count:",
      matchCount
    );

    console.log(
      "Confidence:",
      confidence
    );

    console.log(
      "=================================\n"
    );

    return {
      documentType,
      valid,
      confidence,
      matchedKeywords,
    };
  } catch (error) {
    console.error(
      "Document Verification Error:",
      error
    );

    return {
      documentType,
      valid: false,
      confidence: 0,
      matchedKeywords: [],
      error:
        error.message,
    };
  }
}