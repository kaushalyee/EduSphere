const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

walletSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Wallet", walletSchema);
