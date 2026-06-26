// src/services/api.js
//
// All backend fetch calls live here — no component ever calls fetch() directly.
//
// PHASE 3 CHANGE:
// Every request that hits a protected endpoint now automatically includes
// the applicant's JWT in the Authorization header via authHeaders().
// No component needs to know about tokens — it just calls the function.

import { getApplicantToken, getProcessorToken } from "./authService.js";

const API_URL = import.meta.env.VITE_API_URL;

// ── Auth header builder ───────────────────────────────────────────────────────
// Reads the applicant token from localStorage and returns the correct headers.
// Returns an empty object if no token is present (unauthenticated requests).
function authHeaders() {
  const token = getApplicantToken();
  return token
    ? { "Authorization": `Bearer ${token}` }
    : {};
}

// ── Error helper ──────────────────────────────────────────────────────────────
// Extracts the server error message from a non-ok response.
async function handleError(response, fallback) {
  try {
    const body = await response.json();
    throw new Error(body.error || fallback);
  } catch (e) {
    if (e.message !== fallback) throw e;
    throw new Error(fallback);
  }
}

/* =============================================================================
   VISA ANALYSIS
============================================================================= */

export async function generateAnalysis(visaType, country, description) {
  const response = await fetch(`${API_URL}/analysis`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body:    JSON.stringify({ visaType, country, description }),
  });

  if (!response.ok) throw new Error("Failed to generate analysis");
  return response.json();
}

/* =============================================================================
   PASSPORT OCR
============================================================================= */

export async function uploadPassport(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/documents/passport`, {
    method:  "POST",
    headers: { ...authHeaders() },  // No Content-Type — let browser set multipart boundary
    body:    formData,
  });

  if (!response.ok) throw new Error("Passport extraction failed");
  return response.json();
}

/* =============================================================================
   DOCUMENT VERIFICATION
============================================================================= */

export async function verifyDocument(file, documentType) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);

  const response = await fetch(`${API_URL}/documents/verify`, {
    method:  "POST",
    headers: { ...authHeaders() },
    body:    formData,
  });

  if (!response.ok) throw new Error("Document verification failed");
  return response.json();
}

/* =============================================================================
   CASE MANAGEMENT
============================================================================= */

export async function createCase(caseData) {
  const response = await fetch(`${API_URL}/cases`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body:    JSON.stringify(caseData),
  });

  if (!response.ok) await handleError(response, "Failed to create case");
  return response.json();
}

export async function getCase(caseId) {
  const response = await fetch(`${API_URL}/cases/${caseId}`, {
    headers: { ...authHeaders() },
  });

  if (!response.ok) throw new Error("Failed to fetch case");
  return response.json();
}

export async function updateCase(caseId, caseData) {
  const response = await fetch(`${API_URL}/cases/${caseId}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body:    JSON.stringify(caseData),
  });

  if (!response.ok) throw new Error("Failed to update case");
  return response.json();
}

// ── getApplicantCases ─────────────────────────────────────────────────────────
// Fetches all cases belonging to the currently authenticated applicant.
// This is the data source for the Applicant Dashboard (Phase 4).
// Returns an array sorted by createdAt descending (newest first).
export async function getApplicantCases() {
  const response = await fetch(`${API_URL}/cases/my-cases`, {
    headers: { ...authHeaders() },
  });

  if (!response.ok) await handleError(response, "Failed to fetch your cases");
  return response.json();
}

/* =============================================================================
   DOCUMENT STORAGE
============================================================================= */

export async function addVerifiedDocument(caseId, documentType) {
  const response = await fetch(`${API_URL}/cases/${caseId}/documents`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body:    JSON.stringify({ documentType }),
  });

  if (!response.ok) throw new Error("Failed to save document");
  return response.json();
}

/* =============================================================================
   PASSPORT DATA PERSISTENCE
============================================================================= */

export async function savePassportData(caseId, passportData) {
  const response = await fetch(`${API_URL}/cases/${caseId}/passport-data`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body:    JSON.stringify({ passportData }),
  });

  if (!response.ok) throw new Error("Failed to save passport data");
  return response.json();
}

/* =============================================================================
   NAVI AI COPILOT
============================================================================= */

export async function sendNaviMessage(caseContext, message) {
  const response = await fetch(`${API_URL}/copilot/chat`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body:    JSON.stringify({ caseContext, message }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Navi request failed");
  }

  return response.json();
}

/* =============================================================================
   QUESTIONNAIRE
============================================================================= */

export async function saveQuestionnaire(caseId, answers) {
  const response = await fetch(`${API_URL}/cases/${caseId}/questionnaire`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body:    JSON.stringify({ answers }),
  });

  if (!response.ok) throw new Error("Failed to save questionnaire");
  return response.json();
}

/* =============================================================================
   READINESS ASSESSMENT AGENT
============================================================================= */

export async function triggerAssessmentAgent(caseId) {
  const response = await fetch(`${API_URL}/cases/${caseId}/run-assessment`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });

  if (!response.ok) throw new Error("Failed to start assessment agent");
  return response.json();
}

export async function pollCaseForAssessment(caseId) {
  const response = await fetch(`${API_URL}/cases/${caseId}`, {
    headers: { ...authHeaders() },
  });

  if (!response.ok) throw new Error("Failed to fetch case");
  return response.json();
}

/* =============================================================================
   PROCESSOR API FUNCTIONS
   Phase 6: Consolidated from inline fetch calls in ProcessorDashboard.jsx,
   ProcessorCaseDetail.jsx, and ProcessorActions.jsx.
   All processor calls use getProcessorToken() for auth.
============================================================================= */


// ── Processor auth header builder ─────────────────────────────────────────────
function processorAuthHeaders() {
  const token = getProcessorToken();
  return token
    ? { "Authorization": `Bearer ${token}` }
    : {};
}

// ── getAllCases ────────────────────────────────────────────────────────────────
// GET /api/cases — processor only. Returns all cases across all applicants.
export async function getAllCases() {
  const response = await fetch(`${API_URL}/cases`, {
    headers: { ...processorAuthHeaders() },
  });
  if (!response.ok) throw new Error("Failed to fetch cases");
  return response.json();
}

// ── getCaseByIdProcessor ──────────────────────────────────────────────────────
// GET /api/cases/:id — fetches a single case with processor auth.
export async function getCaseByIdProcessor(caseId) {
  const response = await fetch(`${API_URL}/cases/${caseId}`, {
    headers: { ...processorAuthHeaders() },
  });
  if (!response.ok) throw new Error("Case not found");
  return response.json();
}

// ── sendProcessorAction ───────────────────────────────────────────────────────
// POST /api/cases/:id/processor-action
// Single source of truth — replaces the duplicate function that existed in
// both ProcessorActions.jsx (as sendAction) and ProcessorCaseDetail.jsx
// (as sendProcessorAction).
export async function sendProcessorAction(caseId, action, note) {
  const response = await fetch(`${API_URL}/cases/${caseId}/processor-action`, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      ...processorAuthHeaders(),
    },
    body: JSON.stringify({ action, note: note || "" }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Action failed");
  }
  return response.json();
}