// src/context/ApplicantAuthContext.jsx
//
// Manages applicant authentication state for the entire frontend.
//
// On mount it silently tries to restore a session from a stored JWT
// (via GET /api/auth/me). This means applicants stay logged in across
// browser refreshes without re-entering credentials.
//
// Exposes:
//   user            — the authenticated User object, or null
//   isAuthenticated — Boolean convenience flag
//   isLoading       — true while the initial /me check is in flight
//   login(email, password) — returns { user } or throws
//   register(name, email, password) — returns { user } or throws
//   logout()        — clears token + state
//
// This context is consumed via the useApplicantAuth() hook.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  loginApplicant,
  register as registerUser,
  getMe,
  clearApplicantToken,
  getApplicantToken,
} from "../services/authService.js";

const ApplicantAuthContext = createContext(null);

export function ApplicantAuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Rehydrate on mount ────────────────────────────────────────────────────
  // When the app loads, check if there's a valid token in localStorage.
  // GET /api/auth/me validates it server-side and returns the user profile.
  // If the token is expired or missing, getMe() returns null — we stay logged out.
  useEffect(() => {
    let cancelled = false;

    async function rehydrate() {
      const token = getApplicantToken();
      const me    = await getMe(token);

      if (!cancelled) {
        // Only set user if the role is correct — belt and suspenders check
        // in case a processor token somehow ended up in the applicant key.
        if (me && me.role === "applicant") {
          setUser(me);
        } else if (me && me.role !== "applicant") {
          // Wrong role in applicant slot — clear it
          clearApplicantToken();
        }
        setIsLoading(false);
      }
    }

    rehydrate();
    return () => { cancelled = true; };
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const data = await loginApplicant({ email, password });
    setUser(data.user);
    return data;
  }, []);

  // ── register ──────────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    const data = await registerUser({ name, email, password });
    setUser(data.user);
    return data;
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────
  // Clears token and user state.
  // CaseContext.clearCase() is called separately from the component
  // that triggers logout — keeping contexts decoupled.
  const logout = useCallback(() => {
    clearApplicantToken();
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(user);

  return (
    <ApplicantAuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </ApplicantAuthContext.Provider>
  );
}

export function useApplicantAuth() {
  const ctx = useContext(ApplicantAuthContext);
  if (!ctx) {
    throw new Error("useApplicantAuth must be used within ApplicantAuthProvider");
  }
  return ctx;
}