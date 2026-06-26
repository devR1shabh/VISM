// src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

import { ApplicantAuthProvider } from "./context/ApplicantAuthContext.jsx";
import { ProcessorAuthProvider } from "./context/ProcessorAuthContext.jsx";
import { CaseProvider }          from "./context/CaseContext.jsx";

// Provider order matters:
//   ApplicantAuthProvider — outermost, establishes who is logged in
//   ProcessorAuthProvider — independent auth for processor portal
//   CaseProvider          — depends on auth being available (Phase 4 will
//                           use useApplicantAuth inside CaseProvider to
//                           scope case fetching to the logged-in user)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApplicantAuthProvider>
      <ProcessorAuthProvider>
        <CaseProvider>
          <App />
        </CaseProvider>
      </ProcessorAuthProvider>
    </ApplicantAuthProvider>
  </StrictMode>
);