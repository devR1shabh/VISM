// src/components/input/CaseForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import countries from "../../data/countries";
import visaTypes from "../../data/visaTypes";

import { useCase, WORKFLOW_STEPS } from "../../context/CaseContext";
import { createCase } from "../../services/api";

// ── Light theme styles for react-select ──────────────────────────────────
// Replaces darkSelectStyles. The CaseForm now sits on a white card
// inside the navy assessment section. All Select logic (onChange, options,
// isSearchable) is completely unchanged — only visual styles updated.
const lightSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#FFFFFF",
    borderColor: state.isFocused ? "#4DC7F7" : "#E6E8EB",
    borderWidth: "1px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(77,199,247,0.2)" : "none",
    "&:hover": {
      borderColor: "#4DC7F7",
    },
    cursor: "pointer",
    minHeight: "44px",
    borderRadius: "8px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9CA3AF",
    fontSize: "14px",
  }),
  input: (base) => ({
    ...base,
    color: "#111827",
    fontSize: "14px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#111827",
    fontSize: "14px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E6E8EB",
    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
    borderRadius: "8px",
    overflow: "hidden",
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: "#FFFFFF",
    padding: "4px 0",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#0A2E57"
      : state.isFocused
      ? "#F7F8FA"
      : "#FFFFFF",
    color: state.isSelected ? "#FFFFFF" : "#111827",
    cursor: "pointer",
    padding: "10px 14px",
    fontSize: "14px",
    "&:active": {
      backgroundColor: "#E8F4FD",
      color: "#0A2E57",
    },
  }),
  loadingMessage: (base) => ({
    ...base,
    color: "#6B7280",
    fontSize: "14px",
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: "#6B7280",
    fontSize: "14px",
  }),
};

function CaseForm() {
  // ── All logic unchanged ───────────────────────────────────────────────────
  const navigate = useNavigate();
  const { setCaseData, clearCase } = useCase();

  const [visaType, setVisaType] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");

  const visaOptions = visaTypes.map((visa) => ({
    value: visa,
    label: visa,
  }));

  const countryOptions = countries.map((country) => ({
    value: country,
    label: country,
  }));

  const handleAnalyze = async () => {
    if (!visaType || !country) return;

    try {
      clearCase();

      const newCase = {
        caseId: `CASE-${Date.now()}`,
        visaType,
        country,
        description,
        status: "In Progress",
        createdAt: new Date().toISOString(),
        documents: [],
        extractedData: {},
        risks: [],
        tasks: [],
        notifications: [],
        readinessScore: null,
        workflowStep: WORKFLOW_STEPS.CASE_CREATED,
      };

      const savedCase = await createCase(newCase);
      setCaseData({ ...savedCase, workflowStep: WORKFLOW_STEPS.CASE_CREATED });
      navigate("/analysis");
    } catch (error) {
      console.error("Failed to create case:", error);
    }
  };

  // ── JSX — classNames updated, all props/handlers/values unchanged ─────────
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">

      <div>
        <label className="block mb-2 text-sm font-semibold text-[#374151]">
          Visa Type
        </label>
        <Select
          options={visaOptions}
          placeholder="Search or Select Visa Type"
          onChange={(selected) => setVisaType(selected?.value || "")}
          isSearchable
          styles={lightSelectStyles}
          classNamePrefix="vism-select"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold text-[#374151]">
          Destination Country
        </label>
        <Select
          options={countryOptions}
          placeholder="Search or Select Country"
          onChange={(selected) => setCountry(selected?.value || "")}
          isSearchable
          styles={lightSelectStyles}
          classNamePrefix="vism-select"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-semibold text-[#374151]">
          Case Description
        </label>
        <textarea
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-white border border-[#E6E8EB] text-[#111827] p-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4DC7F7] focus:border-[#4DC7F7] placeholder-[#9CA3AF] transition resize-none"
          placeholder="Describe the immigration or visa case in detail..."
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!visaType || !country}
        className="w-full bg-[#0A2E57] text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-[#0F3D6E] active:scale-[0.99] transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        Analyze Case
      </button>

    </div>
  );
}

export default CaseForm;