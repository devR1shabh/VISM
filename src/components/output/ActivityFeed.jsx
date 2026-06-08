import { useCase } from "../../context/CaseContext";

function ActivityFeed() {
  const { activityFeed } = useCase();

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          Recent Activity
        </h2>

        <span className="text-sm text-gray-500">
          {activityFeed.length} Events
        </span>
      </div>

      {activityFeed.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No activity recorded yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto">

          {activityFeed.map(
            (activity) => (
              <div
                key={activity.id}
                className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r"
              >

                <div className="flex justify-between items-start">

                  <p className="font-medium text-gray-800">
                    {activity.message}
                  </p>

                  <span className="text-xs text-gray-500">
                    {new Date(
                      activity.timestamp
                    ).toLocaleTimeString()}
                  </span>

                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(
                    activity.timestamp
                  ).toLocaleDateString()}
                </p>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default ActivityFeed;