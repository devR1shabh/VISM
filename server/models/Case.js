// server/models/Case.js

import mongoose from "mongoose";

const uploadedDocumentSchema = new mongoose.Schema(
  {
    type: String,
    verified: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const processorNoteSchema = new mongoose.Schema(
  {
    noteId: { type: String },
    text: { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const auditEntrySchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    detail: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
    actor: { type: String, default: "system" },
  },
  { _id: false }
);

// Stores all 10 questionnaire answers as flat key-value pairs.
// Keys match the question IDs defined in the front-end QUESTIONS array.
const questionnaireSchema = new mongoose.Schema(
  {
    purpose:               { type: String, default: "" },
    education:             { type: String, default: "" },
    occupation:            { type: String, default: "" },
    experience:            { type: String, default: "" },
    travelHistory:         { type: String, default: "" },
    previousRefusal:       { type: String, default: "" },
    previousRefusalDetails:{ type: String, default: "" },
    financialCapacity:     { type: String, default: "" },
    hasSponsor:            { type: String, default: "" },
    sponsorName:           { type: String, default: "" },
    existingArrangements:  { type: String, default: "" },
    additionalNotes:       { type: String, default: "" },
    submittedAt:           { type: Date,   default: null },
  },
  { _id: false }
);

// ── Agent Assessment Schema ─────────────────────────────────────────────────
// Written by the Readiness Assessment Agent after it completes its tool loop.
// The agent decides overallRisk, readinessLabel, and actions autonomously.
const agentAssessmentSchema = new mongoose.Schema(
  {
    // The agent's verdict
    overallRisk:    { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: null },
    readinessLabel: { type: String, default: "" },

    // Prioritised action list the agent generated
    actions: { type: [String], default: [] },

    // The agent's reasoning — explains WHY it reached this verdict
    reasoning: { type: String, default: "" },

    // Full log of every tool call the agent made (for transparency)
    toolCallLog: { type: mongoose.Schema.Types.Mixed, default: [] },

    // When the agent last ran
    runAt: { type: Date, default: null },

    // Whether the agent is currently running (optimistic lock for UI)
    running: { type: Boolean, default: false },
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    caseId: { type: String, required: true },
    visaType: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, default: "" },

    // ── Ownership ─────────────────────────────────────────────────────────────
    // Links this case to the authenticated applicant who created it.
    // Indexed for fast per-applicant queries (GET /api/my-cases).
    //
    // applicantId   — MongoDB ObjectId ref to User collection.
    //                 Used for all server-side ownership checks.
    //
    // applicantEmail — Snapshot of the applicant's email at case creation time.
    //                  Stored here so email notifications can be triggered from
    //                  caseController without an extra User lookup.
    //                  (Phase 5 — Email Notifications)
    //
    // applicantName  — Snapshot of the applicant's name at case creation time.
    //                  Used in email templates and the processor dashboard.
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
      // Not required during Phase 2 transition so existing legacy cases
      // (created before auth existed) are not broken. Will be required
      // in a future migration once all cases have owners.
      default: null,
    },

    applicantEmail: {
      type:    String,
      default: "",
    },

    applicantName: {
      type:    String,
      default: "",
    },

    // Populated after passport extraction completes.
    passportData: {
      name:           String,
      nationality:    String,
      passportLast4:  String,
      expiryDate:     String,
      fullName:       String,
      passportNumber: String,
      dateOfBirth:    String,
      issuingCountry: String,
      sex:            String,
    },

    // Populated after AI analysis completes on the applicant side.
    analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    uploadedDocuments: [uploadedDocumentSchema],

    // Populated after questionnaire is submitted by the applicant.
    questionnaire: {
      type: questionnaireSchema,
      default: null,
    },

    // Populated after the Readiness Assessment Agent runs.
    // default is an empty object (never null) so dot-path $set writes
    // like "agentAssessment.running" always have a parent object to write into.
    agentAssessment: {
      type: agentAssessmentSchema,
      default: () => ({}),
    },

    processorStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Need Documents"],
      default: "Pending",
    },

    processorNotes: {
      type: [processorNoteSchema],
      default: [],
    },

    auditLog: {
      type: [auditEntrySchema],
      default: [],
    },

    activityFeed: { type: Array, default: [] },
    chatHistory:  { type: Array, default: [] },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
//
// applicantId index — the single most important query in the applicant flow:
//   Case.find({ applicantId: req.user.id })
// Without this index that query does a full collection scan.
//
// Compound index on [applicantId, createdAt] means MongoDB can satisfy
// the sort in the same index pass — no separate sort step needed.
caseSchema.index({ applicantId: 1, createdAt: -1 });

// processorStatus index — speeds up the processor dashboard filter queries
// e.g. "show me all Pending cases".
caseSchema.index({ processorStatus: 1, createdAt: -1 });

const Case = mongoose.model("Case", caseSchema);

export default Case;