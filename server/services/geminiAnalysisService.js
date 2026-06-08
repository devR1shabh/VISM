import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export async function generateAIInsights(
  visaType,
  country,
  description
) {
  const prompt = `
You are an expert immigration consultant.

Analyze this visa application.

Visa Type: ${visaType}
Country: ${country}
Description: ${description}

Return ONLY valid JSON.

{
  "overview": "",
  "risks": [
    {
      "level": "HIGH",
      "message": ""
    }
  ],
  "assessment": {
    "strengths": [],
    "concerns": [],
    "recommendation": ""
  },
  "timeline": [
    {
      "stage": "",
      "duration": ""
    }
  ],
  "notification": {
    "title": "",
    "message": ""
  },
  "followUpActions": []
}

Rules:
- Maximum 3 risks
- Maximum 5 timeline stages
- Maximum 5 followUpActions
- Risk level must be HIGH, MEDIUM, or LOW
- Return JSON only
- No markdown
- No explanations
`;

  try {
    const result =
      await model.generateContent(
        prompt
      );

    const response =
      result.response.text();

    const cleaned =
      response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "Gemini Analysis Error:",
      error
    );

    return {
      overview:
        `Visa application for ${country}. AI analysis unavailable.`,

      risks: [
        {
          level: "LOW",
          message:
            "AI service temporarily unavailable.",
        },
      ],

      assessment: {
        strengths: [],
        concerns: [],
        recommendation:
          "Please try again later.",
      },

      timeline: [
        {
          stage:
            "Application Review",
          duration:
            "Pending",
        },
      ],

      notification: {
        title:
          "Analysis Unavailable",
        message:
          "AI analysis could not be generated.",
      },

      followUpActions: [
        "Review application manually",
      ],
    };
  }
}