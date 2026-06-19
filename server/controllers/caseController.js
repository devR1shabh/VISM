// server/controllers/caseController.js

import Case from "../models/Case.js";
import { runReadinessAgent } from "../services/assessmentAgentService.js";

export async function createCase(req, res) {
  try {
    const newCase = await Case.create(req.body);
    res.status(201).json(newCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create case" });
  }
}

export async function getCase(req, res) {
  try {
    const foundCase = await Case.findById(req.params.id);
    if (!foundCase) {
      return res.status(404).json({ error: "Case not found" });
    }
    res.json(foundCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch case" });
  }
}

export async function updateCase(req, res) {
  try {
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update case" });
  }
}

export async function addVerifiedDocument(req, res) {
  try {
    const { documentType } = req.body;
    const caseId   = req.params.id;
    const uploadedAt = new Date();

    let updatedCase = await Case.findOneAndUpdate(
      {
        _id: caseId,
        "uploadedDocuments.type": documentType,
      },
      {
        $set: {
          "uploadedDocuments.$.verified":  true,
          "uploadedDocuments.$.uploadedAt": uploadedAt,
        },
      },
      { new: true }
    );

    if (!updatedCase) {
      updatedCase = await Case.findByIdAndUpdate(
        caseId,
        {
          $push: {
            uploadedDocuments: {
              type: documentType,
              verified: true,
              uploadedAt,
            },
          },
        },
        { new: true }
      );
    }

    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save document" });
  }
}

export async function savePassportData(req, res) {
  try {
    const { passportData } = req.body;
    const caseId = req.params.id;

    if (!passportData) {
      return res.status(400).json({ error: "passportData is required" });
    }

    const passportLast4 = passportData.passportNumber
      ? String(passportData.passportNumber).slice(-4)
      : undefined;

    const update = {
      passportData: {
        fullName:       passportData.fullName       || "",
        passportNumber: passportData.passportNumber || "",
        nationality:    passportData.nationality    || "",
        dateOfBirth:    passportData.dateOfBirth    || "",
        expiryDate:     passportData.expiryDate     || "",
        issuingCountry: passportData.issuingCountry || "",
        sex:            passportData.sex            || "",
        name:           passportData.fullName       || "",
        passportLast4:  passportLast4               || "",
      },
    };

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $set: update },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save passport data" });
  }
}

export async function getAllCases(req, res) {
  try {
    const cases = await Case.find({}).sort({ createdAt: -1 }).lean();
    res.json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cases" });
  }
}

export async function getCaseById(req, res) {
  try {
    const foundCase = await Case.findById(req.params.id).lean();
    if (!foundCase) {
      return res.status(404).json({ error: "Case not found" });
    }
    res.json(foundCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch case" });
  }
}

export async function processorAction(req, res) {
  try {
    const { action, note } = req.body;
    const caseId = req.params.id;

    const STATUS_MAP = {
      approve:           "Approved",
      reject:            "Rejected",
      request_documents: "Need Documents",
    };

    const EVENT_MAP = {
      approve:           "Case Approved",
      reject:            "Case Rejected",
      request_documents: "Documents Requested",
      add_note:          "Note Added",
      view_case:         "Processor Viewed Case",
    };

    const updates = {};
    const pushOps = {};

    if (STATUS_MAP[action]) {
      updates.processorStatus = STATUS_MAP[action];
    }

    const auditEntry = {
      event:     EVENT_MAP[action] || action,
      detail:    note || "",
      timestamp: new Date(),
      actor:     "processor",
    };
    pushOps.auditLog = auditEntry;

    if (note && note.trim() && action !== "view_case") {
      pushOps.processorNotes = {
        noteId:  `note-${Date.now()}`,
        text:    note.trim(),
        addedAt: new Date(),
      };
    }

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      {
        ...(Object.keys(updates).length > 0 ? { $set: updates } : {}),
        $push: pushOps,
      },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process action" });
  }
}

export async function saveQuestionnaire(req, res) {
  try {
    const { answers } = req.body;
    const caseId = req.params.id;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "answers object is required" });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      {
        $set: {
          questionnaire: {
            ...answers,
            submittedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save questionnaire" });
  }
}

// ── runAssessment ────────────────────────────────────────────────────────────
// Triggers the Readiness Assessment Agent for a given case.
//
// The agent reads the case from MongoDB, builds a snapshot, runs its
// autonomous tool loop, and writes the result back to agentAssessment.
//
// The endpoint returns immediately with { running: true } after setting the
// running flag, then the agent runs asynchronously. The frontend polls
// GET /cases/:id to check when running becomes false and agentAssessment
// is populated.
//
// This avoids HTTP timeout issues for long agent runs.

export async function runAssessment(req, res) {
  const caseId = req.params.id;

  try {
    // Load the full case from DB
    const caseRecord = await Case.findById(caseId).lean();
    if (!caseRecord) {
      return res.status(404).json({ error: "Case not found" });
    }

    // ── Mark as running ───────────────────────────────────────────────────────────────────────────
    // We $set the whole agentAssessment object, NOT a dot-path like
    // "agentAssessment.running". MongoDB cannot write dot-path fields into a
    // null parent. Existing documents created before the agent feature was added
    // store agentAssessment: null, so dot-path writes throw:
    //   "Cannot create field 'running' in element { agentAssessment: null }"
    // Replacing the whole object works whether the current value is null, {},
    // or an already-populated sub-document. It also migrates legacy nulls in
    // one atomic operation with no separate migration step required.
    await Case.findByIdAndUpdate(caseId, {
      $set: {
        agentAssessment: {
          running:        true,
          overallRisk:    null,
          readinessLabel: "",
          actions:        [],
          reasoning:      "",
          toolCallLog:    [],
          runAt:          null,
        },
      },
    });

    // Respond immediately — agent runs in background
    res.json({ running: true, message: "Assessment agent started." });

    // ── Build the case snapshot the agent will reason over ────────────────────
    // Normalize uploadedDocuments from MongoDB format to the shape the agent tools expect.
    // The agent tools look for d.valid and d.requiredDocument — these come from the
    // client-side CaseContext shape, which the server stores differently.
    // We synthesize a compatible snapshot here.

    const uploadedDocs = (caseRecord.uploadedDocuments || []).map((d) => ({
      requiredDocument: d.type,       // server uses "type"; agent tools use "requiredDocument"
      valid:            d.verified,   // server uses "verified"; agent tools use "valid"
    }));

    const caseSnapshot = {
      caseId:            caseRecord.caseId,
      visaType:          caseRecord.visaType,
      country:           caseRecord.country,
      description:       caseRecord.description || "",
      passportData:      caseRecord.passportData || null,
      questionnaire:     caseRecord.questionnaire || null,
      requiredDocuments: caseRecord.analysis?.documents || [],
      uploadedDocuments: uploadedDocs,
    };

    // ── Run the agent (async — response already sent) ─────────────────────────
    try {
      const result = await runReadinessAgent(caseSnapshot);

      // Write the assessment result to MongoDB
      await Case.findByIdAndUpdate(caseId, {
        $set: {
          agentAssessment: {
            overallRisk:    result.overallRisk,
            readinessLabel: result.readinessLabel,
            actions:        result.actions,
            reasoning:      result.reasoning,
            toolCallLog:    result.toolCallLog,
            runAt:          new Date(),
            running:        false,
          },
        },
        $push: {
          auditLog: {
            event:     "Agent Assessment Run",
            detail:    `Verdict: ${result.overallRisk} — ${result.readinessLabel}`,
            timestamp: new Date(),
            actor:     "agent",
          },
        },
      });

      console.log(`[Agent Controller] Assessment saved for case ${caseId}`);

    } catch (agentError) {
      console.error("[Agent Controller] Agent run failed:", agentError);

      // Clear the running flag even on failure.
      // Again, use a full object $set rather than dot-paths so this works
      // safely even if agentAssessment is currently null in the document.
      await Case.findByIdAndUpdate(caseId, {
        $set: {
          agentAssessment: {
            running:        false,
            overallRisk:    "MEDIUM",
            readinessLabel: "Assessment Failed",
            actions:        ["Please re-run the assessment."],
            reasoning:      `Agent encountered an error: ${agentError.message}`,
            toolCallLog:    [],
            runAt:          new Date(),
          },
        },
      });
    }

  } catch (error) {
    console.error("[Agent Controller] Setup error:", error);
    // Only send error if headers not yet sent
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to start assessment agent" });
    }
  }
}