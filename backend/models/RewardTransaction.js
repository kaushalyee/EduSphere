const mongoose = require("mongoose");

const rewardTransactionSchema = new mongoose.Schema(
  {
    // Wallet -> RewardTransaction relationship
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["earned", "spent", "penalty"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Indexes
rewardTransactionSchema.index({ walletId: 1 });
rewardTransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("RewardTransaction", rewardTransactionSchema);
