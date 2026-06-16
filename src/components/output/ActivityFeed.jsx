import { useCase } from "../../context/CaseContext";

function ActivityFeed() {
  // ── Logic completely unchanged ──────────────────────────────────
  const { activityFeed } = useCase();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[var(--c-text)]">Recent Activity</h2>
        <span className="text-xs text-[var(--c-text-muted)] font-medium">
          {activityFeed.length} Events
        </span>
      </div>

      {activityFeed.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-[var(--c-text-muted)]">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {activityFeed.map((activity) => (
            <div
              key={activity.id}
              className="border-l-4 border-[var(--c-green)] pl-4 py-2.5 bg-[var(--c-bg)] rounded-r-[var(--r-lg)]"
            >
              <div className="flex justify-between items-start gap-4">
                <p className="text-sm font-medium text-[var(--c-text)]">
                  {activity.message}
                </p>
                <span className="text-xs text-[var(--c-text-muted)] shrink-0">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs text-[var(--c-text-muted)] mt-0.5">
                {new Date(activity.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;