// src/context/ProcessorAuthContext.jsx

import { createContext, useContext, useState } from "react";

// Hardcoded processor credentials.
// In a production system these would come from a backend auth service.
const PROCESSOR_CREDENTIALS = {
  username: "processor",
  password: "vism2024",
};

const STORAGE_KEY = "vism_processor_auth";

function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveAuth(value) {
  try {
    if (value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

const ProcessorAuthContext = createContext(null);

export function ProcessorAuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth());

  const login = (username, password) => {
    if (
      username === PROCESSOR_CREDENTIALS.username &&
      password === PROCESSOR_CREDENTIALS.password
    ) {
      const session = { username, loggedInAt: new Date().toISOString() };
      saveAuth(session);
      setAuth(session);
      return true;
    }
    return false;
  };

  const logout = () => {
    saveAuth(null);
    setAuth(null);
  };

  const isAuthenticated = Boolean(auth);

  return (
    <ProcessorAuthContext.Provider value={{ auth, isAuthenticated, login, logout }}>
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