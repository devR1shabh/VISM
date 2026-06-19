// server/services/assessmentAgentService.js
//
// ── Readiness Assessment Agent ───────────────────────────────────────────────
//
// This is a genuine AI Agent. It uses the Groq function-calling (tool use) API
// so the LLM itself decides which tools to invoke and in what order.
//
// Architecture:
//   1. Agent receives the full case snapshot.
//   2. LLM is given a set of tool definitions and a goal.
//   3. The agent loop runs: LLM decides which tool(s) to call → tools execute
//      and return results → LLM receives results → LLM decides next action.
//   4. Loop terminates ONLY when the LLM calls write_assessment, which commits
//      the result to the database. The LLM decides when it has enough evidence.
//
// This is agentic because:
//   - The LLM selects tools (not hardcoded logic)
//   - Multiple tool calls happen across multiple loop iterations
//   - The LLM decides when to stop (write_assessment terminates the loop)
//   - The output directly mutates application state in MongoDB
//   - A reasoning field captures WHY the LLM made its decision

import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL       = "llama-3.3-70b-versatile";
const MAX_LOOPS   = 8;   // Safety cap — prevents infinite loops

// ── Tool definitions (OpenAI-compatible function calling schema) ──────────────

const TOOL_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "check_document_status",
      description:
        "Returns the complete document status: which required documents are verified, which are missing, and the overall completion percentage. Always call this first.",
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "Why you are calling this tool right now.",
          },
        },
        required: ["reason"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_passport_validity",
      description:
        "Checks whether a passport has been uploaded and whether it is valid and not expired. Returns passport name, expiry date, and validity status.",
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "Why you are calling this tool right now.",
          },
        },
        required: ["reason"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_financial_evidence",
      description:
        "Checks whether financial documents (Bank Statement, Proof of Funds, or Financial Evidence) have been verified. Financial evidence is critical for most visa types.",
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "Why you are calling this tool right now.",
          },
        },
        required: ["reason"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_questionnaire_gaps",
      description:
        "Analyses the applicant's questionnaire answers for concerning signals: previous visa refusals, low financial capacity, no sponsor for high-cost visas, or unanswered questions.",
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "Why you are calling this tool right now.",
          },
        },
        required: ["reason"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_assessment",
      description:
        "Commits the final agent assessment to the database. Call this ONLY when you have gathered enough evidence from the other tools to make a confident assessment. This terminates the agent loop.",
      parameters: {
        type: "object",
        properties: {
          overallRisk: {
            type: "string",
            enum: ["LOW", "MEDIUM", "HIGH"],
            description:
              "Your overall risk verdict for this application, based on all tool results.",
          },
          readinessLabel: {
            type: "string",
            description:
              "A short human-readable label describing application readiness. Examples: 'Ready to Submit', 'Action Required', 'Critical Issues Found', 'Nearly Ready'.",
          },
          actions: {
            type: "array",
            items: { type: "string" },
            description:
              "A prioritised list of specific actions the applicant must take next. Be concrete. Maximum 5 items.",
          },
          reasoning: {
            type: "string",
            description:
              "One clear paragraph explaining how you reached your verdict — what you checked, what you found, and why you assigned this risk level.",
          },
        },
        required: ["overallRisk", "readinessLabel", "actions", "reasoning"],
      },
    },
  },
];

// ── Tool implementations ──────────────────────────────────────────────────────
// Each tool receives the full case snapshot and returns a structured result.
// Tools are pure functions — they read state, never write it.

function toolCheckDocumentStatus(caseSnapshot) {
  const { requiredDocuments = [], uploadedDocuments = [] } = caseSnapshot;

  const verified = uploadedDocuments.filter((d) => d.valid);
  const verifiedNames = verified.map((d) => d.requiredDocument);

  const missing = requiredDocuments.filter(
    (doc) => !verifiedNames.includes(doc)
  );

  const pct =
    requiredDocuments.length === 0
      ? 0
      : Math.round((verified.length / requiredDocuments.length) * 100);

  return {
    totalRequired:       requiredDocuments.length,
    totalVerified:       verified.length,
    totalMissing:        missing.length,
    completionPercent:   pct,
    verifiedDocuments:   verifiedNames,
    missingDocuments:    missing,
  };
}

