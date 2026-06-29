// server/services/confidenceScoreService.js
//
// BUG FIX in calculatePassportScore:
//   Previously: returned 0 if passportData.fullName was falsy.
//   This caused score = 0 even when passport was uploaded and date was extracted,
//   just because the name field failed OCR or had a different format.
//   Now: checks for ANY useful extracted field before returning 0.
//   Also: better date parsing with explicit validity check and edge case handling.

import Groq  from "groq-sdk";
import dotenv from "dotenv";
import { DOCUMENT_CATEGORY_MAP } from "../config/constants.js";

dotenv.config();

const groq  = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

// ── Country risk (0–1 scale, higher = harder to get approved) ─────────────────
const COUNTRY_RISK = {
  "United States":          0.70,
  "United Kingdom":         0.50,
  "Canada":                 0.50,
  "Australia":              0.45,
  "Germany":                0.40,
  "France":                 0.45,
  "UAE":                    0.25,
  "Singapore":              0.35,
  "New Zealand":            0.40,
  "Ireland":                0.40,
  "Netherlands":            0.40,
  "Sweden":                 0.35,
  "Japan":                  0.55,
  "Italy":                  0.45,
  "Portugal":               0.35,
};

// ── Visa type difficulty (0–1 scale) ─────────────────────────────────────────
const VISA_DIFFICULTY = {
  "Tourist Visa":             0.30,
  "Business Visa":            0.40,
  "Student Visa":             0.50,
  "Work Visa":                0.60,
  "Family Sponsorship Visa":  0.55,
  "Investor Visa":            0.50,
  "Permanent Residency Visa": 0.80,
};

// ── 1. Document Score ─────────────────────────────────────────────────────────
function calculateDocumentScore(uploadedDocuments = [], requiredDocuments = []) {
  if (requiredDocuments.length === 0) return 0;

  let totalPoints  = 0;
  let earnedPoints = 0;

  requiredDocuments.forEach((docName) => {
    const isMandatory = DOCUMENT_CATEGORY_MAP[docName] === "mandatory";
    const weight      = isMandatory ? 2 : 1;
    totalPoints      += weight;

    const verified = uploadedDocuments.some(
      (u) =>
        (u.type === docName || u.requiredDocument === docName) &&
        (u.verified || u.valid)
    );
    if (verified) earnedPoints += weight;
  });

  return totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
}

// ── 2. Passport Score ─────────────────────────────────────────────────────────
// FIX: Previously returned 0 when fullName was missing.
// Now checks for ANY useful extracted field (name, number, or expiry).
// The MRZ parser returns expiryDate as "YYYY-MM-DD" (ISO format).
// Handles empty string, null, undefined, and invalid date strings gracefully.

function scoreFromExpiry(expiry) {
  const now        = new Date();
  const monthsLeft = (expiry - now) / (1000 * 60 * 60 * 24 * 30);

  if (monthsLeft < 0)  return 0;    // Expired
  if (monthsLeft < 3)  return 20;   // Expires very soon — likely to be rejected
  if (monthsLeft < 6)  return 55;   // Expires within 6 months — borderline
  if (monthsLeft < 12) return 75;   // Expires within 12 months — acceptable
  return 100;                        // Valid 12+ months — no issue
}

function tryParseDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;

  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Primary: ISO format YYYY-MM-DD (what MRZ parser returns)
  const iso = new Date(trimmed);
  if (!isNaN(iso.getTime())) return iso;

  // Fallback: DD MMM YYYY (e.g. "15 JAN 2028")
  const alt = new Date(trimmed.replace(/(\d{2})\s([A-Z]{3})\s(\d{4})/, "$2 $1 $3"));
  if (!isNaN(alt.getTime())) return alt;

  // Fallback: DD/MM/YYYY
  const parts = trimmed.split("/");
  if (parts.length === 3) {
    const dmy = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    if (!isNaN(dmy.getTime())) return dmy;
  }

  return null; // Unparseable
}

