function AIApplicationOverview({ aiOverview }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#083D4A]/80 p-6 shadow-[0_25px_80px_-40px_rgba(34,231,197,0.35)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-bold text-white">AI Application Overview</h2>
        <span className="inline-flex items-center rounded-full border border-[#22E7C5]/20 bg-[#22E7C5]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#22E7C5]">
          AI Generated
        </span>
      </div>

      {aiOverview ? (
        <p className="text-[#B8C5D1] leading-relaxed">{aiOverview}</p>
      ) : (
        <div className="space-y-3">
          <div className="h-4 rounded-full bg-white/5 animate-pulse" />
          <div className="h-4 rounded-full bg-white/5 animate-pulse w-5/6" />
          <div className="h-4 rounded-full bg-white/5 animate-pulse w-4/6" />
        </div>
      )}
    </div>
  );
}

export default AIApplicationOverview;
