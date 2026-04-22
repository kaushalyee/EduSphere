const mongoose = require("mongoose");

const learningPatternSchema = new mongoose.Schema(
  {
    weakTopic: {
      type: String,
      required: true,
      trim: true,
    },
    prerequisiteTopic: {
      type: String,
      required: true,
      trim: true,
    },
    sampleSize: {
      type: Number,
      default: 0,
    },
    avgScoreWithPrereq: {
      type: Number,
      default: 0,
    },
    avgScoreWithoutPrereq: {
      type: Number,
      default: 0,
    },
    improvementRate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// one pattern per weakTopic + prerequisiteTopic pair
learningPatternSchema.index(
  { weakTopic: 1, prerequisiteTopic: 1 },
  { unique: true }
);

module.exports = mongoose.model("LearningPattern", learningPatternSchema);
