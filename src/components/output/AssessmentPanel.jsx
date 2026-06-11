function AssessmentPanel({ assessment }) {
  if (!assessment) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Case Assessment
      </h2>

      <div className="mb-6">

        <span className="text-4xl font-bold text-blue-600">
          {assessment.score}%
        </span>

        <p className="text-gray-600 mt-1">
          Application Completion Score
        </p>

      </div>

      <div className="mb-5">

        <h3 className="font-semibold text-green-700 mb-2">
          Strengths
        </h3>

        <ul className="list-disc ml-5 space-y-1">
          {assessment.strengths?.map(
            (item) => (
              <li key={item}>
                {item}
              </li>
            )
          )}
        </ul>

      </div>

      <div className="mb-5">

        <h3 className="font-semibold text-orange-700 mb-2">
          Areas Requiring Attention
        </h3>

        <ul className="list-disc ml-5 space-y-1">
          {assessment.concerns?.map(
            (item) => (
              <li key={item}>
                {item}
              </li>
            )
          )}
        </ul>

      </div>

      <div>

        <h3 className="font-semibold text-blue-700 mb-2">
          Recommended Next Step
        </h3>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-gray-700">
            {assessment.recommendation}
          </p>
        </div>

      </div>

    </div>
  );
}

export default AssessmentPanel;