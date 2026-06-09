// server/services/documentVerificationService.js

import Groq from "groq-sdk";
import dotenv from "dotenv";
import { extractTextFromImage } from "./ocrSpaceService.js";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const VALID_DOCUMENT_TYPES = ["Resume", "Academic Transcript", "Bank Statement"];

function buildClassificationPrompt(ocrText, expectedDocumentType) {
  return `You are a document classification expert for a visa immigration system.

You will be given raw OCR text extracted from an uploaded document.

Your task:
1. Analyze the OCR text carefully.
2. Determine what type of document this is.
3. Assign a confidence score (0-100) for your classification.

Document types you must choose from:
- Resume
- Academic Transcript
- Bank Statement
- Unknown

Classification indicators:

Resume:
- Contains sections like Experience, Education, Skills, Projects, Certifications
- Lists employment history, internships, job titles
- Has a professional profile or summary section

Academic Transcript:
- Contains semester records, GPA, CGPA, credits
- Lists courses, grades, academic records
- Issued by a university or educational institution

Bank Statement:
- Contains account number, balance, transactions
- Lists debit/credit entries with dates and amounts
- Shows statement period, opening/closing balance
- Issued by a bank or financial institution

Unknown:
- Use this if the text is too unclear, too short, or does not match any of the above.

Expected document type from the user: "${expectedDocumentType}"

Rules:
- Return ONLY valid JSON. No markdown. No explanation. No extra text.
- documentType must be exactly one of: "Resume", "Academic Transcript", "Bank Statement", "Unknown"
- confidence must be a number between 0 and 100
- valid must be true only if documentType matches the expected document type AND confidence >= 50

Return this exact JSON structure:
{
  "documentType": "Resume",
  "confidence": 87,
  "valid": true
}

OCR Text to analyze:
"""
${ocrText.slice(0, 3000)}
"""`;
}

export async function verifyDocument(imageBuffer, documentType) {
  // Step 1 — validate document type is supported
  if (!VALID_DOCUMENT_TYPES.includes(documentType)) {
    return {
      documentType,
      valid: false,
      confidence: 0,
      error: `Unsupported document type: ${documentType}`,
    };
  }

  // Step 2 — OCR extraction
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

  if (!ocrText || ocrText.trim().length < 20) {
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

  // Step 3 — Groq LLM classification
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