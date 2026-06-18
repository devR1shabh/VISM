// server/services/documentVerificationService.js
// Expanded to handle all 14 non-passport document types.
// Architecture unchanged: OCR extraction → Groq LLM classification → valid/invalid result.
// Passport verification is handled separately by passportExtractionService.js.

import Groq from "groq-sdk";
import dotenv from "dotenv";
import { extractTextFromImage } from "./ocrSpaceService.js";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// All 14 non-passport document types that can be verified.
// Passport is excluded — it uses its own dedicated passportExtractionService.
const VALID_DOCUMENT_TYPES = [
  "Passport Size Photograph",
  "National ID Card",
  "Birth Certificate",
  "Address Proof",
  "Resume / CV",
  "Academic Transcript",
  "Degree Certificate",
  "Employment Letter",
  "Bank Statement",
  "Proof of Funds",
  "Travel History Document",
  "Statement of Purpose",
  "Police Clearance Certificate",
  "Medical Certificate",
];

// Classification indicators for every supported document type.
// Used inside the Groq prompt to help the LLM identify each type correctly.
const DOCUMENT_INDICATORS = {
  "Passport Size Photograph": [
    "Shows a person's face against a plain background",
    "Standard photo dimensions (35mm x 45mm or similar)",
    "No text content — purely a portrait photograph",
    "Used for identity documents and visa applications",
  ],
  "National ID Card": [
    "Contains full name, date of birth, and ID number",
    "Issued by a government authority",
    "Contains a photo of the holder",
    "Shows nationality or country of issue",
  ],
  "Birth Certificate": [
    "Contains full name at birth and date of birth",
    "Lists names of parents or guardians",
    "Issued by a civil registry or government authority",
    "Includes place of birth and registration number",
  ],
  "Address Proof": [
    "Contains a residential address",
    "Recent date (utility bill, bank letter, or government letter)",
    "Issued to the applicant at their current address",
    "Examples: electricity bill, water bill, council tax, rent agreement",
  ],
  "Resume / CV": [
    "Contains sections like Experience, Education, Skills, Projects, Certifications",
    "Lists employment history, internships, or job titles",
    "Has a professional profile or summary section",
    "Includes contact information and career objective",
  ],
  "Academic Transcript": [
    "Contains semester records, GPA, CGPA, or credits",
    "Lists courses, grades, and academic records",
    "Issued by a university or educational institution",
    "Shows student name, ID, and program details",
  ],
  "Degree Certificate": [
    "States that the holder has been awarded a degree or diploma",
    "Issued by a university, college, or educational authority",
    "Contains the name of the qualification and the conferring institution",
    "Includes date of award and authorizing signatures or seals",
  ],
  "Employment Letter": [
    "Issued by an employer on company letterhead",
    "Confirms employment status, job title, and salary",
    "Contains start date and employment type (full-time, part-time, etc.)",
    "Signed by HR or a company representative",
  ],
  "Bank Statement": [
    "Contains account number, balance, and transactions",
    "Lists debit and credit entries with dates and amounts",
    "Shows statement period, opening/closing balance",
    "Issued by a bank or financial institution",
  ],
  "Proof of Funds": [
    "Shows available funds or assets",
    "May be a bank balance certificate, fixed deposit statement, or investment proof",
    "Issued by a bank, financial institution, or investment firm",
    "Confirms the amount available to support the visa application",
  ],
  "Travel History Document": [
    "Shows past international travel records",
    "Contains visa stamps, entry/exit dates, or travel permits",
    "May be a passport copy showing travel stamps or a travel history certificate",
    "Issued by an immigration authority or derived from passport stamps",
  ],
  "Statement of Purpose": [
    "Personal essay written by the applicant",
    "Explains the purpose and goals of the visa application",
    "Describes academic, professional, or personal motivation",
    "Written in first person and addressed to the immigration authority",
  ],
  "Police Clearance Certificate": [
    "Issued by a police authority or government body",
    "Confirms no criminal record or lists past offenses",
    "Contains applicant's name, date of birth, and certificate number",
    "Has official stamps or signatures from law enforcement",
  ],
  "Medical Certificate": [
    "Issued by a licensed doctor, hospital, or health authority",
    "Contains medical fitness status or health assessment results",
    "May include vaccination records or disease screening results",
    "Has doctor's name, registration number, and official stamp",
  ],
};

