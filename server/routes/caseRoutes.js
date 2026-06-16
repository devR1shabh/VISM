// server/routes/caseRoutes.js

import express from "express";

import {
  createCase,
  getCase,
  updateCase,
  addVerifiedDocument,
  savePassportData,
  getAllCases,
  getCaseById,
  processorAction,
} from "../controllers/caseController.js";

const router = express.Router();

router.post("/",                       createCase);
router.get("/",                        getAllCases);
router.get("/:id",                     getCaseById);
router.put("/:id",                     updateCase);
router.put("/:id/documents",           addVerifiedDocument);
router.post("/:id/passport-data",      savePassportData);
router.post("/:id/processor-action",   processorAction);

export default router;