import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function generateAIInsights(
  visaType,
  country,
  description
) {
  const prompt = `
You are an expert immigration consultant.

Visa Type: ${visaType}
Country: ${country}
Description: ${description}

Return ONLY valid JSON:

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
`;

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
}