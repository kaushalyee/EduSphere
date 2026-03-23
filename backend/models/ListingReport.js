const mongoose = require("mongoose");

const listingReportSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MarketplaceListing",
      required: true,
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    additionalDetails: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
    adminActionTaken: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

listingReportSchema.index({ listingId: 1 });
listingReportSchema.index({ reporterId: 1 });
listingReportSchema.index({ status: 1 });

module.exports = mongoose.model("ListingReport", listingReportSchema);
