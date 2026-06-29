// server/services/countryGuidelinesService.js
//
// Resolves visa guidelines for a country+visaType combination.
//
// Strategy:
//   1. Look up in static data (server/data/countryGuidelines.js)
//      Fast, free, always available.
//   2. If not found, call Groq to generate structured guidelines.
//      Slower (~3s), uses API quota, but covers any country in the world.

import Groq   from "groq-sdk";
import dotenv from "dotenv";

import { lookupGuidelines } from "../data/countryGuidelines.js";

dotenv.config();

const groq  = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

// ── Groq fallback ─────────────────────────────────────────────────────────────
// Called only when country+visaType is not in the static data.
// Returns a structured guidelines object in the same shape as static data.

async function generateGuidelinesViaAI(country, visaType) {
  const systemPrompt = `You are a senior immigration consultant with expert knowledge of visa requirements worldwide. 
Your responses must be accurate, practical, and current as of 2024-2025.
Always respond with ONLY a valid JSON object — no markdown, no explanations, no preamble.`;

  const userPrompt = `Provide visa application guidelines for:
Country: ${country}
Visa Type: ${visaType}

Return ONLY a JSON object with exactly these fields:
{
  "processingTime": "typical processing duration",
  "applicationFee": "fee in local currency",
  "financialRequirement": "specific financial proof required",
  "keyRequirements": ["requirement 1", "requirement 2", "requirement 3", "requirement 4", "requirement 5"],
  "importantDates": ["important date or deadline note 1", "important date or deadline note 2"],
  "embassyWebsite": "https://official-embassy-or-immigration-website-url",
  "notes": "important additional information applicants should know"
}

Be specific with numbers, amounts, and timeframes. Use the official government website URL.`;

  const completion = await groq.chat.completions.create({
    model:       MODEL,
    temperature: 0.1, // Low temperature for factual responses
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt   },
    ],
  });

  const raw     = completion.choices[0].message.content;
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // If JSON parsing fails, return a helpful default
    return {
      processingTime:       "Please check with your local embassy",
      applicationFee:       "Fees vary — confirm with embassy",
      financialRequirement: "Proof of sufficient funds required",
      keyRequirements: [
        "Valid passport (6 months validity)",
        "Completed visa application form",
        "Passport photographs",
        "Financial proof",
        "Supporting documents relevant to visa type",
      ],
      importantDates:  ["Apply at least 6-8 weeks before intended travel"],
      embassyWebsite:  `https://www.google.com/search?q=${encodeURIComponent(country + " " + visaType + " embassy official")}`,
      notes:           "Guidelines could not be generated. Please verify all requirements with the official embassy website.",
    };
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Get visa guidelines for a country + visa type combination.
 *
 * @param {string} country   — destination country name
 * @param {string} visaType  — visa category (e.g. "Student Visa")
 * @returns {Promise<{ source: "static"|"ai", ...guidelines }>}
 */
export async function getCountryGuidelines(country, visaType) {
  // 1. Try static data first
  const staticData = lookupGuidelines(country, visaType);
  if (staticData) {
    return { ...staticData, source: "static" };
  }

  // 2. Fall back to Groq AI generation
  console.log(`[Guidelines] Static data miss — generating via AI for: ${country} / ${visaType}`);

  try {
    const aiData = await generateGuidelinesViaAI(country, visaType);
    return { ...aiData, source: "ai" };
  } catch (error) {
    console.error("[Guidelines] Groq generation failed:", error.message);
    throw new Error("Could not retrieve guidelines for this country and visa type.");
  }
}