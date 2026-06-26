// server/scripts/seedProcessor.js
//
// One-time script: creates a processor account in the database.
// Run ONCE after setting up the server:
//
//   cd server
//   node scripts/seedProcessor.js
//
// This replaces the hardcoded "processor / vism2024" credentials
// that previously lived in ProcessorAuthContext.jsx.
//
// You can re-run it safely — it checks for an existing account first.

import dotenv   from "dotenv";
import bcrypt   from "bcryptjs";
import mongoose from "mongoose";
import User     from "../models/User.js";

dotenv.config();

const PROCESSOR_NAME  = process.env.PROCESSOR_NAME  || "VISM Processor";
const PROCESSOR_EMAIL = process.env.PROCESSOR_EMAIL || "processor@vism.internal";
const PROCESSOR_PASS  = process.env.PROCESSOR_PASS  || "ChangeMe123!";

async function seed() {
  console.log("[Seed] Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("[Seed] Connected.");

  const existing = await User.findOne({ email: PROCESSOR_EMAIL });

  if (existing) {
    console.log(`[Seed] Processor account already exists: ${PROCESSOR_EMAIL}`);
    console.log("[Seed] No changes made.");
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(PROCESSOR_PASS, 12);

  const processor = await User.create({
    name:         PROCESSOR_NAME,
    email:        PROCESSOR_EMAIL,
    passwordHash,
    role:         "processor",
  });

  console.log("────────────────────────────────────────");
  console.log("[Seed] Processor account created!");
  console.log(`       Email    : ${processor.email}`);
  console.log(`       Password : ${PROCESSOR_PASS}`);
  console.log(`       ID       : ${processor._id}`);
  console.log("────────────────────────────────────────");
  console.log("[Seed] IMPORTANT: Change the password after first login.");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[Seed] Failed:", err);
  process.exit(1);
});