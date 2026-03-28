/**
 * One-off migration: normalize quizresults where studentId/sessionId
 * were stored as strings so lookups and RP conversion match ObjectId types.
 *
 * Run: node backend/scripts/fix_invalid_quizresults.js
 * (from repo root, or adjust cwd; requires MONGO_URI in .env)
 */
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const QuizResult = require("../models/QuizResult");

function toObjectIdIfValid(value, label, docId) {
  if (value == null) return { ok: false, reason: "null" };
  if (value instanceof mongoose.Types.ObjectId) {
    return { ok: true, id: value };
  }
  const str = String(value).trim();
  if (!mongoose.Types.ObjectId.isValid(str)) {
    console.warn(
      `[fix_invalid_quizresults] Skip doc ${docId}: invalid ${label} "${str}"`
    );
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, id: new mongoose.Types.ObjectId(str) };
}

async function run() {
  await connectDB();

  const query = {
    $or: [
      { studentId: { $type: "string" } },
      { sessionId: { $type: "string" } },
    ],
  };

  const cursor = QuizResult.find(query).cursor();
  let updated = 0;
  let skipped = 0;

  for await (const doc of cursor) {
    const set = {};

    if (typeof doc.studentId === "string") {
      const r = toObjectIdIfValid(doc.studentId, "studentId", doc._id);
      if (r.ok) set.studentId = r.id;
      else {
        skipped += 1;
        continue;
      }
    }

    if (typeof doc.sessionId === "string") {
      const r = toObjectIdIfValid(doc.sessionId, "sessionId", doc._id);
      if (r.ok) set.sessionId = r.id;
      else {
        skipped += 1;
        continue;
      }
    }

    if (Object.keys(set).length === 0) continue;

    await QuizResult.updateOne({ _id: doc._id }, { $set: set });
    updated += 1;
    console.log(`Updated ${doc._id}: ${Object.keys(set).join(", ")}`);
  }

  console.log(`\nDone. Updated: ${updated}, skipped (invalid id): ${skipped}`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
