const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

quizResultSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("QuizResult", quizResultSchema);