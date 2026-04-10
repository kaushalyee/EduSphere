const mongoose = require("mongoose");

const gameAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    puzzleId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["started", "completed", "abandoned"],
      default: "started",
    },
    time: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

gameAttemptSchema.index({ userId: 1, date: 1 });
gameAttemptSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("GameAttempt", gameAttemptSchema);
