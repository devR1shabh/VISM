import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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

Return ONLY valid JSON in this exact format:

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
- Risk level must be HIGH, MEDIUM, or LOW
- Maximum 5 timeline stages
- Maximum 5 followUpActions
- JSON only
- No markdown
- No explanations
`;

  try {
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        temperature: 0.3,

        messages: [
          {
            role: "system",
            content:
              "You are an expert immigration consultant. Return valid JSON only.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const response =
      completion.choices[0].message.content;

    console.log(
      "\n===== GROQ RESPONSE ====="
    );

    console.log(response);

    console.log(
      "=========================\n"
    );

    const cleaned =
      response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const parsed =
      JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    console.error(
      "Groq Analysis Error:",
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