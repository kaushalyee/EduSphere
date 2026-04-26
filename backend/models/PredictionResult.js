const mongoose = require("mongoose");

const predictionResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    predictedGrade: {
      type: String,
      required: true,
      trim: true,
    },
    confidenceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    factors: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

predictionResultSchema.index({ studentId: 1 });

module.exports = mongoose.model("PredictionResult", predictionResultSchema);
