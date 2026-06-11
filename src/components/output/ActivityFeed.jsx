import { useCase } from "../../context/CaseContext";

function ActivityFeed() {
  const { activityFeed } = useCase();

  return (
    <aside className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 p-6 shadow-[0_20px_60px_-20px_rgba(34,231,197,0.12)] backdrop-blur-xl">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>

        <span className="text-sm text-[#B8C5D1]">
          {activityFeed.length} Events
        </span>
      </div>

      {activityFeed.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#B8C5D1]">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto">

          {activityFeed.map((activity) => (
            <div
              key={activity.id}
              className="border-l-4 border-[#22E7C5] pl-4 py-3 bg-white/5 rounded-r"
            >

              <div className="flex justify-between items-start">

                <p className="font-medium text-white">
                  {activity.message}
                </p>

                <span className="text-xs text-[#B8C5D1]">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>

              </div>

              <p className="text-xs text-[#B8C5D1] mt-1">
                {new Date(activity.timestamp).toLocaleDateString()}
              </p>

            </div>
          ))}

        </div>
      )}

    </aside>
  );
}

export default ActivityFeed;