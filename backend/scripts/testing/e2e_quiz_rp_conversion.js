/**
 * Full E2E: QuizResult → convertQuizResultToRP → Wallet + RewardTransaction
 * Run: node backend/scripts/testing/e2e_quiz_rp_conversion.js
 */
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});
const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const User = require("../../models/User");
const Session = require("../../models/Session");
const QuizResult = require("../../models/QuizResult");
const Wallet = require("../../models/Wallet");
const RewardTransaction = require("../../models/RewardTransaction");
const { convertQuizResultToRP } = require("../../services/quizRPConversionService");

const TEST_EMAIL = "test4@mail.com";

async function ensureSessionForStudent(studentId) {
  const existing = await Session.findOne().sort({ createdAt: -1 });
  if (existing) {
    const clash = await QuizResult.findOne({
      sessionId: existing._id,
      studentId,
    });
    if (!clash) return existing;
  }

  const tutor = await User.findOne({ role: "tutor" });
  if (!tutor) {
    throw new Error("No tutor in DB — create a tutor user first");
  }

  return Session.create({
    tutorId: tutor._id,
    category: "Programming",
    topic: `E2E Quiz RP ${Date.now()}`,
    date: new Date(),
    time: "10:00",
    duration: 60,
    mode: "online",
  });
}

async function run() {
  await connectDB();

  const student = await User.findOne({
    email: TEST_EMAIL.toLowerCase(),
    role: "student",
  });
  if (!student) {
    console.error(`FAIL: Student ${TEST_EMAIL} not found`);
    process.exit(1);
  }

  const studentId = new mongoose.Types.ObjectId(student._id);
  const session = await ensureSessionForStudent(studentId);
  const sessionId = new mongoose.Types.ObjectId(session._id);

  const walletBeforeDoc = await Wallet.findOne({ userId: studentId });
  const walletBefore = walletBeforeDoc ? walletBeforeDoc.balance : 0;

  const quizResult = await QuizResult.create({
    sessionId,
    studentId,
    studentEmail: TEST_EMAIL.toLowerCase(),
    marksObtained: 10,
    totalMarks: 20,
    percentage: 50,
  });

  const r1 = await convertQuizResultToRP(quizResult._id);

  const walletAfterDoc = await Wallet.findOne({ userId: studentId });
  const walletAfter = walletAfterDoc ? walletAfterDoc.balance : 0;
  const rpAdded = walletAfter - walletBefore;

  const desc = `quiz:${quizResult._id}`;
  const tx = await RewardTransaction.findOne({
    walletId: walletAfterDoc._id,
    description: desc,
  });

  const r2 = await convertQuizResultToRP(quizResult._id);

  const walletAfterDup = (await Wallet.findOne({ userId: studentId })).balance;
  const txCount = await RewardTransaction.countDocuments({
    walletId: walletAfterDoc._id,
    description: desc,
  });

  const expectedRp = 40;
  const passBalance = rpAdded === expectedRp;
  const passTx =
    tx &&
    tx.amount === expectedRp &&
    tx.type === "earned" &&
    tx.description === desc;
  const passDup =
    r2.alreadyProcessed === true &&
    walletAfterDup === walletAfter &&
    txCount === 1;

  console.log("\n=== TEST RESULT ===");
  console.log(`Student ID: ${student._id.toString()}`);
  console.log(`QuizResult ID: ${quizResult._id.toString()}`);
  console.log(`Wallet Before: ${walletBefore}`);
  console.log(`Wallet After: ${walletAfter}`);
  console.log(`RP Added: ${rpAdded}`);
  console.log(`Transaction Created: ${tx ? "YES" : "NO"}`);
  console.log(
    `Duplicate Prevention: ${passDup ? "WORKING" : "FAILED"}`
  );

  console.log("\n--- Detail checks ---");
  console.log(`First conversion alreadyProcessed: ${r1.alreadyProcessed}`);
  console.log(`Second conversion alreadyProcessed: ${r2.alreadyProcessed}`);
  console.log(`Transaction amount: ${tx?.amount}, type: ${tx?.type}`);
  console.log(`Tx count for description: ${txCount}`);
  console.log(`Wallet unchanged after dup call: ${walletAfterDup === walletAfter}`);

  const pass =
    passBalance && passTx && passDup && r1.alreadyProcessed === false;

  console.log(`\n=== ${pass ? "PASS" : "FAIL"} ===\n`);

  await mongoose.connection.close();
  process.exit(pass ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
