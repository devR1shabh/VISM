function FollowUpActions({ actions }) {
  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <h2 className="text-lg font-bold text-[var(--c-text)] mb-4">Follow-Up Actions</h2>
      <ul className="space-y-3">
        {actions?.map((action, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="font-bold text-[var(--c-green)] shrink-0">{index + 1}.</span>
            <span className="text-sm text-[var(--c-text-mid)]">{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FollowUpActions;