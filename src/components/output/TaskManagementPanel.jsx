import { useState } from "react";

function TaskManagementPanel({
  tasks = [],
}) {
  const [taskList, setTaskList] =
    useState(tasks);

  const toggleTask = (id) => {
    setTaskList(
      taskList.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status ===
                "Completed"
                  ? "Pending"
                  : "Completed",
            }
          : task
      )
    );
  };

  const completed =
    taskList.filter(
      (task) =>
        task.status === "Completed"
    ).length;

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Task Management
      </h2>

      <p className="mb-4">
        {completed} / {taskList.length}
        {" "}
        Completed
      </p>

      <div className="space-y-3">

        {taskList.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <span>
              {task.title}
            </span>

            <button
              onClick={() =>
                toggleTask(task.id)
              }
              className={`px-3 py-1 rounded text-white ${
                task.status ===
                "Completed"
                  ? "bg-green-600"
                  : "bg-gray-500"
              }`}
            >
              {task.status}
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}

export default TaskManagementPanel;