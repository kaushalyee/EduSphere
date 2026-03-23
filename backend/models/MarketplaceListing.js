const mongoose = require('mongoose');

const listingImageSchema = new mongoose.Schema({
  image_url: { type: String, required: true },
  uploaded_at: { type: Date, default: Date.now },
  order: { type: Number, default: 0 }
}, { _id: true }); // Keep _id to match img_id requirement

const marketplaceListingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  contact_num: { type: String, required: true },
  location: { type: String },
  status: { type: String, enum: ['active', 'sold', 'removed'], default: 'active' },
  images: [listingImageSchema]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('MarketplaceListing', marketplaceListingSchema);
