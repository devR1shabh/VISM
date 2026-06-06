import { WorkflowAgent } from "./WorkflowAgent";
import { DocumentAgent } from "./DocumentAgent";
import { RiskAgent } from "./RiskAgent";
import { ComplianceAgent } from "./ComplianceAgent";
import { ReadinessAgent } from "./ReadinessAgent";
import { TimelineAgent } from "./TimelineAgent";
import { AssessmentAgent } from "./AssessmentAgent";

export async function OrchestratorAgent(
  analysis
) {
  const workflow =
    await WorkflowAgent(analysis);

  const documents =
    await DocumentAgent(analysis);

  const risks =
    await RiskAgent(analysis);

  const compliance =
    await ComplianceAgent(analysis);

  const readiness =
    await ReadinessAgent(analysis);

  const timeline =
    await TimelineAgent(analysis);

  const assessment =
    await AssessmentAgent(analysis);

  return {
    workflow,
    documents,
    risks,
    compliance,
    readiness,
    timeline,
    assessment,
  };
}