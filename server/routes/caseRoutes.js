import express from "express";

import {
  createCase,
  getCase,
  updateCase,
  addVerifiedDocument,
} from "../controllers/caseController.js";

const router =
  express.Router();

router.post(
  "/",
  createCase
);

router.get(
  "/:id",
  getCase
);

router.put(
  "/:id",
  updateCase
);

router.put(
  "/:id/documents",
  addVerifiedDocument
);

export default router;