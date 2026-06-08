import { WorkflowAgent } from "./WorkflowAgent";
import { DocumentAgent } from "./DocumentAgent";
import { RiskAgent } from "./RiskAgent";
import { ComplianceAgent } from "./ComplianceAgent";
import { ReadinessAgent } from "./ReadinessAgent";
import { TimelineAgent } from "./TimelineAgent";
import { AssessmentAgent } from "./AssessmentAgent";
import { NotificationAgent } from "./NotificationAgent";
import { TaskAgent } from "./TaskAgent";

export async function OrchestratorAgent(
  analysis,
  uploadedDocuments = []
) {
  const workflow =
    await WorkflowAgent(analysis);

  const documents =
    await DocumentAgent(analysis);

  const risks =
    await RiskAgent(
      analysis,
      uploadedDocuments
    );

  const compliance =
    await ComplianceAgent(analysis);

  const readiness =
    await ReadinessAgent(analysis);

  const timeline =
    await TimelineAgent(analysis);

  const assessment =
    await AssessmentAgent(analysis);

  const notification =
    await NotificationAgent(
      analysis,
      uploadedDocuments
    );

  const tasks =
    await TaskAgent(analysis);

  return {
    workflow,
    documents,
    risks,
    compliance,
    readiness,
    timeline,
    assessment,
    notification,
    tasks,
  };
}