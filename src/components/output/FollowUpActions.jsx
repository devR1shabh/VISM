function FollowUpActions({ actions }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Follow-Up Actions
      </h2>

      <ul className="space-y-3">
        {actions?.map((action, index) => (
          <li
            key={index}
            className="flex items-start gap-3"
          >
            <span className="font-bold text-blue-600">
              {index + 1}.
            </span>

            <span>{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FollowUpActions;