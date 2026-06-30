// server/routes/caseRoutes.js
//
// Route-level auth is applied here, not inside controllers.
// This makes the security model visible at a glance.
//
// ── Auth legend ───────────────────────────────────────────────────────────────
//
//   (open)                  — no auth; kept open during Phase 2→3 transition
//                             so the existing frontend still works before
//                             Phase 3 (frontend JWT) is wired in. These will
//                             be tightened once Phase 3 ships.
//
//   protect                 — valid JWT required; any role
//   protect + processorOnly — valid JWT with role === "processor" required
//
// ── Transition strategy ───────────────────────────────────────────────────────
// Routes marked "open during transition" will have protect added in Phase 3.
// The controller already reads req.user?.* defensively, so adding protect
// later is a one-line change per route with zero controller edits needed.

import express from "express";

import {
  createCase,
  getCase,
  updateCase,
  addVerifiedDocument,
  savePassportData,
  getAllCases,
  getApplicantCases,
  getCaseById,
  processorAction,
  saveQuestionnaire,
  runAssessment,
  getAssessmentHistory,
} from "../controllers/caseController.js";

import { protect, processorOnly } from "../middleware/auth.js";

const router = express.Router();

// ── Applicant: my cases ───────────────────────────────────────────────────────
// Returns only the authenticated applicant's own cases.
// This is the data source for the Applicant Dashboard (Phase 4).
router.get("/my-cases", protect, getApplicantCases);

// ── Processor: all cases ──────────────────────────────────────────────────────
// Returns every case across all applicants. Processor role required.
router.get("/", protect, processorOnly, getAllCases);

// ── Case CRUD ─────────────────────────────────────────────────────────────────
// POST /api/cases — create a new case
// Open during transition; protect will be added in Phase 3.
// Controller already stamps req.user?.* so ownership is captured
// as soon as the frontend sends a token.
router.post("/", protect, createCase);

// GET /api/cases/:id — fetch a single case
// protect runs ownership check inside getCaseById:
//   applicant → must own the case
//   processor → can access any case
router.get("/:id", protect, getCaseById);

// PUT /api/cases/:id — general case update (analysis result, etc.)
// Open during transition — protect added in Phase 3.
router.put("/:id", updateCase);

// ── Case sub-resources ────────────────────────────────────────────────────────
// These are all scoped to an existing case ID.
// protect added to the critical write paths immediately; others in Phase 3.

// Document verification — open during transition
router.put("/:id/documents",      addVerifiedDocument);

// Passport data — open during transition
router.post("/:id/passport-data", savePassportData);

// Processor-only actions (approve, reject, request docs, add note)
router.post("/:id/processor-action", protect, processorOnly, processorAction);

// Questionnaire submit — open during transition
router.post("/:id/questionnaire", saveQuestionnaire);

// Trigger readiness assessment agent — open during transition
router.post("/:id/run-assessment", runAssessment);

// Roadmap: assessment/score run history — protect runs the same
// ownership check as getCaseById (applicant must own, processor any).
router.get("/:id/assessment-history", protect, getAssessmentHistory);

export default router;