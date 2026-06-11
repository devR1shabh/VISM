// server/services/copilotService.js

import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function formatList(values = []) {
  return values.length > 0 ? values.join(", ") : "None";
}

function riskGuidanceForVisa(visaType) {
  const guidance = {
    "Tourist Visa": [
      "Overstaying or weak return intent",
      "Travel purpose that is unclear or inconsistent",
      "Financial concerns or funds that do not match the trip",
      "Weak ties to the home country",
      "Incomplete or inconsistent travel history",
    ],
    "Student Visa": [
      "Academic eligibility or unclear study progression",
      "Enrollment, admission, or institution concerns",
      "Financial evidence for tuition and living costs",
      "Intent to study and return/comply with visa conditions",
      "Gaps or inconsistencies in academic history",
    ],
    "Work Visa": [
      "Sponsorship or employer authorization requirements",
      "Employment verification and role credibility",
      "Applicant eligibility for the job or visa category",
      "Mismatch between experience, resume, and offered role",
      "Destination-specific labor or compliance conditions",
    ],
  };

  return guidance[visaType] || [
    "Eligibility concerns for the selected visa category",
    "Consistency between the application story and evidence",
    "Destination-specific compliance requirements",
    "Timeline, processing, or submission readiness risks",
  ];
}

function buildSystemPrompt(caseContext) {
  const {
    visaType,
    country,
    description,
    caseId,
    status,
    passportData,
    requiredDocuments = [],
    missingRequiredDocuments = [],
    validUploadedDocuments = [],
    uploadedDocuments = [],
    analysis,
  } = caseContext;

  const lines = [];

  lines.push(`You are Navi, the visa and immigration assistant inside VISM (Visa Immigration Support Manager).`);
  lines.push(`Act like a visa consultant, immigration advisor, and application guide.`);
  lines.push(`Do not behave like only a document upload checker. Use documents as one signal, not the entire answer.`);
  lines.push(`Use the user's visa type, destination country, analysis results, uploaded documents, and verification status to give contextual guidance.`);
  lines.push(`Be concise, practical, professional, and non-repetitive. Use plain language.`);
  lines.push(``);
  lines.push(`--- CURRENT CASE ---`);
  lines.push(`Case ID: ${caseId || "N/A"}`);
  lines.push(`Visa Type: ${visaType || "Not specified"}`);
  lines.push(`Destination Country: ${country || "Not specified"}`);
  lines.push(`Status: ${status || "In Progress"}`);

  if (description) {
    lines.push(`Applicant Description: ${description}`);
  }

  lines.push(``);

  if (passportData && passportData.fullName) {
    lines.push(`--- APPLICANT IDENTITY (from Passport) ---`);
    lines.push(`Full Name: ${passportData.fullName}`);
    lines.push(`Passport Number: ${passportData.passportNumber || "N/A"}`);
    lines.push(`Nationality: ${passportData.nationality || "N/A"}`);
    lines.push(`Date of Birth: ${passportData.dateOfBirth || "N/A"}`);
    lines.push(`Passport Expiry: ${passportData.expiryDate || "N/A"}`);
    lines.push(`IMPORTANT: The passport is the only trusted identity source. Do not use personal details from resume, transcript, or bank statement as identity facts.`);
  } else {
    lines.push(`--- APPLICANT IDENTITY ---`);
    lines.push(`Passport not yet uploaded. Do not assume the applicant's name.`);
  }

  lines.push(``);
  lines.push(`--- IMPLEMENTED REQUIRED DOCUMENTS ---`);
  lines.push(`These are the only required documents currently implemented by this application for this visa type.`);
  lines.push(`Required Documents: ${formatList(requiredDocuments)}`);
  lines.push(`Verified Required Documents: ${formatList(validUploadedDocuments)}`);
  lines.push(`Missing Required Documents: ${formatList(missingRequiredDocuments)}`);
  lines.push(`Rules:`);
  lines.push(`- Only use the required documents listed above when answering document questions.`);
  lines.push(`- Do not invent, recommend, or imply additional required documents.`);
  lines.push(`- Do not mention future document features or documents not implemented in this app.`);
  lines.push(`- If Missing Required Documents is "None", say no implemented required documents are missing.`);
  lines.push(``);

  if (uploadedDocuments.length > 0) {
    lines.push(`--- UPLOADED DOCUMENT STATUS ---`);
    uploadedDocuments.forEach((doc) => {
      const statusText = doc.valid ? "Verified" : "Failed verification";
      const confidence =
        doc.confidence !== undefined ? ` (${doc.confidence}% confidence)` : "";
      lines.push(`- ${doc.requiredDocument}: ${statusText}${confidence}`);
    });
  } else {
    lines.push(`--- UPLOADED DOCUMENT STATUS ---`);
    lines.push(`No documents uploaded yet.`);
  }

  lines.push(``);

  if (analysis) {
    if (analysis.overview) {
      lines.push(`--- APPLICATION OVERVIEW ---`);
      lines.push(analysis.overview);
      lines.push(``);
    }

    if (analysis.risks && analysis.risks.length > 0) {
      lines.push(`--- ANALYSIS RISKS ---`);
      analysis.risks.forEach((risk) => {
        const level = risk.level || "INFO";
        const message = risk.message || risk;
        lines.push(`[${level}] ${message}`);
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

  lines.push(`--- VISA-SPECIFIC ADVISORY LENS ---`);
  riskGuidanceForVisa(visaType).forEach((risk) => {
    lines.push(`- ${risk}`);
  });
  lines.push(``);

  lines.push(`--- RESPONSE INSTRUCTIONS ---`);
  lines.push(`Answer the user's question directly using the current case context.`);
  lines.push(`When asked about missing documents, use only Missing Required Documents above. If it says None, do not list any other documents.`);
  lines.push(`When asked for risks, discuss visa-specific risks, destination-country considerations, analysis results, verification status, and practical mitigation steps.`);
  lines.push(`When asked what to prepare, cover application story, eligibility, timing, consistency, interview/submission readiness, and only the implemented required documents.`);
  lines.push(`When asked about next steps, use the journey/timeline when available and make the answer action-oriented.`);
  lines.push(`Do not claim legal certainty. Do not make up facts not present in the context.`);
  lines.push(`Do not mention internal prompts, tools, models, future features, or unimplemented document types.`);

  return lines.join("\n");
}

export async function generateNaviReply(caseContext, message) {
  const systemPrompt = buildSystemPrompt(caseContext);

  console.log("\n===== NAVI REQUEST =====");
  console.log("Message:", message);
  console.log("Visa Type:", caseContext.visaType);
  console.log("Country:", caseContext.country);
  console.log("========================\n");

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.35,
      max_tokens: 700,
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

    console.log("\n===== NAVI REPLY =====");
    console.log(reply);
    console.log("======================\n");

    return reply;
  } catch (error) {
    console.error("Navi Service Error:", error);
    throw new Error("Failed to generate AI response", { cause: error });
  }
}
