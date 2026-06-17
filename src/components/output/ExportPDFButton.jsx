// src/components/output/ExportPDFButton.jsx
// Phase 2 — PDF export button that matches the VISM design system.
// Plugs into any page. Reads caseData + uploadedDocuments from context.

import { useState } from "react";
import { Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useCase } from "../../context/CaseContext";
import { generateVisaPDF } from "../../utils/pdfGenerator";

// ── Export states ────────────────────────────────────────────────────────────
const STATE = {
  IDLE:    "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR:   "error",
};

function ExportPDFButton({ className = "" }) {
  const { caseData, uploadedDocuments } = useCase();
  const [exportState, setExportState] = useState(STATE.IDLE);

  const analysis = caseData?.analysis || null;

  async function handleExport() {
    if (exportState === STATE.LOADING) return;
    if (!caseData) return;

    setExportState(STATE.LOADING);

    try {
      // generateVisaPDF is synchronous (jsPDF) — wrap in setTimeout to let
      // the loading state render before the blocking call.
      await new Promise((resolve) => setTimeout(resolve, 50));
      generateVisaPDF(caseData, analysis, uploadedDocuments || []);
      setExportState(STATE.SUCCESS);
      setTimeout(() => setExportState(STATE.IDLE), 3000);
    } catch (err) {
      console.error("PDF export failed:", err);
      setExportState(STATE.ERROR);
      setTimeout(() => setExportState(STATE.IDLE), 4000);
    }
  }

  // ── Variant styles by state ─────────────────────────────────────────────
  const variants = {
    [STATE.IDLE]: {
      btn: "bg-[var(--c-green)] hover:bg-[var(--c-green-mid)] text-white",
      icon: <Download size={15} />,
      label: "Export PDF Report",
    },
    [STATE.LOADING]: {
      btn: "bg-[var(--c-green)] text-white opacity-80 cursor-not-allowed",
      icon: <Loader2 size={15} className="animate-spin" />,
      label: "Generating PDF…",
    },
    [STATE.SUCCESS]: {
      btn: "bg-[var(--c-success)] text-white",
      icon: <CheckCircle size={15} />,
      label: "PDF Downloaded",
    },
    [STATE.ERROR]: {
      btn: "bg-[var(--c-error)] text-white",
      icon: <AlertCircle size={15} />,
      label: "Export Failed — Try Again",
    },
  };

  const { btn, icon, label } = variants[exportState];

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={!caseData || exportState === STATE.LOADING}
      className={`inline-flex items-center gap-2 rounded-[var(--r-lg)] px-5 py-2.5 text-sm font-semibold shadow-[var(--shadow-card)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${btn} ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}

export default ExportPDFButton;