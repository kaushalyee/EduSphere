const mongoose = require("mongoose");

const attemptCollectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    attemptsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

attemptCollectionSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("AttemptCollection", attemptCollectionSchema);
