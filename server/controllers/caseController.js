// server/controllers/caseController.js

import Case from "../models/Case.js";
import { runReadinessAgent } from "../services/assessmentAgentService.js";
import {
  sendCaseSubmittedEmail,
  sendCaseUpdateEmail,
} from "../services/emailService.js";

// ── createCase ────────────────────────────────────────────────────────────────
// POST /api/cases
// Protected: applicant JWT required.
//
// Stamps applicantId, applicantEmail, applicantName from req.user so every
// case is permanently linked to the authenticated applicant who created it.

export async function createCase(req, res) {
  try {
    // Snapshot ownership fields from the authenticated user.
    // req.user is set by protect middleware (Phase 1 auth.js).
    // Defensively defaulted so legacy/dev requests without a token still work
    // during the transition period — remove the nullish defaults once Phase 3
    // (frontend auth) is fully wired and protect is enforced on this route.
    const caseData = {
      ...req.body,
      applicantId:    req.user?._id    ?? null,
      applicantEmail: req.user?.email  ?? "",
      applicantName:  req.user?.name   ?? "",
    };

    const newCase = await Case.create(caseData);

    // ── Send case-submitted email (Phase 5) ───────────────────────────────────
    // Fire-and-forget — a failed email must never crash case creation.
    // The .catch() is belt-and-suspenders; emailService never throws internally.
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

// ── getAllCases ────────────────────────────────────────────────────────────────
// GET /api/cases
// Processor only — returns ALL cases across all applicants.
// Protected by: protect + processorOnly middleware (set in caseRoutes.js).

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
// GET /api/my-cases
// Applicant only — returns ONLY the authenticated user's own cases.
// Protected by: protect middleware (set in caseRoutes.js).
//
// This is the data source for the Applicant Dashboard (Phase 4).
// The applicantId index on Case makes this query fast even at scale.

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
// GET /api/cases/:id
// Accessible by:
//   - The applicant who owns the case (applicantId matches req.user._id)
//   - Any processor (role === "processor")
//
// Ownership is enforced here so a logged-in applicant cannot read
// another applicant's case by guessing MongoDB IDs.

export async function getCaseById(req, res) {
  try {
    const foundCase = await Case.findById(req.params.id).lean();

    if (!foundCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    // ── Ownership check ────────────────────────────────────────────────────────
    // Processors can see any case.
    // Applicants can only see their own.
    // req.user may be undefined if protect is not yet on this route —
    // the conditional guard keeps legacy behaviour during transition.
    if (req.user) {
      const isProcessor = req.user.role === "processor";
      const isOwner     = foundCase.applicantId &&
                          String(foundCase.applicantId) === String(req.user._id);

      if (!isProcessor && !isOwner) {
        // Return 404 not 403 — don't confirm the case exists to unauthorized callers
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

    // ── Send email notification to applicant (Phase 5) ──────────────────────────
    // Fire-and-forget — a failed email never crashes the processor's response.
    // view_case is excluded: it only logs an audit entry, not a status change.
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

    // ── Mark as running ───────────────────────────────────────────────────────
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
    }

  } catch (error) {
    console.error("[Agent Controller] Setup error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to start assessment agent" });
    }
  }
}