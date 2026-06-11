function AIApplicationOverview({ aiOverview }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">AI Application Overview</h2>
        <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
          AI Generated
        </span>
      </div>

      {aiOverview ? (
        <p className="text-gray-700 leading-relaxed">{aiOverview}</p>
      ) : (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      )}
    </div>
  );
}

export default AIApplicationOverview;