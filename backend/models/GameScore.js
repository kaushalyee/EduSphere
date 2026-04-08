const mongoose = require("mongoose");

const gameScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gp: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    gridSize: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for leaderboard performance
gameScoreSchema.index({ gp: -1 });

module.exports = mongoose.model("GameScore", gameScoreSchema);
