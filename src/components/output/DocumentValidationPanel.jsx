function DocumentValidationPanel({
  validation,
}) {
  if (!validation) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Document Validation
      </h2>

      <div className="mb-4">

        <p>
          <strong>Status:</strong>{" "}
          {validation.validationStatus}
        </p>

        <p>
          <strong>Completion:</strong>{" "}
          {validation.completionPercentage}%
        </p>

        <p>
          <strong>Readiness:</strong>{" "}
          {validation.readinessScore}%
        </p>

      </div>

      <div className="mb-4">

        <h3 className="font-semibold mb-2">
          Missing Documents
        </h3>

        {validation.missingDocuments.length === 0 ? (
          <p className="text-green-600">
            No missing documents.
          </p>
        ) : (
          <ul className="list-disc ml-5">
            {validation.missingDocuments.map(
              (doc) => (
                <li key={doc}>
                  {doc}
                </li>
              )
            )}
          </ul>
        )}

      </div>

      <div>

        <h3 className="font-semibold mb-2">
          Recommendations
        </h3>

        <ul className="list-disc ml-5">
          {validation.recommendations.map(
            (item) => (
              <li key={item}>
                {item}
              </li>
            )
          )}
        </ul>

      </div>

    </div>
  );
}

export default DocumentValidationPanel;