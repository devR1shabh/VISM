function NotificationPanel({
  notification,
}) {
  if (!notification) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Notifications
      </h2>

      <div className="mb-4">
        <h3 className="font-semibold">
          Applicant Update
        </h3>

        <p className="text-gray-700 mt-1">
          {notification.applicantMessage}
        </p>
      </div>

      <div>
        <h3 className="font-semibold">
          Processor Update
        </h3>

        <p className="text-gray-700 mt-1">
          {notification.processorMessage}
        </p>
      </div>

    </div>
  );
}

export default NotificationPanel;