function buildClassificationPrompt(ocrText, expectedDocumentType) {
  // Build a focused indicator block for the expected type + brief context on others
  const expectedIndicators = DOCUMENT_INDICATORS[expectedDocumentType] || [];
  const otherTypes = VALID_DOCUMENT_TYPES.filter((t) => t !== expectedDocumentType);

  const indicatorBlock = expectedIndicators
    .map((i) => `  - ${i}`)
    .join("\n");

  const otherTypesList = otherTypes.map((t) => `"${t}"`).join(", ");

  return `You are a document classification expert for a visa immigration system.

You will be given raw OCR text extracted from an uploaded document image.

Your task:
1. Analyze the OCR text carefully.
2. Determine what type of document this is.
3. Assign a confidence score (0-100) for your classification.

The user expects this document to be: "${expectedDocumentType}"

Indicators that suggest this is a "${expectedDocumentType}":
${indicatorBlock}

Other possible document types (if the text does not match the expected type):
${otherTypesList}, "Unknown"

Rules:
- Return ONLY valid JSON. No markdown. No explanation. No extra text.
- documentType must be exactly one of the valid document types or "Unknown".
- confidence must be a number between 0 and 100.
- valid must be true ONLY if documentType exactly matches "${expectedDocumentType}" AND confidence >= 50.
- If the OCR text is very short, unclear, or appears to be a photograph with no readable text, set documentType to the expected type with confidence 70 and valid true — photographs cannot be OCR-classified but are still valid uploads.

Return this exact JSON structure:
{
  "documentType": "${expectedDocumentType}",
  "confidence": 85,
  "valid": true
}

OCR Text to analyze:
"""
${ocrText.slice(0, 3000)}
"""`;
}

export async function verifyDocument(imageBuffer, documentType) {
  // Step 1 — validate document type is in the supported list
  if (!VALID_DOCUMENT_TYPES.includes(documentType)) {
    return {
      documentType,
      valid: false,
      confidence: 0,
      error: `Unsupported document type: ${documentType}`,
    };
  }

  // Step 2 — OCR extraction (unchanged — reuses existing ocrSpaceService)
  let ocrText;
  try {
    ocrText = await extractTextFromImage(imageBuffer);
  } catch (error) {
    console.error("OCR Extraction Error:", error);
    return {
      documentType,
      valid: false,
      confidence: 0,
      error: "OCR extraction failed. Please upload a clearer image.",
    };
  }

  // Step 3 — Handle low/no OCR text (e.g. photographs, handwritten docs)
  // For document types that are primarily visual (Passport Size Photograph),
  // we accept the upload and mark it valid since OCR cannot classify images.
  if (!ocrText || ocrText.trim().length < 20) {
    if (documentType === "Passport Size Photograph") {
      return {
        documentType,
        valid: true,
        confidence: 90,
      };
    }
    return {
      documentType,
      valid: false,
      confidence: 0,
      error: "OCR returned insufficient text. Please upload a clearer image.",
    };
  }

  console.log("\n===== OCR TEXT (first 500 chars) =====");
  console.log(ocrText.slice(0, 500));
  console.log("======================================\n");

  // Step 4 — Groq LLM classification (unchanged pipeline, expanded prompt)
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "You are a document classification expert. Return valid JSON only. No markdown. No explanation.",
        },
        {
          role: "user",
          content: buildClassificationPrompt(ocrText, documentType),
        },
      ],
    });

    const raw = completion.choices[0].message.content;

    console.log("\n===== GROQ CLASSIFICATION RESPONSE =====");
    console.log(raw);
    console.log("========================================\n");

    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // Enforce valid only when detected type matches expected type and confidence is sufficient
    const valid =
      parsed.documentType === documentType && parsed.confidence >= 50;

    return {
      documentType: parsed.documentType,
      confidence: parsed.confidence,
      valid,
    };
  } catch (error) {
    console.error("Groq Classification Error:", error);
    return {
      documentType,
      valid: false,
      confidence: 0,
      error: "Classification failed. Please try again.",
    };
  }
}