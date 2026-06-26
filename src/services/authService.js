// src/services/authService.js
//
// All authentication API calls live here.
// Components never call fetch() for auth — they import from this file.
//
// Token storage strategy:
//   - Applicant token → localStorage key "vism_applicant_token"
//   - Processor token → localStorage key "vism_processor_token"
//   - Both keys stored separately so an applicant logging out
//     does not evict an open processor session and vice versa.

const API_URL = import.meta.env.VITE_API_URL;

const APPLICANT_TOKEN_KEY = "vism_applicant_token";
const PROCESSOR_TOKEN_KEY = "vism_processor_token";

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getApplicantToken() {
  return localStorage.getItem(APPLICANT_TOKEN_KEY) || null;
}

export function getProcessorToken() {
  return localStorage.getItem(PROCESSOR_TOKEN_KEY) || null;
}

function saveApplicantToken(token) {
  localStorage.setItem(APPLICANT_TOKEN_KEY, token);
}

function saveProcessorToken(token) {
  localStorage.setItem(PROCESSOR_TOKEN_KEY, token);
}

export function clearApplicantToken() {
  localStorage.removeItem(APPLICANT_TOKEN_KEY);
}

export function clearProcessorToken() {
  localStorage.removeItem(PROCESSOR_TOKEN_KEY);
}

// ── Shared fetch wrapper ──────────────────────────────────────────────────────
// Throws a proper Error with the server's message on non-2xx responses.

async function authFetch(path, options = {}) {
  const response = await fetch(`${API_URL}/auth${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Authentication request failed.");
  }

  return data;
}

// ── register ──────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Returns { token, user } on success.
// Saves token to localStorage for the applicant.

export async function register({ name, email, password }) {
  const data = await authFetch("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  saveApplicantToken(data.token);
  return data; // { token, user: { id, name, email, role } }
}

// ── loginApplicant ────────────────────────────────────────────────────────────
// POST /api/auth/login
// Validates role === "applicant" before saving token.
// Throws if a processor tries to log in through the applicant portal.

export async function loginApplicant({ email, password }) {
  const data = await authFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data.user.role !== "applicant") {
    throw new Error("This portal is for applicants only. Use the Processor Portal.");
  }

  saveApplicantToken(data.token);
  return data;
}

// ── loginProcessor ────────────────────────────────────────────────────────────
// POST /api/auth/login
// Validates role === "processor" before saving token.
// Throws if an applicant tries to log in through the processor portal.

export async function loginProcessor({ email, password }) {
  const data = await authFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data.user.role !== "processor") {
    throw new Error("Access denied. Processor credentials required.");
  }

  saveProcessorToken(data.token);
  return data;
}

// ── getMe ─────────────────────────────────────────────────────────────────────
// GET /api/auth/me
// Used on app load to rehydrate auth state from a stored token.
// Returns null (does not throw) if the token is missing or expired —
// callers treat null as "not logged in" and clear their state.

export async function getMe(token) {
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.user;
  } catch {
    return null;
  }
}