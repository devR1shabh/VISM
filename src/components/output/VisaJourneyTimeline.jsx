function VisaJourneyTimeline({ visaJourney = [] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-5">Visa Journey Timeline</h2>

      {visaJourney.length === 0 ? (
        <p className="text-gray-500">No journey information available.</p>
      ) : (
        <ol className="relative">
          {visaJourney.map((step, index) => {
            const isLast = index === visaJourney.length - 1;
            return (
              <li key={index} className="flex gap-4">
                {/* Left: connector column */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </div>
                  {!isLast && (
                    <div className="w-0.5 flex-1 bg-blue-200 my-1" />
                  )}
                </div>

                {/* Right: content */}
                <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                  <p className="font-semibold text-gray-800 leading-tight">
                    {step.stage}
                  </p>
                  {step.duration && (
                    <p className="text-sm text-blue-600 mt-0.5">
                      {step.duration}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export default VisaJourneyTimeline;