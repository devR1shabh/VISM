// src/context/ConfigContext.jsx
// ══════════════════════════════════════════════════════════════════════════════
// Fetches shared constants from GET /api/config on app mount and provides
// them to the entire React tree via the useConfig() hook.
//
// Falls back to static values if the API is unreachable — the app stays
// fully functional. A console warning is logged.
//
// Usage:
//   const { documents, visaTypes } = useConfig();
//   documents.mandatory  → string[]
//   documents.supporting → string[]
//   documents.all        → string[]
//   documents.categoryMap → { [name]: "mandatory" | "supporting" }
//   visaTypes            → string[]
// ══════════════════════════════════════════════════════════════════════════════

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { getConfig } from "../services/api.js";

// ── Fallback config ───────────────────────────────────────────────────────────
// Mirrors server/config/constants.js exactly.
// The ONLY acceptable duplicate in the codebase — a safety net, not a source.
// Update both files whenever the canonical list changes.

const FALLBACK = {
  documents: {
    mandatory: [
      "Passport",
      "Bank Statement",
      "Employment Letter",
      "Resume / CV",
      "Academic Transcript",
      "Degree Certificate",
      "Statement of Purpose",
      "Police Clearance Certificate",
      "Address Proof",
    ],
    supporting: [
      "Passport Size Photograph",
      "National ID Card",
      "Birth Certificate",
      "Travel History Document",
      "Proof of Funds",
      "Medical Certificate",
    ],
    all: [
      "Passport",
      "Bank Statement",
      "Employment Letter",
      "Resume / CV",
      "Academic Transcript",
      "Degree Certificate",
      "Statement of Purpose",
      "Police Clearance Certificate",
      "Address Proof",
      "Passport Size Photograph",
      "National ID Card",
      "Birth Certificate",
      "Travel History Document",
      "Proof of Funds",
      "Medical Certificate",
    ],
    categoryMap: {
      "Passport":                     "mandatory",
      "Bank Statement":               "mandatory",
      "Employment Letter":            "mandatory",
      "Resume / CV":                  "mandatory",
      "Academic Transcript":          "mandatory",
      "Degree Certificate":           "mandatory",
      "Statement of Purpose":         "mandatory",
      "Police Clearance Certificate": "mandatory",
      "Address Proof":                "mandatory",
      "Passport Size Photograph":     "supporting",
      "National ID Card":             "supporting",
      "Birth Certificate":            "supporting",
      "Travel History Document":      "supporting",
      "Proof of Funds":               "supporting",
      "Medical Certificate":          "supporting",
    },
  },
  visaTypes: [
    "Student Visa",
    "Tourist Visa",
    "Work Visa",
    "Permanent Residency Visa",
    "Business Visa",
    "Family Sponsorship Visa",
    "Investor Visa",
  ],
};

const ConfigContext = createContext(FALLBACK);

export function ConfigProvider({ children }) {
  const [config, setConfig]       = useState(FALLBACK);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getConfig()
      .then((data) => {
        if (!cancelled) setConfig(data);
      })
      .catch(() => {
        if (!cancelled) {
          console.warn(
            "[ConfigContext] /api/config unreachable. Using built-in fallback."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <ConfigContext.Provider value={{ ...config, isLoading }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return ctx;
}