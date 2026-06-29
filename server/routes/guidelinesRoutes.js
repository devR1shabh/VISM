// server/routes/guidelinesRoutes.js
//
// GET /api/guidelines?country=...&visaType=...
// Public endpoint — no auth required.
// Data is non-sensitive; results are the same for all users.

import express               from "express";
import { fetchGuidelines }   from "../controllers/guidelinesController.js";

const router = express.Router();

router.get("/", fetchGuidelines);

export default router;