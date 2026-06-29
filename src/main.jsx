// src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

import { ApplicantAuthProvider } from "./context/ApplicantAuthContext.jsx";
import { ProcessorAuthProvider } from "./context/ProcessorAuthContext.jsx";
import { CaseProvider }          from "./context/CaseContext.jsx";
import { ConfigProvider }        from "./context/ConfigContext.jsx";

// Provider order:
//   ConfigProvider        — outermost; fetches shared constants once on mount
//   ApplicantAuthProvider — establishes who is logged in
//   ProcessorAuthProvider — independent auth for processor portal
//   CaseProvider          — depends on auth being available

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider>
      <ApplicantAuthProvider>
        <ProcessorAuthProvider>
          <CaseProvider>
            <App />
          </CaseProvider>
        </ProcessorAuthProvider>
      </ApplicantAuthProvider>
    </ConfigProvider>
  </StrictMode>
);