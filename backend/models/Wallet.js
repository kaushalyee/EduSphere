const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    // User -> Wallet relationship
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // A user should only have one wallet
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "coins",
      trim: true,
    },
  },
  { timestamps: true }
);

// Indexes
walletSchema.index({ userId: 1 });

module.exports = mongoose.model("Wallet", walletSchema);
