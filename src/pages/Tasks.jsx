
import { useCase } from "../context/CaseContext";

import TaskManagementPanel from "../components/output/TaskManagementPanel";

function Tasks() {
  const { caseData } = useCase();

  const tasks = caseData?.analysis?.tasks || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Task Center
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4 text-sm">
        <span className="text-gray-500">
          Case:{" "}
          <strong className="text-gray-800">
            {caseData.caseId || caseData.id}
          </strong>
        </span>

        <span className="text-gray-300">|</span>

        <span className="text-gray-500">
          Visa:{" "}
          <strong className="text-gray-800">
            {caseData.visaType}
          </strong>
        </span>

        <span className="text-gray-300">|</span>

        <span className="text-gray-500">
          Tasks:{" "}
          <strong className="text-gray-800">
            {tasks.length}
          </strong>
        </span>
      </div>

      <TaskManagementPanel tasks={tasks} />
    </div>
  );
}

export default Tasks;
