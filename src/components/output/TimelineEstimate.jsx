function TimelineEstimate({ timeline }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Timeline Estimate
      </h2>

      <ul className="space-y-3">

        {timeline.map((item) => (
          <li
            key={item.stage}
            className="border-l-4 border-blue-500 pl-4"
          >
            <p className="font-semibold">
              {item.stage}
            </p>

            <p className="text-gray-600 text-sm">
              {item.duration}
            </p>
          </li>
        ))}

      </ul>

    </div>
  );
}

export default TimelineEstimate;