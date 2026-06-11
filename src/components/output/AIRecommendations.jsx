function AIRecommendations({ aiRecommendations = [] }) {
  const isLoading = aiRecommendations.length === 0;

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#083D4A]/80 p-6 shadow-[0_25px_80px_-40px_rgba(34,231,197,0.35)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Recommendations</h2>
        <span className="inline-flex items-center rounded-full border border-[#22E7C5]/20 bg-[#22E7C5]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#22E7C5]">
          AI Generated
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-10 rounded-3xl bg-white/5 animate-pulse" />
          <div className="h-10 rounded-3xl bg-white/5 animate-pulse" />
          <div className="h-10 rounded-3xl bg-white/5 animate-pulse" />
        </div>
      ) : (
        <ul className="space-y-3">
          {aiRecommendations.map((rec, index) => (
            <li
              key={index}
              className="rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 min-w-[2rem] items-center justify-center rounded-2xl bg-[#22E7C5]/15 text-sm font-bold text-[#22E7C5]">
                  {index + 1}
                </span>
                <p className="text-[#B8C5D1] leading-relaxed">{rec}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AIRecommendations;
