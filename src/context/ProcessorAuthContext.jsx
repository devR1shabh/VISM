// src/context/ProcessorAuthContext.jsx
//
// Manages processor authentication state.
//
// PHASE 3 CHANGE:
// Replaced the hardcoded credential check (username: "processor", password: "vism2024")
// with a real POST /api/auth/login call. The processor account is now a proper
// User document in MongoDB (seeded via server/scripts/seedProcessor.js).
//
// The context shape is intentionally kept identical to before so that
// ProcessorProtectedRoute, ProcessorDashboard and ProcessorCaseDetail
// require zero changes — they all consume { auth, isAuthenticated, logout }
// and that API is preserved.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  loginProcessor,
  getMe,
  clearProcessorToken,
  getProcessorToken,
} from "../services/authService.js";

const ProcessorAuthContext = createContext(null);

export function ProcessorAuthProvider({ children }) {
  // auth holds the User object: { id, name, email, role }
  // Mirrors the old shape closely enough that consumers don't break.
  const [auth, setAuth]         = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Rehydrate on mount ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function rehydrate() {
      const token = getProcessorToken();
      const me    = await getMe(token);

      if (!cancelled) {
        if (me && me.role === "processor") {
          setAuth(me);
        } else if (me && me.role !== "processor") {
          clearProcessorToken();
        }
        setIsLoading(false);
      }
    }

    rehydrate();
    return () => { cancelled = true; };
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────
  // Called by ProcessorLogin.jsx.
  // Returns true on success (to match the original API surface),
  // throws on failure so ProcessorLogin can display the server error.
  const login = useCallback(async (email, password) => {
    const data = await loginProcessor({ email, password });
    setAuth(data.user);
    return true;
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearProcessorToken();
    setAuth(null);
  }, []);

  const isAuthenticated = Boolean(auth);

  return (
    <ProcessorAuthContext.Provider
      value={{ auth, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </ProcessorAuthContext.Provider>
  );
}

export function useProcessorAuth() {
  const ctx = useContext(ProcessorAuthContext);
  if (!ctx) {
    throw new Error("useProcessorAuth must be used within ProcessorAuthProvider");
  }
  return ctx;
}