function toolCheckPassportValidity(caseSnapshot) {
  const { passportData } = caseSnapshot;

  if (!passportData || !passportData.fullName) {
    return {
      passportUploaded: false,
      valid:            false,
      detail:           "No passport has been uploaded.",
    };
  }

  // Check expiry
  let expired = false;
  let daysUntilExpiry = null;

  if (passportData.expiryDate) {
    const parts   = passportData.expiryDate.split(/[-/]/);
    const expiry  = new Date(parts.length === 3 ? passportData.expiryDate : passportData.expiryDate);
    const today   = new Date();
    const diffMs  = expiry - today;
    daysUntilExpiry = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    expired = daysUntilExpiry < 0;
  }

  return {
    passportUploaded: true,
    valid:            !expired,
    fullName:         passportData.fullName,
    passportNumber:   passportData.passportNumber,
    expiryDate:       passportData.expiryDate || "Not extracted",
    nationality:      passportData.nationality || "Unknown",
    daysUntilExpiry,
    detail: expired
      ? `Passport expired (${passportData.expiryDate}). Application cannot proceed.`
      : daysUntilExpiry !== null && daysUntilExpiry < 180
        ? `Passport expires in ${daysUntilExpiry} days — may be insufficient for visa duration.`
        : "Passport is valid.",
  };
}

function toolCheckFinancialEvidence(caseSnapshot) {
  const { uploadedDocuments = [] } = caseSnapshot;

  const financialDocNames = [
    "Bank Statement",
    "Proof of Funds",
    "Financial Evidence",
    "Financial Proof",
  ];

  const found = uploadedDocuments.filter(
    (d) => d.valid && financialDocNames.some((name) =>
      d.requiredDocument?.toLowerCase().includes(name.toLowerCase())
    )
  );

  return {
    financialDocsFound:    found.length > 0,
    verifiedFinancialDocs: found.map((d) => d.requiredDocument),
    detail: found.length > 0
      ? `Financial evidence verified: ${found.map((d) => d.requiredDocument).join(", ")}.`
      : "No financial evidence documents have been verified. This is a common reason for visa refusal.",
  };
}

function toolCheckQuestionnaireGaps(caseSnapshot) {
  const q = caseSnapshot.questionnaire;

  if (!q) {
    return {
      questionnaireSubmitted: false,
      flags:                  [],
      detail:                 "Questionnaire has not been submitted by the applicant.",
    };
  }

  const flags = [];

  if (q.previousRefusal === "Yes") {
    flags.push({
      severity: "HIGH",
      message:  `Applicant has a previous visa refusal. Details: ${q.previousRefusalDetails || "Not provided"}`,
    });
  }

  if (q.financialCapacity === "Under $5,000") {
    flags.push({
      severity: "HIGH",
      message:  "Applicant's stated financial capacity (Under $5,000) may be insufficient for visa requirements.",
    });
  }

  if (q.financialCapacity === "$5,000–$20,000" && caseSnapshot.visaType === "Investor Visa") {
    flags.push({
      severity: "HIGH",
      message:  "Stated financial capacity appears insufficient for an Investor Visa.",
    });
  }

  if (!q.occupation || q.occupation.trim() === "") {
    flags.push({
      severity: "MEDIUM",
      message:  "Applicant did not specify their current occupation.",
    });
  }

  if (q.hasSponsor === "No" && ["Student Visa", "Work Visa", "Family Sponsorship Visa"].includes(caseSnapshot.visaType)) {
    flags.push({
      severity: "MEDIUM",
      message:  `No sponsor indicated for a ${caseSnapshot.visaType}, which typically requires institutional or employer support.`,
    });
  }

  if (q.existingArrangements === "No") {
    flags.push({
      severity: "LOW",
      message:  "Applicant has not secured arrangements (accommodation, employment, admission) in the destination country.",
    });
  }

  return {
    questionnaireSubmitted: true,
    purpose:                q.purpose              || "Not stated",
    education:              q.education            || "Not stated",
    occupation:             q.occupation           || "Not stated",
    experience:             q.experience           || "Not stated",
    previousRefusal:        q.previousRefusal      || "Not stated",
    financialCapacity:      q.financialCapacity    || "Not stated",
    hasSponsor:             q.hasSponsor           || "Not stated",
    existingArrangements:   q.existingArrangements || "Not stated",
    flags,
    detail: flags.length === 0
      ? "No concerning signals found in the questionnaire."
      : `${flags.length} concern(s) identified from questionnaire answers.`,
  };
}

// ── Tool dispatcher ───────────────────────────────────────────────────────────

