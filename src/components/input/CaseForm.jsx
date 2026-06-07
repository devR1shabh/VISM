import { useState } from "react";
import { useNavigate } from "react-router-dom";

import countries from "../../data/countries";
import visaTypes from "../../data/visaTypes";

import { useCase } from "../../context/CaseContext";

function CaseForm() {
  const navigate = useNavigate();
  const { setCaseData, clearCase } = useCase();

  const [visaType, setVisaType] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");

  const handleAnalyze = () => {
    if (!visaType || !country) return;

    // Clear any previous case + documents before starting fresh
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
    };

    setCaseData(newCase);

    navigate("/analysis");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Visa Type
        </label>

        <select
          value={visaType}
          onChange={(e) => setVisaType(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Visa Type</option>

          {visaTypes.map((visa) => (
            <option key={visa} value={visa}>
              {visa}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Destination Country
        </label>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Country</option>

          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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