import { useState } from "react";
import { useNavigate } from "react-router-dom";

import countries from "../../data/countries";
import visaTypes from "../../data/visaTypes";

function CaseForm() {
  const navigate = useNavigate();

  const [visaType, setVisaType] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");

  const handleAnalyze = () => {
    navigate("/analysis", {
      state: {
        visaType,
        country,
        description,
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">

      {/* Visa Type */}
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

      {/* Destination Country */}
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

          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Case Description */}
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

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
      >
        Analyze Case
      </button>

    </div>
  );
}

export default CaseForm;