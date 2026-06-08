function NotificationPanel({
  notification,
}) {
  if (!notification) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Notifications
      </h2>

      <div>
        <h3 className="font-semibold">
          {notification.title ||
            "Application Update"}
        </h3>

        <p className="text-gray-700 mt-2">
          {notification.message ||
            "No notification available."}
        </p>
      </div>

    </div>
  );
}

export default NotificationPanel;