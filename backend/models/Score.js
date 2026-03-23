const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    // GameAttempt -> Score relationship
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameAttempt",
      required: true,
    },
    // Keep userId for leaderboards
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
    },
    levelReached: {
      type: Number,
      default: 1,
      min: 1,
    },
    isHighScore: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes
scoreSchema.index({ userId: 1 });
scoreSchema.index({ attemptId: 1 });
scoreSchema.index({ points: -1 });

module.exports = mongoose.model("Score", scoreSchema);
