import { useCase } from "../../context/CaseContext";

function TaskManagementPanel({
  tasks = [],
}) {
  const {
    uploadedDocuments,
  } = useCase();

  const isTaskCompleted = (
    task
  ) => {
    if (
      !task.title.startsWith(
        "Upload "
      )
    ) {
      return false;
    }

    const documentName =
      task.title.replace(
        "Upload ",
        ""
      );

    return uploadedDocuments.some(
      (doc) =>
        doc.valid &&
        doc.requiredDocument ===
          documentName
    );
  };

  const completed =
    tasks.filter(
      (task) =>
        isTaskCompleted(task)
    ).length;

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Task Management
      </h2>

      <p className="mb-4">
        {completed} / {tasks.length}
        {" "}
        Completed
      </p>

      <div className="space-y-3">

        {tasks.map((task) => {
          const completed =
            isTaskCompleted(task);

          return (
            <div
              key={task.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <span>
                {task.title}
              </span>

              <span
                className={`px-3 py-1 rounded text-white ${
                  completed
                    ? "bg-green-600"
                    : "bg-gray-500"
                }`}
              >
                {completed
                  ? "Completed"
                  : "Pending"}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default TaskManagementPanel;