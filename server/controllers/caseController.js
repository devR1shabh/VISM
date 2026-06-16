// server/controllers/caseController.js

import Case from "../models/Case.js";

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
    const caseId = req.params.id;
    const uploadedAt = new Date();

    let updatedCase = await Case.findOneAndUpdate(
      {
        _id: caseId,
        "uploadedDocuments.type": documentType,
      },
      {
        $set: {
          "uploadedDocuments.$.verified": true,
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

    const updates  = {};
    const pushOps  = {};

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