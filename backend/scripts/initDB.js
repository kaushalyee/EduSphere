require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import models via index
const { Student, Wallet, RewardTransaction, GameAttempt, Score } = require('../models');

const initDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI missing in .env");
      process.exit(1);
    }

    await connectDB();
    console.log("✅ DB connected.");

    // Insert sample User (Student)
    const student = new Student({
      email: "test.student@example.com",
      password: "hashedpassword123",
      student_id: "IT12345678",
      name: "Test Student",
      tutor: false
    });
    await student.save();
    console.log("✅ Sample Student inserted:", student._id);

    // Insert sample Wallet linked to User
    const wallet = new Wallet({
      student_id: student._id,
      balance: 150
    });
    await wallet.save();
    console.log("✅ Sample Wallet inserted for student");

    // Insert sample RewardTransaction
    const transaction = new RewardTransaction({
      student_id: student._id,
      sourceType: "quiz",
      sourceId: new mongoose.Types.ObjectId(),
      pointsEarned: 50
    });
    await transaction.save();
    console.log("✅ Sample RewardTransaction inserted");

    // Insert sample GameAttempt linked to RewardTransaction
    const gameAttempt = new GameAttempt({
      student_id: student._id,
      transaction_id: transaction._id,
      status: "used"
    });
    await gameAttempt.save();
    console.log("✅ Sample GameAttempt inserted");

    // Insert sample Score linked to GameAttempt
    const scoreRecord = new Score({
      student_id: student._id,
      attemptId: gameAttempt._id,
      levelId: "level_1",
      scoreValue: 1200,
      moves: 15,
      timeTaken: 45
    });
    await scoreRecord.save();
    console.log("✅ Sample Score inserted");

    console.log("🎉 Database initialization script completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
};

initDB();
