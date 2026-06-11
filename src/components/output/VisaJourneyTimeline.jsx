function VisaJourneyTimeline({ visaJourney = [] }) {
  const lastIndex = Math.max(0, visaJourney.length - 1);

  return (
    <section className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 p-6 shadow-[0_30px_90px_-30px_rgba(34,231,197,0.18)] backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-[0.28em] text-[#22E7C5]">Visa Journey</p>
        <h2 className="text-2xl font-semibold text-white">Immigration Journey</h2>
      </div>

      {visaJourney.length === 0 ? (
        <p className="text-[#B8C5D1]">No journey information available.</p>
      ) : (
        <ol className="relative flex flex-col gap-6">
          {visaJourney.map((step, index) => {
            const isLast = index === visaJourney.length - 1;
            const isCompleted = index < lastIndex;
            const isCurrent = index === lastIndex;

            return (
              <li key={index} className="flex items-start gap-5">
                {/* Connector column */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition ${
                      isCompleted
                        ? "bg-[#22E7C5] text-[#061A28]"
                        : isCurrent
                        ? "bg-gradient-to-br from-[#22E7C5] to-[#39F5D5] text-[#061A28] ring-4 ring-[#22E7C5]/20"
                        : "bg-white/6 text-[#B8C5D1]"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {!isLast && (
                    <div className={`w-[2px] flex-1 mt-3 ${isCompleted ? "bg-[#22E7C5]" : "bg-white/6"}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className={`rounded-2xl p-4 ${isCompleted ? "bg-[#22E7C5]/6" : isCurrent ? "bg-white/5 ring-1 ring-[#22E7C5]/10" : "bg-white/3"}`}>
                    <p className={`text-sm font-semibold ${isCompleted || isCurrent ? "text-white" : "text-[#B8C5D1]"}`}>{step.stage}</p>
                    {step.duration && (
                      <p className="text-xs mt-1 text-[#B8C5D1]">{step.duration}</p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

export default VisaJourneyTimeline;