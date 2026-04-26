const mongoose = require("mongoose");

const listingImageSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MarketplaceListing",
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index on listingId and order for efficient querying
listingImageSchema.index({ listingId: 1, order: 1 });

module.exports = mongoose.model("ListingImage", listingImageSchema);
