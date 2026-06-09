// server/services/copilotService.js

import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function buildSystemPrompt(caseContext) {
  const {
    visaType,
    country,
    description,
    caseId,
    status,
    passportData,
    uploadedDocuments,
    analysis,
  } = caseContext;

  const lines = [];

  lines.push(`You are VISM AI Copilot — a premium AI assistant built into the VISM (Visa Immigration Support Manager) platform.`);
  lines.push(`You help immigration consultants and applicants understand their visa case, document status, risks, and next steps.`);
  lines.push(`You are NOT a generic chatbot. You have full context of the user's case and must use it in every response.`);
  lines.push(`Be concise, professional, and helpful. Use plain language. Avoid excessive bullet points unless listing items.`);
  lines.push(``);
  lines.push(`--- CURRENT CASE ---`);
  lines.push(`Case ID: ${caseId || "N/A"}`);
  lines.push(`Visa Type: ${visaType || "Not specified"}`);
  lines.push(`Country: ${country || "Not specified"}`);
  lines.push(`Status: ${status || "In Progress"}`);

  if (description) {
    lines.push(`Applicant Description: ${description}`);
  }

  lines.push(``);

  // Passport identity — trusted source for personalization
  if (passportData && passportData.fullName) {
    lines.push(`--- APPLICANT IDENTITY (from Passport) ---`);
    lines.push(`Full Name: ${passportData.fullName}`);
    lines.push(`Passport Number: ${passportData.passportNumber || "N/A"}`);
    lines.push(`Nationality: ${passportData.nationality || "N/A"}`);
    lines.push(`Date of Birth: ${passportData.dateOfBirth || "N/A"}`);
    lines.push(`Passport Expiry: ${passportData.expiryDate || "N/A"}`);
    lines.push(``);
    lines.push(`IMPORTANT: Use the passport name to personalize responses if appropriate.`);
    lines.push(`Do NOT use names, emails, or personal details from Resume, Transcript, or Bank Statement — those may belong to different people.`);
  } else {
    lines.push(`--- APPLICANT IDENTITY ---`);
    lines.push(`Passport not yet uploaded. Do not assume applicant name.`);
  }

  lines.push(``);

  // Document status — generic, works for any document list
  if (uploadedDocuments && uploadedDocuments.length > 0) {
    lines.push(`--- UPLOADED DOCUMENTS ---`);
    uploadedDocuments.forEach((doc) => {
      const status = doc.valid ? "✓ Verified" : "✗ Failed Verification";
      const confidence =
        doc.confidence !== undefined ? ` (Confidence: ${doc.confidence}%)` : "";
      lines.push(`- ${doc.requiredDocument}: ${status}${confidence}`);
    });
  } else {
    lines.push(`--- UPLOADED DOCUMENTS ---`);
    lines.push(`No documents uploaded yet.`);
  }

  lines.push(``);

  // AI analysis — if available
  if (analysis) {
    if (analysis.overview) {
      lines.push(`--- APPLICATION OVERVIEW ---`);
      lines.push(analysis.overview);
      lines.push(``);
    }

    if (analysis.risks && analysis.risks.length > 0) {
      lines.push(`--- RISKS ---`);
      analysis.risks.forEach((risk) => {
        lines.push(`[${risk.level}] ${risk.message}`);
      });
      lines.push(``);
    }

    if (analysis.timeline && analysis.timeline.length > 0) {
      lines.push(`--- TIMELINE ---`);
      analysis.timeline.forEach((t) => {
        lines.push(`${t.stage}: ${t.duration}`);
      });
      lines.push(``);
    }

    if (analysis.assessment) {
      const { strengths, concerns, recommendation } = analysis.assessment;
      lines.push(`--- ASSESSMENT ---`);
      if (strengths && strengths.length > 0) {
        lines.push(`Strengths: ${strengths.join(", ")}`);
      }
      if (concerns && concerns.length > 0) {
        lines.push(`Concerns: ${concerns.join(", ")}`);
      }
      if (recommendation) {
        lines.push(`Recommendation: ${recommendation}`);
      }
      lines.push(``);
    }

    if (analysis.followUpActions && analysis.followUpActions.length > 0) {
      lines.push(`--- FOLLOW UP ACTIONS ---`);
      analysis.followUpActions.forEach((action) => {
        lines.push(`- ${action}`);
      });
      lines.push(``);
    }
  } else {
    lines.push(`--- ANALYSIS ---`);
    lines.push(`Analysis not yet generated.`);
    lines.push(``);
  }

  lines.push(`--- INSTRUCTIONS ---`);
  lines.push(`Answer the user's question using the case context above.`);
  lines.push(`If the user asks about documents, refer to the uploaded documents section.`);
  lines.push(`If the user asks about risks, refer to the risks section.`);
  lines.push(`If the user asks about timeline or processing time, use the timeline section if available, otherwise give a general estimate.`);
  lines.push(`If asked what documents are missing, compare uploaded documents against standard requirements for a ${visaType || "visa"} to ${country || "the destination country"}.`);
  lines.push(`Do not make up case details that are not present in the context.`);
  lines.push(`Be helpful, accurate, and professional.`);

  return lines.join("\n");
}

export async function generateCopilotReply(caseContext, message) {
  const systemPrompt = buildSystemPrompt(caseContext);

  console.log("\n===== COPILOT REQUEST =====");
  console.log("Message:", message);
  console.log("Visa Type:", caseContext.visaType);
  console.log("Country:", caseContext.country);
  console.log("===========================\n");

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    console.log("\n===== COPILOT REPLY =====");
    console.log(reply);
    console.log("=========================\n");

    return reply;
  } catch (error) {
    console.error("Copilot Service Error:", error);
    throw new Error("Failed to generate AI response");
  }
}