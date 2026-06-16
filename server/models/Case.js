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

const caseSchema = new mongoose.Schema(
  {
    caseId: { type: String, required: true },
    visaType: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, default: "" },

    // Populated after passport extraction completes.
    // Stores the full extracted passport fields so the processor can see them.
    passportData: {
      name:           String,
      nationality:    String,
      passportLast4:  String,
      expiryDate:     String,
      // Full fields — written when passport is extracted on the applicant side
      fullName:       String,
      passportNumber: String,
      dateOfBirth:    String,
      issuingCountry: String,
      sex:            String,
    },

    // Populated after AI analysis completes on the applicant side.
    // mongoose.Schema.Types.Mixed accepts the full nested analysis object.
    analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    uploadedDocuments: [uploadedDocumentSchema],

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

const Case = mongoose.model("Case", caseSchema);

export default Case;