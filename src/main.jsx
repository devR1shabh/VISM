// src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

import { CaseProvider }          from "./context/CaseContext";
import { ProcessorAuthProvider } from "./context/ProcessorAuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProcessorAuthProvider>
      <CaseProvider>
        <App />
      </CaseProvider>
    </ProcessorAuthProvider>
  </StrictMode>
);