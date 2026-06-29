// src/context/ApplicantAuthContext.jsx
//
// ONBOARDING REDESIGN CHANGE:
//   register() no longer auto-logs the user in.
//   It calls the API, then immediately clears the token that authService stored.
//   The user must sign in explicitly after registering.
//   This gives us the: Register → Login → Apply flow.

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
  const [user, setUser]           = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Rehydrate on mount ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function rehydrate() {
      const token = getApplicantToken();
      const me    = await getMe(token);

      if (!cancelled) {
        if (me && me.role === "applicant") {
          setUser(me);
        } else if (me && me.role !== "applicant") {
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
  // CHANGED: Creates the account via API but does NOT establish a session.
  // authService.register() stores a token — we clear it immediately so the
  // user remains unauthenticated and must sign in explicitly.
  const register = useCallback(async (name, email, password) => {
    const data = await registerUser({ name, email, password });
    // Clear the token authService just stored — we want explicit login
    clearApplicantToken();
    // Do NOT call setUser — user stays unauthenticated
    return data; // { token (discarded), user: { id, name, email, role } }
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────
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

