// server/controllers/documentController.js

import { extractPassport } from "../services/passportExtractionService.js";
import { verifyDocument } from "../services/documentVerificationService.js";

export async function uploadPassport(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await extractPassport(req.file.buffer);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Passport extraction failed" });
  }
}

export async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const documentType = req.body.documentType;

    if (!documentType) {
      return res.status(400).json({ error: "documentType is required" });
    }

    const result = await verifyDocument(req.file.buffer, documentType);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Document verification failed" });
  }
}