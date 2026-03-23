const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "submitted", "abandoned"],
      default: "in-progress",
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ studentId: 1 });
quizAttemptSchema.index({ sessionId: 1 });

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
