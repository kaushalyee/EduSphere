const mongoose = require("mongoose");

const spendingTrackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["companion"],
      required: true,
    },
  },
  { timestamps: true }
);

spendingTrackingSchema.index({ userId: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model("SpendingTracking", spendingTrackingSchema);
