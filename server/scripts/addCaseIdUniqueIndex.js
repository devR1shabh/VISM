// server/scripts/addCaseIdUniqueIndex.js
//
// Migration: makes Case.caseId unique.
//
// Why this exists:
//   The Case schema now declares `caseSchema.index({ caseId: 1 }, { unique: true })`.
//   If any duplicate caseId values already exist in the database, MongoDB will
//   refuse to build that index (or, worse, an app server with autoIndex
//   enabled could crash on startup trying to build it). This script finds
//   and reports any duplicates BEFORE the index is built, and only then
//   builds the index directly.
//
//   It also handles the common case where a non-unique index on caseId
//   already exists (e.g. auto-created by Mongoose before this migration) —
//   MongoDB refuses to create a second index on the same key with different
//   options, so this script detects and drops that old index first.
//
// Usage:
//   cd server
//   node scripts/addCaseIdUniqueIndex.js
//
//   Add --fix to auto-resolve duplicates by appending a numeric suffix to
//   caseId on every duplicate document after the first (the first occurrence
//   per caseId, ordered by createdAt ascending, keeps its original value):
//
//   node scripts/addCaseIdUniqueIndex.js --fix
//
// Safety:
//   - Without --fix, the script ONLY reports duplicates and exits without
//     touching any data or building the index. Safe to run repeatedly.
//   - With --fix, only the caseId field is modified on affected documents —
//     no other fields are touched, and the very first document for each
//     duplicated caseId is left untouched.
//   - The script always re-checks for duplicates after a --fix pass before
//     attempting to build the index, and refuses to build the index if any
//     duplicates remain.
//   - Dropping a pre-existing non-unique caseId index is safe: it only
//     removes the index structure, never any data, and the index is
//     immediately rebuilt (as unique) in the same run.

import dotenv   from "dotenv";
import mongoose from "mongoose";
import Case     from "../models/Case.js";

dotenv.config();

const FIX_MODE = process.argv.includes("--fix");

async function findDuplicateCaseIds() {
  return Case.aggregate([
    {
      $group: {
        _id:   "$caseId",
        count: { $sum: 1 },
        ids:   { $push: "$_id" },
      },
    },
    { $match: { count: { $gt: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

async function fixDuplicates(duplicates) {
  console.log(`[Migration] --fix enabled. Resolving ${duplicates.length} duplicate caseId group(s)...`);

  for (const group of duplicates) {
    const { _id: caseId, ids } = group;

    // Order this group's documents by createdAt ascending so the
    // oldest case keeps the original caseId.
    const docs = await Case.find({ _id: { $in: ids } })
      .sort({ createdAt: 1 })
      .select("_id caseId createdAt")
      .lean();

    // Skip the first (oldest) — it keeps its caseId untouched.
    const [, ...rest] = docs;

    for (let i = 0; i < rest.length; i++) {
      const doc = rest[i];
      const newCaseId = `${caseId}-DUP${i + 1}`;

      await Case.updateOne(
        { _id: doc._id },
        { $set: { caseId: newCaseId } }
      );

      console.log(
        `[Migration]   Case ${doc._id}: "${caseId}" → "${newCaseId}"`
      );
    }
  }

  console.log("[Migration] Duplicate resolution complete.");
}

async function buildUniqueIndex() {
  console.log("[Migration] Checking for existing indexes on caseId...");

  const existingIndexes = await Case.collection.indexes();
  const existing = existingIndexes.find(
    (idx) => JSON.stringify(idx.key) === JSON.stringify({ caseId: 1 })
  );

  if (existing && existing.unique) {
    console.log(
      `[Migration] Unique index already exists on caseId (name: "${existing.name}"). Nothing to do.`
    );
    return;
  }

  if (existing && !existing.unique) {
    console.log(
      `[Migration] Found pre-existing non-unique index "${existing.name}" ` +
      `on caseId. Dropping it before creating the unique index...`
    );
    await Case.collection.dropIndex(existing.name);
    console.log(`[Migration] Dropped "${existing.name}".`);
  }

  console.log("[Migration] Building unique index on Case.caseId...");

  await Case.collection.createIndex(
    { caseId: 1 },
    { unique: true, name: "caseId_1_unique" }
  );

  console.log("[Migration] Unique index built successfully.");
}

async function run() {
  console.log("[Migration] Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("[Migration] Connected.");

  let duplicates = await findDuplicateCaseIds();

  if (duplicates.length === 0) {
    console.log("[Migration] No duplicate caseId values found.");
  } else {
    console.log(
      `[Migration] Found ${duplicates.length} duplicate caseId group(s):`
    );
    duplicates.forEach((d) =>
      console.log(`[Migration]   "${d._id}" — ${d.count} documents`)
    );

    if (!FIX_MODE) {
      console.log(
        "[Migration] Re-run with --fix to automatically resolve these, " +
        "or resolve manually, then re-run this script."
      );
      await mongoose.disconnect();
      process.exit(1);
    }

    await fixDuplicates(duplicates);

    // Re-check after fixing.
    duplicates = await findDuplicateCaseIds();
    if (duplicates.length > 0) {
      console.error(
        "[Migration] Duplicates still remain after --fix. Aborting index build."
      );
      await mongoose.disconnect();
      process.exit(1);
    }
  }

  await buildUniqueIndex();

  console.log("[Migration] Done.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("[Migration] Failed:", err);
  process.exit(1);
});