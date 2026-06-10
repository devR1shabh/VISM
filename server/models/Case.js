import mongoose from "mongoose";

const uploadedDocumentSchema =
  new mongoose.Schema(
    {
      type: String,

      verified: {
        type: Boolean,
        default: false,
      },

      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      _id: false,
    }
  );

const caseSchema =
  new mongoose.Schema(
    {
      caseId: {
        type: String,
        required: true,
      },

      visaType: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        default: "",
      },

      passportData: {
        name: String,

        nationality: String,

        passportLast4: String,

        expiryDate: String,
      },

      uploadedDocuments: [
        uploadedDocumentSchema,
      ],

      activityFeed: {
        type: Array,
        default: [],
      },

      chatHistory: {
        type: Array,
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

const Case =
  mongoose.model(
    "Case",
    caseSchema
  );

export default Case;