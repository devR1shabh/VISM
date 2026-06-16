function NotificationPanel({ notification }) {
  if (!notification) return null;

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <h2 className="text-lg font-bold text-[var(--c-text)] mb-4">Notifications</h2>
      <div>
        <h3 className="text-sm font-semibold text-[var(--c-text)]">
          {notification.title || "Application Update"}
        </h3>
        <p className="text-sm text-[var(--c-text-mid)] mt-2 leading-relaxed">
          {notification.message || "No notification available."}
        </p>
      </div>
    </div>
  );
}

export default NotificationPanel;