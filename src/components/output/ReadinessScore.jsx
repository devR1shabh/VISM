function ReadinessScore({ score }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Application Readiness Assessment
      </h2>

      <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">

        <div
          className="bg-green-600 h-8 flex items-center justify-center text-white font-semibold"
          style={{ width: `${score}%` }}
        >
          {score}%
        </div>

      </div>

      <div className="mt-4 space-y-2 text-sm">

        <p>
          ✓ Visa category identified
        </p>

        <p>
          ✓ Destination country selected
        </p>

        <p>
          ✓ Case details provided
        </p>

      </div>

      <p className="mt-4 text-gray-600">
        This score indicates how prepared the application appears for further processing.
      </p>

    </div>
  );
}

export default ReadinessScore;