import { useLocation } from "react-router-dom";
import TaskManagementPanel from "../components/output/TaskManagementPanel";

function Tasks() {
  const location = useLocation();

  const tasks =
    location.state?.tasks || [];

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">
          Task Center
        </h1>

        <TaskManagementPanel
          tasks={tasks}
        />

      </div>

    </div>
  );
}

export default Tasks;