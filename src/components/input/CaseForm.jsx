// src/components/input/CaseForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import countries from "../../data/countries";
import visaTypes from "../../data/visaTypes";

import { useCase, WORKFLOW_STEPS } from "../../context/CaseContext";
import { createCase } from "../../services/api";

// ── Custom React Select styles for dark theme
const darkSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#083D4A",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: "1px",
    color: "#FFFFFF",
    boxShadow: state.isFocused ? "0 0 0 1px #22E7C5" : "none",
    borderColor: state.isFocused ? "#22E7C5" : "rgba(255,255,255,0.1)",
    "&:hover": {
      borderColor: "#22E7C5",
    },
    cursor: "pointer",
    minHeight: "42px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#B8C5D1",
  }),
  input: (base) => ({
    ...base,
    color: "#FFFFFF",
    caretColor: "#22E7C5",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#FFFFFF",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#083D4A",
    border: "1px solid rgba(34,231,197,0.2)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: "#083D4A",
    padding: "8px 0",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#22E7C5"
      : state.isFocused
      ? "#0a4d5f"
      : "#083D4A",
    color: state.isSelected ? "#061A28" : "#FFFFFF",
    cursor: "pointer",
    padding: "12px 16px",
    "&:active": {
      backgroundColor: "#22E7C5",
      color: "#061A28",
    },
  }),
  loadingMessage: (base) => ({
    ...base,
    color: "#B8C5D1",
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: "#B8C5D1",
  }),
};

function CaseForm() {
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
      // Wipe all previous case data before starting fresh
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

        // Workflow step: case has been created → Analysis is now unlocked
        workflowStep: WORKFLOW_STEPS.CASE_CREATED,
      };

      const savedCase = await createCase(newCase);

      // Ensure workflowStep is persisted even if the backend strips unknown fields
      setCaseData({ ...savedCase, workflowStep: WORKFLOW_STEPS.CASE_CREATED });

      navigate("/analysis");
    } catch (error) {
      console.error("Failed to create case:", error);
    }
  };

  return (
    <div className="bg-[#083D4A] p-8 rounded-lg shadow-xl border border-white/10 space-y-6 backdrop-blur-sm">
      <div>
        <label className="block mb-3 font-medium text-[#B8C5D1]">
          Visa Type
        </label>

        <Select
          options={visaOptions}
          placeholder="Search or Select Visa Type"
          onChange={(selected) => setVisaType(selected?.value || "")}
          isSearchable
          styles={darkSelectStyles}
          classNamePrefix="dark-select"
        />
      </div>

      <div>
        <label className="block mb-3 font-medium text-[#B8C5D1]">
          Destination Country
        </label>

        <Select
          options={countryOptions}
          placeholder="Search or Select Country"
          onChange={(selected) => setCountry(selected?.value || "")}
          isSearchable
          styles={darkSelectStyles}
          classNamePrefix="dark-select"
        />
      </div>

      <div>
        <label className="block mb-3 font-medium text-[#B8C5D1]">
          Case Description
        </label>

        <textarea
          rows="6"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#061A28] border border-white/10 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22E7C5] focus:border-[#22E7C5] placeholder-[#B8C5D1] transition"
          placeholder="Describe the immigration or visa case in detail..."
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!visaType || !country}
        className="w-full bg-[#22E7C5] text-[#061A28] py-3 rounded-lg font-semibold hover:bg-[#39F5D5] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#22E7C5]/20"
      >
        Analyze Case
      </button>
    </div>
  );
}

export default CaseForm;