const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
  {
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizAttempt",
      required: true,
      unique: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0,
    },
    feedback: {
      type: String,
      trim: true,
      default: "",
    },
    passed: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

quizResultSchema.index({ studentId: 1 });
quizResultSchema.index({ attemptId: 1 });

module.exports = mongoose.model("QuizResult", quizResultSchema);
