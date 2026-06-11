import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.3-70b-versatile";
const TEMPERATURE = 0.3;

/* ─────────────────────────────────────────
   Helper: call Groq and return raw string
───────────────────────────────────────── */
async function callGroq(systemPrompt, userPrompt) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: TEMPERATURE,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
  return completion.choices[0].message.content;
}

/* ─────────────────────────────────────────
   Helper: strip markdown fences and parse JSON
───────────────────────────────────────── */
function parseJSON(raw) {
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(cleaned);
}

/* ─────────────────────────────────────────
   1. AI Application Overview
───────────────────────────────────────── */
async function generateAIOverview(visaType, country, description) {
  const system =
    "You are a senior immigration consultant. Write concise, professional summaries. Plain text only — no markdown, no bullet points.";

  const prompt = `
Visa type: ${visaType}
Destination country: ${country}
Case description: ${description}

Write a professional 2–3 sentence overview of this applicant's immigration situation.
Focus on the visa purpose and any notable context from the description.
Do NOT mention document upload status or missing documents.
Return plain text only.
`.trim();

  try {
    const raw = await callGroq(system, prompt);
    return raw
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/^#+\s/gm, "")
      .trim();
  } catch (error) {
    console.error("Groq aiOverview error:", error);
    return `${visaType} application for ${country}. AI overview temporarily unavailable.`;
  }
}

/* ─────────────────────────────────────────
   2. AI Risk Assessment
───────────────────────────────────────── */
async function generateAIRisks(visaType, country, description) {
  const system =
    "You are an immigration risk analyst. Return valid JSON only. No markdown. No explanations.";

  const prompt = `
Visa type: ${visaType}
Destination country: ${country}
Case description: ${description}

Identify up to 4 visa-specific risk factors for this application.
Base risks on the visa type and case description only.

Risk focus by visa type:
- Tourist Visa: travel intent credibility, financial sufficiency, overstay risk, ties to home country
- Student Visa: academic eligibility, financial evidence, enrollment validity, language proficiency
- Work Visa: employment verification, sponsorship validity, eligibility requirements, labour market test

Do NOT flag missing document uploads as risks.
Do NOT mention document upload status.

Return ONLY a valid JSON array:
[
  { "level": "HIGH" | "MEDIUM" | "LOW", "message": "..." }
]

Rules:
- Maximum 4 items
- level must be HIGH, MEDIUM, or LOW
- JSON only, no markdown, no preamble
`.trim();

  try {
    const raw = await callGroq(system, prompt);
    const parsed = parseJSON(raw);
    if (!Array.isArray(parsed)) throw new Error("Not an array");
    return parsed.slice(0, 4).map((r) => ({
      level: ["HIGH", "MEDIUM", "LOW"].includes(r.level) ? r.level : "MEDIUM",
      message: String(r.message || ""),
    }));
  } catch (error) {
    console.error("Groq aiRisks error:", error);
    return [
      {
        level: "LOW",
        message: "AI risk assessment temporarily unavailable. Please review case manually.",
      },
    ];
  }
}

/* ─────────────────────────────────────────
   3. AI Recommendations
───────────────────────────────────────── */
async function generateAIRecommendations(
  visaType,
  country,
  description,
  documents
) {
  const system =
    "You are an immigration consultant providing actionable advice. Return valid JSON only. No markdown. No explanations.";

  const documentsOnFile =
    documents && documents.length > 0
      ? documents.join(", ")
      : "none yet";

  const prompt = `
Visa type: ${visaType}
Destination country: ${country}
Case description: ${description}
Documents already required for this visa: ${documentsOnFile}

Generate up to 5 actionable recommendations to strengthen this application.
Focus on: verifying information consistency, preparing supporting evidence,
reviewing destination-country specific requirements, addressing potential concerns,
or improving the quality of submitted materials.

Do NOT recommend uploading documents already listed in the required documents above.
Do NOT give generic advice like "gather all documents".

Return ONLY a valid JSON array of strings:
["recommendation 1", "recommendation 2", ...]

Rules:
- Maximum 5 items
- Each item is a plain string
- JSON array only, no markdown, no preamble
`.trim();

  try {
    const raw = await callGroq(system, prompt);
    const parsed = parseJSON(raw);
    if (!Array.isArray(parsed)) throw new Error("Not an array");
    return parsed.slice(0, 5).map(String);
  } catch (error) {
    console.error("Groq aiRecommendations error:", error);
    return [
      "Verify that all personal information matches across submitted documents.",
      `Review ${country}'s current visa requirements before submission.`,
    ];
  }
}

/* ─────────────────────────────────────────
   Main export — runs all three in parallel
───────────────────────────────────────── */
export async function generateGroqInsights(
  visaType,
  country,
  description,
  documents
) {
  const [aiOverview, aiRisks, aiRecommendations] = await Promise.all([
    generateAIOverview(visaType, country, description),
    generateAIRisks(visaType, country, description),
    generateAIRecommendations(visaType, country, description, documents),
  ]);

  return { aiOverview, aiRisks, aiRecommendations };
}