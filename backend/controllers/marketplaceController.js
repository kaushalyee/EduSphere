const MarketplaceListing = require("../models/MarketplaceListing");
const ListingImage = require("../models/ListingImage");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// @desc    Get all active listings
// @route   GET /api/marketplace
// @access  Public
exports.getAllListings = async (req, res) => {
  try {
    const { category, search, condition } = req.query;
    let query = { status: "active" };

    if (category && category !== "All Categories") {
      query.category = category;
    }

    if (condition) {
      query.condition = condition;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Find listings and populate seller name
    const listings = await MarketplaceListing.find(query)
      .populate("sellerId", "name")
      .sort({ createdAt: -1 });

    // For each listing, find its images
    const listingsWithImages = await Promise.all(
      listings.map(async (listing) => {
        const images = await ListingImage.find({ listingId: listing._id }).sort({ order: 1 });
        return {
          ...listing.toObject(),
          images,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: listingsWithImages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single listing by ID
// @route   GET /api/marketplace/:id
// @access  Public
exports.getListingById = async (req, res) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id).populate("sellerId", "name email");

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const images = await ListingImage.find({ listingId: listing._id }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...listing.toObject(),
        images,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new listing
// @route   POST /api/marketplace
// @access  Private (Student only)
exports.createListing = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can create listings" });
    }

    const { title, description, price, location, category, condition, phoneNumber, whatsappNumber } = req.body;

    const listing = await MarketplaceListing.create({
      sellerId: req.user._id,
      title,
      description,
      price,
      location,
      category,
      condition,
      phoneNumber,
      whatsappNumber,
      status: "active",
    });

    // Handle uploaded images
    let createdImages = [];
    if (req.files && req.files.length > 0) {
      createdImages = await Promise.all(
        req.files.map(async (file, index) => {
          return await ListingImage.create({
            listingId: listing._id,
            url: `uploads/marketplace/${file.filename}`,
            isPrimary: index === 0,
            order: index,
          });
        })
      );
    }

    res.status(201).json({
      success: true,
      data: {
        ...listing.toObject(),
        images: createdImages,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update listing
// @route   PUT /api/marketplace/:id
// @access  Private (Owner only)
exports.updateListing = async (req, res) => {
  try {
    let listing = await MarketplaceListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Check ownership
    if (listing.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this listing" });
    }

    listing = await MarketplaceListing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete listing
// @route   DELETE /api/marketplace/:id
// @access  Private (Owner only)
exports.deleteListing = async (req, res) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Check ownership
    if (listing.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this listing" });
    }

    // Delete related ListingImage documents and actual files
    const images = await ListingImage.find({ listingId: listing._id });
    for (const img of images) {
      const filePath = path.join(__dirname, "..", img.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await ListingImage.findByIdAndDelete(img._id);
    }

    await MarketplaceListing.findByIdAndDelete(listing._id);

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload additional images to listing
// @route   POST /api/marketplace/:id/images
// @access  Private (Owner only)
exports.uploadListingImages = async (req, res) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Check ownership
    if (listing.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to upload images to this listing" });
    }

    // Check existing count
    const existingCount = await ListingImage.countDocuments({ listingId: listing._id });
    if (existingCount + (req.files ? req.files.length : 0) > 5) {
      // Delete newly uploaded files since we are rejecting
      if (req.files) {
        req.files.forEach(file => {
          const filePath = path.join(__dirname, "../uploads/marketplace", file.filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
      }
      return res.status(400).json({ success: false, message: "Maximum 5 images allowed per listing" });
    }

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      // Check if any primary exists
      const hasPrimary = await ListingImage.findOne({ listingId: listing._id, isPrimary: true });

      uploadedImages = await Promise.all(
        req.files.map(async (file, index) => {
          return await ListingImage.create({
            listingId: listing._id,
            url: `uploads/marketplace/${file.filename}`,
            isPrimary: !hasPrimary && index === 0,
            order: existingCount + index,
          });
        })
      );
    }

    res.status(200).json({
      success: true,
      data: uploadedImages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a single image from listing
// @route   DELETE /api/marketplace/:id/images/:imageId
// @access  Private (Owner only)
exports.deleteListingImage = async (req, res) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Check ownership
    if (listing.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete image from this listing" });
    }

    const image = await ListingImage.findById(req.params.imageId);
    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    // Delete physical file
    const filePath = path.join(__dirname, "..", image.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const wasPrimary = image.isPrimary;
    await ListingImage.findByIdAndDelete(image._id);

    // If it was primary, set the next one as primary
    if (wasPrimary) {
      const nextImage = await ListingImage.findOne({ listingId: listing._id }).sort({ order: 1 });
      if (nextImage) {
        nextImage.isPrimary = true;
        await nextImage.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
