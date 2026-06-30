// server/models/AssessmentRun.js
//
// Append-only history of every agent-readiness assessment and every
// confidence-score computation run for a case.
//
// Why this exists:
//   Case.agentAssessment and Case.visaConfidenceScore are "latest snapshot"
//   fields — each new run overwrites the previous result so the case detail
//   page can read them with zero extra queries. That's still correct and is
//   left unchanged.
//
//   This collection exists purely to ADD history on top of that, for
//   roadmap features like a score/assessment trend view or "why did my
//   score change" timeline. It is written to in addition to (never instead
//   of) the existing snapshot fields, so no existing read path changes.
//
// Relationship:
//   AssessmentRun N:1 Case, via caseId (ObjectId ref).

import mongoose from "mongoose";

const assessmentRunSchema = new mongoose.Schema(
  {
    caseId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Case",
      required: true,
    },

    // "agent" — readiness agent run (Case.agentAssessment)
    // "score" — confidence score run (Case.visaConfidenceScore)
    kind: {
      type:     String,
      enum:     ["agent", "score"],
      required: true,
    },

    // Full result payload for this run, same shape as the corresponding
    // Case snapshot field at the time it was written (overallRisk,
    // readinessLabel, actions, reasoning, toolCallLog for "agent";
    // score, breakdown, label for "score"). Stored as Mixed since the two
    // kinds have different shapes and the shape may evolve over time —
    // this collection is a history log, not a strictly-typed projection.
    result: {
      type:    mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Mirrors the existing auditEntrySchema.actor convention on Case
    // ("agent" | "system" | "processor" | ...).
    triggeredBy: {
      type:    String,
      default: "system",
    },

    runAt: {
      type:    Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Primary access pattern: "give me this case's history, newest first"
// or "give me this case's score history" / "...agent history".
assessmentRunSchema.index({ caseId: 1, runAt: -1 });
assessmentRunSchema.index({ caseId: 1, kind: 1, runAt: -1 });

const AssessmentRun = mongoose.model("AssessmentRun", assessmentRunSchema);

export default AssessmentRun;