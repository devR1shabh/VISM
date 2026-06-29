// server/controllers/paymentController.js
//
// Handles mock payment completion for Assisted and Concierge plans.
// In production this would verify a real Razorpay signature before
// marking payment as complete. For now it generates a mock transaction ID,
// stamps paymentStatus: "paid" on the case, and logs the event.
//
// POST /api/payment/:caseId/complete

import Case from "../models/Case.js";

export async function completePayment(req, res) {
  try {
    const { caseId }   = req.params;
    const { amount, packageId } = req.body;

    if (!caseId) {
      return res.status(400).json({ error: "caseId is required." });
    }

    // Generate a plausible-looking mock transaction ID
    const rand          = Math.random().toString(36).slice(2, 10).toUpperCase();
    const transactionId = `VISM-${Date.now()}-${rand}`;

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      {
        $set: {
          paymentStatus: "paid",
          "paymentDetails.transactionId": transactionId,
          "paymentDetails.amount":        amount   || 0,
          "paymentDetails.currency":      "INR",
          "paymentDetails.paidAt":        new Date(),
        },
        $push: {
          auditLog: {
            event:     "Payment Completed",
            detail:    `Mock payment processed. Package: ${packageId}. Transaction: ${transactionId}. Amount: ₹${((amount || 0) / 100).toLocaleString("en-IN")}`,
            timestamp: new Date(),
            actor:     "system",
          },
        },
      },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found." });
    }

    console.log(`[Payment] Mock payment complete — case ${caseId}, txn ${transactionId}`);

    res.json({
      success:       true,
      transactionId,
      updatedCase,
    });
  } catch (error) {
    console.error("[paymentController.completePayment]", error);
    res.status(500).json({ error: "Payment processing failed. Please try again." });
  }
}