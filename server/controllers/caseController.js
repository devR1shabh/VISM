// server/controllers/caseController.js

import Case from "../models/Case.js";
import AssessmentRun from "../models/AssessmentRun.js";
import { DOCUMENT_CATEGORY_MAP } from "../config/constants.js";
import { runReadinessAgent } from "../services/assessmentAgentService.js";
import {
  sendCaseSubmittedEmail,
  sendCaseUpdateEmail,
} from "../services/emailService.js";

// ── createCase ────────────────────────────────────────────────────────────────
export async function createCase(req, res) {
  try {
    const caseData = {
      ...req.body,
      applicantId:    req.user?._id    ?? null,
      applicantEmail: req.user?.email  ?? "",
      applicantName:  req.user?.name   ?? "",
    };

    const newCase = await Case.create(caseData);

    if (newCase.applicantEmail) {
      sendCaseSubmittedEmail(newCase).catch((err) =>
        console.error("[createCase] Email send failed:", err.message)
      );
    }

    res.status(201).json(newCase);
  } catch (error) {
    console.error("[caseController.createCase]", error);
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

// ── addVerifiedDocument ───────────────────────────────────────────────────────
// FEATURE 2 CHANGE:
//   Now stamps `category` (mandatory | supporting) on every uploaded document
//   by looking up the document type in DOCUMENT_CATEGORY_MAP from constants.js.
//   Legacy documents (created before this feature) will have category: null.

export async function addVerifiedDocument(req, res) {
  try {
    const { documentType } = req.body;
    const caseId    = req.params.id;
    const uploadedAt = new Date();

    // Look up category from the single source of truth.
    // Falls back to null for any document type not in the map.
    const category = DOCUMENT_CATEGORY_MAP[documentType] ?? null;

    // Try to update an existing entry first (re-upload scenario).
    let updatedCase = await Case.findOneAndUpdate(
      {
        _id: caseId,
        "uploadedDocuments.type": documentType,
      },
      {
        $set: {
          "uploadedDocuments.$.verified":   true,
          "uploadedDocuments.$.uploadedAt": uploadedAt,
          "uploadedDocuments.$.category":   category,
        },
      },
      { new: true }
    );

    // No existing entry — push a new one.
    if (!updatedCase) {
      updatedCase = await Case.findByIdAndUpdate(
        caseId,
        {
          $push: {
            uploadedDocuments: {
              type:      documentType,
              verified:  true,
              uploadedAt,
              category,
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

// ── getAllCases ────────────────────────────────────────────────────────────────
export async function getAllCases(req, res) {
  try {
    const cases = await Case.find({}).sort({ createdAt: -1 }).lean();
    res.json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cases" });
  }
}

// ── getApplicantCases ─────────────────────────────────────────────────────────
export async function getApplicantCases(req, res) {
  try {
    const cases = await Case
      .find({ applicantId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(cases);
  } catch (error) {
    console.error("[caseController.getApplicantCases]", error);
    res.status(500).json({ error: "Failed to fetch your cases" });
  }
}

// ── getCaseById ───────────────────────────────────────────────────────────────
export async function getCaseById(req, res) {
  try {
    const foundCase = await Case.findById(req.params.id).lean();

    if (!foundCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    if (req.user) {
      const isProcessor = req.user.role === "processor";
      const isOwner     = foundCase.applicantId &&
                          String(foundCase.applicantId) === String(req.user._id);

      if (!isProcessor && !isOwner) {
        return res.status(404).json({ error: "Case not found" });
      }
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

    if (action !== "view_case" && updatedCase.applicantEmail) {
      sendCaseUpdateEmail(updatedCase, action, note || "").catch((err) =>
        console.error("[processorAction] Email send failed:", err.message)
      );
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

// ── getAssessmentHistory ──────────────────────────────────────────────────────
// GET /api/cases/:id/assessment-history?kind=agent|score
//
// Roadmap: returns the append-only AssessmentRun history for a case,
// newest first. Ownership check mirrors getCaseById:
//   applicant → must own the case
//   processor → can access any case
//
// Optional ?kind= filter restricts to "agent" or "score" runs only.
export async function getAssessmentHistory(req, res) {
  try {
    const caseId = req.params.id;
    const { kind } = req.query;

    if (kind && !["agent", "score"].includes(kind)) {
      return res.status(400).json({ error: "kind must be 'agent' or 'score'." });
    }

    const foundCase = await Case.findById(caseId).lean();
    if (!foundCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    if (req.user) {
      const isProcessor = req.user.role === "processor";
      const isOwner     = foundCase.applicantId &&
                          String(foundCase.applicantId) === String(req.user._id);

      if (!isProcessor && !isOwner) {
        return res.status(404).json({ error: "Case not found" });
      }
    }

    const query = { caseId, ...(kind ? { kind } : {}) };

    const history = await AssessmentRun
      .find(query)
      .sort({ runAt: -1 })
      .lean();

    res.json(history);
  } catch (error) {
    console.error("[caseController.getAssessmentHistory]", error);
    res.status(500).json({ error: "Failed to fetch assessment history" });
  }
}

// ── runAssessment ─────────────────────────────────────────────────────────────
export async function runAssessment(req, res) {
  const caseId = req.params.id;

  try {
    const caseRecord = await Case.findById(caseId).lean();
    if (!caseRecord) {
      return res.status(404).json({ error: "Case not found" });
    }

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

    res.json({ running: true, message: "Assessment agent started." });

    const uploadedDocs = (caseRecord.uploadedDocuments || []).map((d) => ({
      requiredDocument: d.type,
      valid:            d.verified,
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

    try {
      const result = await runReadinessAgent(caseSnapshot);

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

      // Roadmap: append-only history alongside the existing snapshot
      // write above. Fire-and-forget — never blocks or fails the
      // primary assessment flow.
      AssessmentRun.create({
        caseId,
        kind:   "agent",
        result: {
          overallRisk:    result.overallRisk,
          readinessLabel: result.readinessLabel,
          actions:        result.actions,
          reasoning:      result.reasoning,
          toolCallLog:    result.toolCallLog,
        },
        triggeredBy: "agent",
        runAt:       new Date(),
      }).catch((err) =>
        console.error("[Agent Controller] AssessmentRun history write failed:", err.message)
      );

    } catch (agentError) {
      console.error("[Agent Controller] Agent run failed:", agentError);

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

      AssessmentRun.create({
        caseId,
        kind:   "agent",
        result: {
          overallRisk:    "MEDIUM",
          readinessLabel: "Assessment Failed",
          actions:        ["Please re-run the assessment."],
          reasoning:      `Agent encountered an error: ${agentError.message}`,
          toolCallLog:    [],
        },
        triggeredBy: "system",
        runAt:       new Date(),
      }).catch((err) =>
        console.error("[Agent Controller] AssessmentRun history write failed:", err.message)
      );
    }

  } catch (error) {
    console.error("[Agent Controller] Setup error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to start assessment agent" });
    }
  }
}