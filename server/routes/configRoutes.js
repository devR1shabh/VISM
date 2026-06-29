// server/routes/configRoutes.js
//
// GET /api/config — serves all shared constants to the frontend.
// Public endpoint: no auth required. Data is non-sensitive.
// The frontend reads this once on app mount via ConfigContext.

import express from "express";

import {
  MANDATORY_DOCUMENTS,
  SUPPORTING_DOCUMENTS,
  ALL_DOCUMENTS,
  VISA_TYPES,
  DOCUMENT_CATEGORY_MAP,
} from "../config/constants.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    documents: {
      mandatory:   MANDATORY_DOCUMENTS,
      supporting:  SUPPORTING_DOCUMENTS,
      all:         ALL_DOCUMENTS,
      categoryMap: DOCUMENT_CATEGORY_MAP,
    },
    visaTypes: VISA_TYPES,
  });
});

export default router;