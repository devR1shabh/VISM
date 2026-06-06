function AssessmentPanel({ assessment }) {
  if (!assessment) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Application Assessment
      </h2>

      <div className="mb-4">
        <span className="text-3xl font-bold text-blue-600">
          {assessment.score}%
        </span>

        <p className="text-gray-600">
          Readiness Score
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">
          Strengths
        </h3>

        <ul className="list-disc ml-5">
          {assessment.strengths?.map(
            (item) => (
              <li key={item}>{item}</li>
            )
          )}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">
          Concerns
        </h3>

        <ul className="list-disc ml-5">
          {assessment.concerns?.map(
            (item) => (
              <li key={item}>{item}</li>
            )
          )}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">
          Recommendation
        </h3>

        <p>{assessment.recommendation}</p>
      </div>

    </div>
  );
}

export default AssessmentPanel;