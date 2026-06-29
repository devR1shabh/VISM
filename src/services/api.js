// src/services/api.js
//
// FEATURE 7 CHANGE:
//   Added getCountryGuidelines() — GET /api/guidelines?country=...&visaType=...

import { getApplicantToken, getProcessorToken } from "./authService.js";

const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = getApplicantToken();
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

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
   CONFIG
============================================================================= */
export async function getConfig() {
  const response = await fetch(`${API_URL}/config`);
  if (!response.ok) throw new Error("Failed to fetch config");
  return response.json();
}

/* =============================================================================
   COUNTRY GUIDELINES — Feature 7
   Public endpoint — no auth needed.
   Returns processing times, fees, requirements for a country + visa type.
============================================================================= */
export async function getCountryGuidelines(country, visaType) {
  const params   = new URLSearchParams({ country, visaType });
  const response = await fetch(`${API_URL}/guidelines?${params}`);
  if (!response.ok) throw new Error("Failed to fetch country guidelines");
  return response.json();
}

/* =============================================================================
   PAYMENT — Feature 6
============================================================================= */
export async function completePayment(caseId, { amount, packageId }) {
  const response = await fetch(`${API_URL}/payment/${caseId}/complete`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body:    JSON.stringify({ amount, packageId }),
  });
  if (!response.ok) await handleError(response, "Payment failed");
  return response.json();
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
    headers: { ...authHeaders() },
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
   PASSPORT DATA
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
   ASSESSMENT AGENT
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
   PROCESSOR
============================================================================= */
function processorAuthHeaders() {
  const token = getProcessorToken();
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

export async function getAllCases() {
  const response = await fetch(`${API_URL}/cases`, {
    headers: { ...processorAuthHeaders() },
  });
  if (!response.ok) throw new Error("Failed to fetch cases");
  return response.json();
}

export async function getCaseByIdProcessor(caseId) {
  const response = await fetch(`${API_URL}/cases/${caseId}`, {
    headers: { ...processorAuthHeaders() },
  });
  if (!response.ok) throw new Error("Case not found");
  return response.json();
}

export async function sendProcessorAction(caseId, action, note) {
  const response = await fetch(`${API_URL}/cases/${caseId}/processor-action`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", ...processorAuthHeaders() },
    body:    JSON.stringify({ action, note: note || "" }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Action failed");
  }
  return response.json();
}