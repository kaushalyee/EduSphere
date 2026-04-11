const mongoose = require("mongoose");

const rewardEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String, // e.g., "quiz", "assignment", "streak", "referral"
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
rewardEventSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("RewardEvent", rewardEventSchema);
