// server/routes/paymentRoutes.js
//
// POST /api/payment/:caseId/complete
//   Protected — requires a valid applicant JWT.
//   Marks a case as paid after mock Razorpay checkout completes.

import express             from "express";
import { protect }         from "../middleware/auth.js";
import { completePayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/:caseId/complete", protect, completePayment);

export default router;