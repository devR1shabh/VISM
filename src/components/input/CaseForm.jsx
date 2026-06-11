// src/components/input/CaseForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import countries from "../../data/countries";
import visaTypes from "../../data/visaTypes";

import { useCase, WORKFLOW_STEPS } from "../../context/CaseContext";
import { createCase } from "../../services/api";

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
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Visa Type
        </label>

        <Select
          options={visaOptions}
          placeholder="Search or Select Visa Type"
          onChange={(selected) => setVisaType(selected?.value || "")}
          isSearchable
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Destination Country
        </label>

        <Select
          options={countryOptions}
          placeholder="Search or Select Country"
          onChange={(selected) => setCountry(selected?.value || "")}
          isSearchable
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Case Description
        </label>

        <textarea
          rows="6"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the immigration or visa case in detail..."
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!visaType || !country}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Analyze Case
      </button>
    </div>
  );
}

export default CaseForm;