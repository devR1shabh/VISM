// server/routes/scoreRoutes.js
//
// POST /api/score/:caseId/generate
//   Protected — requires valid applicant or processor JWT.

import express             from "express";
import { protect }         from "../middleware/auth.js";
import { generateScore }   from "../controllers/scoreController.js";

const router = express.Router();

router.post("/:caseId/generate", protect, generateScore);

export default router;