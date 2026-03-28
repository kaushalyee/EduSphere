require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");

const connectDB = require("../../config/db");
const User = require("../../models/User");
const Session = require("../../models/Session");
const QuizResult = require("../../models/QuizResult");
const Wallet = require("../../models/Wallet");
const RewardTransaction = require("../../models/RewardTransaction");
const { convertQuizResultToRP } = require("../../services/quizRPConversionService");

const TEST_EMAIL = process.env.TEST_EMAIL || "test4@mail.com";
const TEST_SCORE = Number(process.env.TEST_SCORE || 10);
const TEST_TOTAL = Number(process.env.TEST_TOTAL || 20);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureStudent(email) {
  let student = await User.findOne({ email: email.toLowerCase(), role: "student" });
  if (student) return student;

  student = await User.create({
    name: "Integration Test Student",
    email: email.toLowerCase(),
    password: "hashed-placeholder-password",
    role: "student",
    studentID: `IT-${Date.now()}`,
  });

  return student;
}

async function ensureTutor() {
  let tutor = await User.findOne({ role: "tutor" });
  if (tutor) return tutor;

  tutor = await User.create({
    name: "Integration Tutor",
    email: `integration.tutor.${Date.now()}@mail.com`,
    password: "hashed-placeholder-password",
    role: "tutor",
  });

  return tutor;
}

async function createSessionForTest(tutorId) {
  return Session.create({
    tutorId,
    category: "Programming",
    topic: `Auto-RP Integration ${Date.now()}`,
    date: new Date(),
    time: "10:00",
    duration: 60,
    mode: "online",
  });
}

async function run() {
  let status = "FAIL";

  try {
    await connectDB();

    // 1) Insert quiz result for a test user
    const student = await ensureStudent(TEST_EMAIL);
    const tutor = await ensureTutor();
    const session = await createSessionForTest(tutor._id);

    const walletBeforeDoc = await Wallet.findOne({ userId: student._id });
    const balanceBefore = walletBeforeDoc ? walletBeforeDoc.balance : 0;

    const percentage = Number(((TEST_SCORE / TEST_TOTAL) * 100).toFixed(2));
    const quizResult = await QuizResult.create({
      sessionId: session._id,
      studentId: student._id,
      studentEmail: student.email,
      marksObtained: TEST_SCORE,
      totalMarks: TEST_TOTAL,
      percentage,
    });

    console.log("Created quizResultId:", quizResult._id.toString());
    console.log("Student ID:", student._id.toString());
    console.log("Wallet before:", balanceBefore);

    // This calls the same conversion service used by the controller-level auto flow.
    await convertQuizResultToRP(quizResult._id);

    // 2) Wait for auto conversion
    await sleep(500);

    // 3) Fetch wallet
    const walletAfterDoc = await Wallet.findOne({ userId: student._id });
    const balanceAfter = walletAfterDoc ? walletAfterDoc.balance : 0;

    // 4) Fetch reward transactions
    const transactions = walletAfterDoc
      ? await RewardTransaction.find({ walletId: walletAfterDoc._id }).sort({
          createdAt: -1,
        })
      : [];

    const expectedDescription = `quiz:${quizResult._id}`;
    const matchingTx = transactions.find((tx) => tx.description === expectedDescription);

    // 5) Verify
    const checks = {
      balanceIncreased: balanceAfter > balanceBefore,
      transactionExists: Boolean(matchingTx),
      descriptionMatches: Boolean(matchingTx && matchingTx.description === expectedDescription),
    };

    status =
      checks.balanceIncreased && checks.transactionExists && checks.descriptionMatches
        ? "PASS"
        : "FAIL";

    console.log("\n=== AUTO QUIZ -> RP INTEGRATION TEST ===");
    console.log("wallet balance increased:", checks.balanceIncreased);
    console.log("transaction exists:", checks.transactionExists);
    console.log("description matches:", checks.descriptionMatches);
    console.log("wallet before:", balanceBefore);
    console.log("wallet after :", balanceAfter);
    console.log("transactions count:", transactions.length);
    console.log("expected description:", expectedDescription);
    console.log("STATUS:", status);
  } catch (error) {
    console.error("Test execution failed:", error.message);
    console.log("STATUS: FAIL");
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();