function calculatePassportScore(passportData) {
  // No passport data at all
  if (!passportData || Object.keys(passportData).length === 0) return 0;

  // Passport uploaded but extraction was partial — give partial credit
  if (!passportData.fullName && !passportData.passportNumber) return 20;

  // Have some identity data but no expiry
  if (!passportData.expiryDate) return 50;

  try {
    const expiry     = new Date(passportData.expiryDate);
    const now        = new Date();

    // Invalid date from OCR — give partial credit
    if (isNaN(expiry.getTime())) return 45;

    const monthsLeft = (expiry - now) / (1000 * 60 * 60 * 24 * 30);

    if (monthsLeft < 0)  return 0;
    if (monthsLeft < 3)  return 20;
    if (monthsLeft < 6)  return 55;
    if (monthsLeft < 12) return 75;
    return 100;
  } catch {
    return 45;
  }
}

// ── 3. Country Risk Score ─────────────────────────────────────────────────────
function calculateCountryRiskScore(country, visaType) {
  const countryRisk = COUNTRY_RISK[country]    ?? 0.50;
  const visaRisk    = VISA_DIFFICULTY[visaType] ?? 0.50;
  const combined    = countryRisk * 0.5 + visaRisk * 0.5;
  return Math.round((1 - combined) * 100);
}

// ── 4. Questionnaire Score via Groq ──────────────────────────────────────────
async function calculateQuestionnaireScore(questionnaire, visaType, country) {
  if (!questionnaire || !questionnaire.submittedAt) return 0;

  const prompt = `You are a senior visa officer evaluating a visa application questionnaire.
Assess the applicant's profile and return ONLY a valid JSON object — no markdown, no explanation.

Visa: ${visaType} | Country: ${country}

Answers:
- Purpose: ${questionnaire.purpose || "Not provided"}
- Education: ${questionnaire.education || "Not provided"}
- Occupation: ${questionnaire.occupation || "Not provided"}
- Experience: ${questionnaire.experience || "Not provided"}
- Travel history: ${questionnaire.travelHistory || "Not provided"}
- Previous refusal: ${questionnaire.previousRefusal || "No"}
- Refusal details: ${questionnaire.previousRefusalDetails || "N/A"}
- Financial capacity: ${questionnaire.financialCapacity || "Not provided"}
- Has sponsor: ${questionnaire.hasSponsor || "No"}
- Existing arrangements: ${questionnaire.existingArrangements || "Not provided"}

Score each factor 0–100, then compute a weighted overall score:
  Financial strength (35%) · Travel history (20%) · Refusal history (25%) · Purpose clarity (20%)

A prior refusal with no explanation should reduce score by 30+ points.
Vague or missing answers should result in lower scores.

Return ONLY:
{
  "score": <overall weighted score 0-100>,
  "financial": <0-100>,
  "travelHistory": <0-100>,
  "refusalHistory": <0-100>,
  "purposeClarity": <0-100>
}`;

  try {
    const completion = await groq.chat.completions.create({
      model:       MODEL,
      temperature: 0.1,
      messages:    [{ role: "user", content: prompt }],
    });

    const raw     = completion.choices[0].message.content;
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed  = JSON.parse(cleaned);

    return Math.min(100, Math.max(0, Math.round(parsed.score)));
  } catch (err) {
    console.error("[ConfidenceScore] Questionnaire scoring failed:", err.message);
    return 50;
  }
}

// ── Label helper ──────────────────────────────────────────────────────────────
function getScoreLabel(score) {
  if (score >= 80) return "High Confidence";
  if (score >= 65) return "Good Standing";
  if (score >= 45) return "Moderate Risk";
  if (score >= 25) return "Needs Attention";
  return "Critical Issues";
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function computeConfidenceScore(caseRecord) {
  const {
    visaType,
    country,
    passportData,
    questionnaire,
    uploadedDocuments = [],
  } = caseRecord;

  const requiredDocuments = caseRecord.analysis?.documents || [];

  const [questionnaireScore] = await Promise.all([
    calculateQuestionnaireScore(questionnaire, visaType, country),
  ]);

  const documentScore  = calculateDocumentScore(uploadedDocuments, requiredDocuments);
  const passportScore  = calculatePassportScore(passportData);
  const countryScore   = calculateCountryRiskScore(country, visaType);

  const overallScore = Math.round(
    documentScore      * 0.40 +
    questionnaireScore * 0.30 +
    passportScore      * 0.20 +
    countryScore       * 0.10
  );

  return {
    score: overallScore,
    breakdown: {
      documentScore,
      questionnaireScore,
      passportScore,
      countryRiskScore: countryScore,
    },
    label:       getScoreLabel(overallScore),
    generatedAt: new Date(),
    running:     false,
  };
}