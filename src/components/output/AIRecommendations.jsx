function AIRecommendations({ aiRecommendations = [] }) {
  const isLoading = aiRecommendations.length === 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recommendations</h2>
        <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
          AI Generated
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-10 bg-gray-100 rounded-lg" />
          <div className="h-10 bg-gray-100 rounded-lg" />
          <div className="h-10 bg-gray-100 rounded-lg" />
        </div>
      ) : (
        <ul className="space-y-3">
          {aiRecommendations.map((rec, index) => (
            <li
              key={index}
              className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-3"
            >
              <span className="font-bold text-blue-600 shrink-0 mt-0.5">
                {index + 1}.
              </span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AIRecommendations;