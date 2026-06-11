function TimelineEstimate({
  timeline = [],
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Timeline Estimate
      </h2>

      {timeline.length === 0 ? (
        <p className="text-gray-500">
          No timeline available.
        </p>
      ) : (
        <ul className="space-y-3">
          {timeline.map(
            (item, index) => (
              <li
                key={index}
                className="border-l-4 border-blue-500 pl-4"
              >
                <p className="font-semibold">
                  {typeof item ===
                  "string"
                    ? item
                    : item.stage ||
                      item.name ||
                      "Timeline Stage"}
                </p>

                {typeof item ===
                  "object" && (
                  <p className="text-gray-600 text-sm">
                    {item.duration ||
                      item.status ||
                      item.notes ||
                      ""}
                  </p>
                )}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}

export default TimelineEstimate;