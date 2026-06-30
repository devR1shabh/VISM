// server/models/Case.js

import mongoose from "mongoose";

// ── uploadedDocumentSchema ────────────────────────────────────────────────────
// FEATURE 2: added `category` field
// FEATURE 3: no changes here

const uploadedDocumentSchema = new mongoose.Schema(
  {
    type:       String,
    verified:   { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
    // "mandatory" | "supporting" | null (null = legacy doc before Feature 2)
    category:   { type: String, enum: ["mandatory", "supporting", null], default: null },
  },
  { _id: false }
);

// ── processorNoteSchema ───────────────────────────────────────────────────────

const processorNoteSchema = new mongoose.Schema(
  {
    noteId:  { type: String },
    text:    { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ── auditEntrySchema ──────────────────────────────────────────────────────────

const auditEntrySchema = new mongoose.Schema(
  {
    event:     { type: String, required: true },
    detail:    { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
    actor:     { type: String, default: "system" },
  },
  { _id: false }
);

// ── questionnaireSchema ───────────────────────────────────────────────────────

const questionnaireSchema = new mongoose.Schema(
  {
    purpose:                { type: String, default: "" },
    education:              { type: String, default: "" },
    occupation:             { type: String, default: "" },
    experience:             { type: String, default: "" },
    travelHistory:          { type: String, default: "" },
    previousRefusal:        { type: String, default: "" },
    previousRefusalDetails: { type: String, default: "" },
    financialCapacity:      { type: String, default: "" },
    hasSponsor:             { type: String, default: "" },
    sponsorName:            { type: String, default: "" },
    existingArrangements:   { type: String, default: "" },
    additionalNotes:        { type: String, default: "" },
    submittedAt:            { type: Date,   default: null },
  },
  { _id: false }
);

// ── agentAssessmentSchema ─────────────────────────────────────────────────────

const agentAssessmentSchema = new mongoose.Schema(
  {
    overallRisk:    { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: null },
    readinessLabel: { type: String, default: "" },
    actions:        { type: [String], default: [] },
    reasoning:      { type: String, default: "" },
    toolCallLog:    { type: mongoose.Schema.Types.Mixed, default: [] },
    runAt:          { type: Date, default: null },
    running:        { type: Boolean, default: false },
  },
  { _id: false }
);

// ── FEATURE 3: paymentDetailsSchema ──────────────────────────────────────────
// Populated after mock Razorpay payment completes (Feature 6).
// All fields are optional — only set when paymentStatus === "paid".

const paymentDetailsSchema = new mongoose.Schema(
  {
    transactionId: { type: String, default: null },
    amount:        { type: Number, default: null },  // in paise (INR smallest unit)
    currency:      { type: String, default: "INR" },
    paidAt:        { type: Date,   default: null },
  },
  { _id: false }
);

// ── FEATURE 3: confidenceScoreSchema ─────────────────────────────────────────
// Written by the Visa Confidence Score service (Feature 8).
// The breakdown object stores component scores so the UI can show
// which factors contributed most / least to the overall score.

const confidenceScoreSchema = new mongoose.Schema(
  {
    // Overall 0–100 score. null until the service has run.
    score: { type: Number, default: null, min: 0, max: 100 },

    // Per-factor breakdown — each 0–100. null until computed.
    breakdown: {
      documentScore:      { type: Number, default: null },
      mandatoryScore:     { type: Number, default: null },
      questionnaireScore: { type: Number, default: null },
      passportScore:      { type: Number, default: null },
      countryRiskScore:   { type: Number, default: null },
    },

    // Human-readable label: "High Confidence" | "Moderate" | "Needs Attention"
    label: { type: String, default: "" },

    // When the score was last generated
    generatedAt: { type: Date, default: null },

    // True while the scoring service is running (optimistic UI lock)
    running: { type: Boolean, default: false },
  },
  { _id: false }
);

// ── FEATURE 3: notificationSchema ────────────────────────────────────────────
// Each entry is one in-app notification for the applicant (Feature 13).
// Processor actions, agent events, and document verifications push here.

const notificationSchema = new mongoose.Schema(
  {
    // "info" | "success" | "warning" | "error"
    type:      { type: String, default: "info" },
    title:     { type: String, default: "" },
    message:   { type: String, required: true },
    read:      { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ── caseSchema ────────────────────────────────────────────────────────────────

const caseSchema = new mongoose.Schema(
  {
    // unique: true — enforced via index below (kept off the inline field
    // definition so the migration script can run a duplicate-check first;
    // see server/scripts/addCaseIdUniqueIndex.js)
    caseId:      { type: String, required: true },
    visaType:    { type: String, required: true },
    country:     { type: String, required: true },
    description: { type: String, default: "" },

    // ── Ownership ─────────────────────────────────────────────────────────────
    applicantId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     "User",
      default: null,
    },
    applicantEmail: { type: String, default: "" },
    applicantName:  { type: String, default: "" },

    // ── FEATURE 3: Package ────────────────────────────────────────────────────
    // Set during package selection flow (Feature 5).
    // Defaults to "self_supported" so all existing cases remain valid.
    //
    // self_supported — free tier; applicant handles everything themselves
    // assisted       — ₹1,999; processor reviews and flags issues
    // concierge      — ₹4,999; dedicated case officer, priority queue
    package: {
      type:    String,
      enum:    ["self_supported", "assisted", "concierge"],
      default: "self_supported",
    },
    packageSelectedAt: {
      type:    Date,
      default: null,
    },

    // ── FEATURE 3: Payment ────────────────────────────────────────────────────
    // Updated by the mock Razorpay flow (Feature 6).
    // self_supported cases skip payment and go straight to "paid" (free).
    paymentStatus: {
      type:    String,
      enum:    ["unpaid", "paid"],
      default: "unpaid",
    },
    paymentDetails: {
      type:    paymentDetailsSchema,
      default: () => ({}),
    },

    // ── FEATURE 3: Visa Confidence Score ──────────────────────────────────────
    // Written by the confidence score service (Feature 8).
    // null on all fields until the service runs for the first time.
    visaConfidenceScore: {
      type:    confidenceScoreSchema,
      default: () => ({}),
    },

    // ── FEATURE 3: In-App Notifications ──────────────────────────────────────
    // Populated by processor actions, agent events, doc verifications (Feature 13).
    // Ordered newest-first when displayed in the UI.
    notifications: {
      type:    [notificationSchema],
      default: [],
    },

    // ── Passport data ─────────────────────────────────────────────────────────
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

    // ── AI Analysis ───────────────────────────────────────────────────────────
    analysis: {
      type:    mongoose.Schema.Types.Mixed,
      default: null,
    },

    uploadedDocuments: [uploadedDocumentSchema],

    questionnaire: {
      type:    questionnaireSchema,
      default: null,
    },

    agentAssessment: {
      type:    agentAssessmentSchema,
      default: () => ({}),
    },

    processorStatus: {
      type:    String,
      enum:    ["Pending", "Approved", "Rejected", "Need Documents"],
      default: "Pending",
    },

    processorNotes: {
      type:    [processorNoteSchema],
      default: [],
    },

    auditLog: {
      type:    [auditEntrySchema],
      default: [],
    },

    // NOTE: `activityFeed` and `chatHistory` fields were removed here —
    // confirmed dead (never read or written anywhere in the codebase).
    // The Navi copilot is stateless; case context is passed per-request
    // and never persisted. See ROADMAP.md / migration notes for details.
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────

// Per-applicant case lookup — most frequent query in the applicant flow
caseSchema.index({ applicantId: 1, createdAt: -1 });

// Processor dashboard status filter
caseSchema.index({ processorStatus: 1, createdAt: -1 });

// FEATURE 3: Package index — used by the reporting dashboard (Feature 14)
// to group and count cases by tier without a full collection scan.
caseSchema.index({ package: 1, createdAt: -1 });

// FEATURE 4 (Roadmap): caseId unique index — added via migration script
// after a duplicate-check pass (server/scripts/addCaseIdUniqueIndex.js).
// Declared here so the schema reflects the intended final state; the actual
// index build on existing data is handled by the migration script, not by
// Mongoose's automatic index sync, to avoid a startup crash if duplicates
// still exist in production data at deploy time.
caseSchema.index({ caseId: 1 }, { unique: true });

const Case = mongoose.model("Case", caseSchema);

export default Case;