const mongoose = require("mongoose");

const marketplaceListingSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ["Boarding Places", "Devices", "Student Services", "Books & Notes", "Clothing", "Furniture"],
      required: true,
      trim: true,
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "sold", "hidden", "removed"],
      default: "active",
    },
  },
  { timestamps: true }
);

marketplaceListingSchema.index({ sellerId: 1 });
marketplaceListingSchema.index({ status: 1 });
marketplaceListingSchema.index({ category: 1 });

module.exports = mongoose.model("MarketplaceListing", marketplaceListingSchema);
