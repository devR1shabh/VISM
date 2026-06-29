// server/routes/documentRoutes.js
//
// Phase 6: Multer hardened with file size limits and MIME type validation.
//
// Limits:
//   - 10 MB per file — passport scans and document images are rarely larger
//   - Allowed MIME types: JPEG, PNG, PDF, WEBP — the OCR services support these
//
// Multer errors are caught by the custom errorHandler middleware so the API
// always returns a clean JSON error instead of an Express HTML error page.

import express from "express";
import multer  from "multer";

import { uploadPassport, uploadDocument } from "../controllers/documentController.js";

const router = express.Router();

// ── Allowed MIME types ────────────────────────────────────────────────────────
const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE    = MAX_FILE_SIZE_MB * 1024 * 1024; // bytes

// ── Multer config ─────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize:  MAX_FILE_SIZE,
    files:     1,           // one file per request
    fields:    5,           // reasonable cap on non-file fields
  },

  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file type: ${file.mimetype}. ` +
          `Allowed types: JPEG, PNG, WEBP, PDF.`
        )
      );
    }
  },
});

// ── Multer error handler ──────────────────────────────────────────────────────
// Multer throws its own error class. We catch it here and return a clean
// 400 JSON response instead of letting it bubble to Express's HTML handler.
function handleMulterError(err, _req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: `File too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`,
      });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  if (err && err.message) {
    return res.status(400).json({ error: err.message });
  }

  next(err);
}

// ── Routes ────────────────────────────────────────────────────────────────────
router.post(
  "/passport",
  upload.single("file"),
  handleMulterError,
  uploadPassport
);

router.post(
  "/verify",
  upload.single("file"),
  handleMulterError,
  uploadDocument
);

export default router;