function dispatchTool(toolName, args, caseSnapshot) {
  console.log(`\n[Agent] Tool called: ${toolName}`);
  console.log(`[Agent] Reason: ${args.reason || "—"}`);

  switch (toolName) {
    case "check_document_status":
      return toolCheckDocumentStatus(caseSnapshot);
    case "check_passport_validity":
      return toolCheckPassportValidity(caseSnapshot);
    case "check_financial_evidence":
      return toolCheckFinancialEvidence(caseSnapshot);
    case "check_questionnaire_gaps":
      return toolCheckQuestionnaireGaps(caseSnapshot);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

// ── System prompt ─────────────────────────────────────────────────────────────

function buildSystemPrompt(caseSnapshot) {
  return `You are the VISM Readiness Assessment Agent — an autonomous AI agent that evaluates visa applications.

Your goal: assess the readiness of this visa application and identify the most critical actions the applicant must take.

You have access to four investigation tools:
1. check_document_status       — what documents are verified vs missing
2. check_passport_validity     — is the passport uploaded and valid
3. check_financial_evidence    — are financial documents verified
4. check_questionnaire_gaps    — are there concerning signals in the questionnaire

You MUST call at least check_document_status and check_passport_validity before writing your assessment.
You SHOULD call check_financial_evidence and check_questionnaire_gaps for a complete picture.
You MUST call write_assessment when you are ready to commit your verdict.

Case being assessed:
- Case ID:   ${caseSnapshot.caseId || "N/A"}
- Visa Type: ${caseSnapshot.visaType || "Unknown"}
- Country:   ${caseSnapshot.country || "Unknown"}

Be systematic. Use the tools in a logical order. Do not write_assessment until you have investigated thoroughly.`;
}

// ── Main agent loop ───────────────────────────────────────────────────────────
//
// Returns { overallRisk, readinessLabel, actions, reasoning, toolCallLog }
// Throws on unrecoverable error.

export async function runReadinessAgent(caseSnapshot) {
  const messages = [
    { role: "system", content: buildSystemPrompt(caseSnapshot) },
    {
      role: "user",
      content: `Please assess the readiness of this ${caseSnapshot.visaType} application for ${caseSnapshot.country}. Investigate systematically using your tools, then write your assessment.`,
    },
  ];

  const toolCallLog = [];   // For transparency — every tool call recorded
  let assessment    = null;
  let loopCount     = 0;

  console.log("\n====== VISM READINESS AGENT STARTED ======");
  console.log(`Case: ${caseSnapshot.caseId} | ${caseSnapshot.visaType} | ${caseSnapshot.country}`);

  while (loopCount < MAX_LOOPS) {
    loopCount++;
    console.log(`\n[Agent] Loop iteration ${loopCount}`);

    // ── Call the LLM with tool definitions ───────────────────────────────────
    const response = await groq.chat.completions.create({
      model:       MODEL,
      temperature: 0.1,      // Low temperature — we want deterministic, methodical reasoning
      max_tokens:  1500,
      tools:       TOOL_DEFINITIONS,
      tool_choice: "auto",   // LLM decides which tool to call (or none)
      messages,
    });

    const choice  = response.choices[0];
    const message = choice.message;

    // Add assistant message to history for next iteration
    messages.push(message);

    // ── Check if LLM wants to call tools ─────────────────────────────────────
    if (choice.finish_reason === "tool_calls" && message.tool_calls?.length > 0) {

      // Process every tool call the LLM requested in this turn
      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function.name;
        let   args     = {};

        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch {
          args = {};
        }

        // ── Terminal tool: write_assessment ───────────────────────────────────
        if (toolName === "write_assessment") {
          assessment = {
            overallRisk:    args.overallRisk    || "MEDIUM",
            readinessLabel: args.readinessLabel || "Assessment Complete",
            actions:        Array.isArray(args.actions) ? args.actions.slice(0, 5) : [],
            reasoning:      args.reasoning      || "",
          };

          toolCallLog.push({
            tool:   "write_assessment",
            result: assessment,
          });

          console.log("\n[Agent] write_assessment called — loop terminating.");
          console.log("[Agent] Verdict:", assessment.overallRisk, "|", assessment.readinessLabel);
          console.log("====== VISM READINESS AGENT COMPLETE ======\n");

          return { ...assessment, toolCallLog };
        }

        // ── Investigation tool ────────────────────────────────────────────────
        const toolResult = dispatchTool(toolName, args, caseSnapshot);

        toolCallLog.push({
          tool:   toolName,
          reason: args.reason,
          result: toolResult,
        });

        console.log(`[Agent] Tool result:`, JSON.stringify(toolResult, null, 2));

        // Return tool result to LLM in the format Groq expects
        messages.push({
          role:         "tool",
          tool_call_id: toolCall.id,
          content:      JSON.stringify(toolResult),
        });
      }

    } else if (choice.finish_reason === "stop") {
      // LLM generated text instead of calling a tool — shouldn't happen
      // with our prompt, but handle gracefully
      console.warn("[Agent] LLM stopped without calling write_assessment. Prompting to complete.");
      messages.push({
        role:    "user",
        content: "You have not yet called write_assessment. Please call it now to commit your verdict.",
      });

    } else {
      // Unexpected finish reason
      console.warn("[Agent] Unexpected finish_reason:", choice.finish_reason);
      break;
    }
  }

  // Safety fallback — if loop exhausted without write_assessment being called
  console.error("[Agent] Loop limit reached without write_assessment. Using fallback.");
  return {
    overallRisk:    "MEDIUM",
    readinessLabel: "Assessment Incomplete",
    actions:        ["Agent loop limit reached. Please re-run the assessment."],
    reasoning:      "The assessment agent reached its iteration limit before completing. This may indicate an unusual case configuration. Please re-run the assessment.",
    toolCallLog,
  };
}