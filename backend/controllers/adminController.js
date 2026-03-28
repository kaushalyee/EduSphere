const User = require("../models/User");
const MarketplaceListing = require("../models/MarketplaceListing");
const ListingImage = require("../models/ListingImage");
const fs = require("fs");
const path = require("path");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["student", "tutor"] },
    })
      .select("name email role studentID year semester createdAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTutors = await User.countDocuments({ role: "tutor" });
    const totalListings = await MarketplaceListing.countDocuments({
      status: "active",
    });

    res.json({
      success: true,
      data: {
        totalStudents,
        totalTutors,
        totalListings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error.message,
    });
  }
};

exports.getAllListingsAdmin = async (req, res) => {
  try {
    const listings = await MarketplaceListing.find()
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });

    // For each listing, manually fetch images since they are in a separate collection
    const listingsWithImages = await Promise.all(
      listings.map(async (listing) => {
        const images = await ListingImage.find({ listingId: listing._id }).sort({
          order: 1,
        });
        return {
          ...listing._doc,
          images: images.map((img) => img.url),
        };
      })
    );

    res.json({
      success: true,
      data: listingsWithImages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch listings",
      error: error.message,
    });
  }
};

exports.deleteListingAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find all images related to this listing
    const images = await ListingImage.find({ listingId: id });

    // 2. Delete actual image files
    images.forEach((img) => {
      const fileName = img.url.split("/").pop();
      const filePath = path.join(__dirname, "../uploads/marketplace", fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // 3. Delete ListingImage documents
    await ListingImage.deleteMany({ listingId: id });

    // 4. Delete the listing document
    const deletedListing = await MarketplaceListing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete listing",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin accounts",
      });
    }

    // 1. Find all listings by this user
    const listings = await MarketplaceListing.find({ sellerId: id });

    // 2. For each listing, perform full cleanup (files + documents)
    for (const listing of listings) {
      const images = await ListingImage.find({ listingId: listing._id });

      // Delete physical files
      images.forEach((img) => {
        const fileName = img.url.split("/").pop();
        const filePath = path.join(
          __dirname,
          "../uploads/marketplace",
          fileName
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // Delete ListingImage documents
      await ListingImage.deleteMany({ listingId: listing._id });

      // Delete the listing
      await MarketplaceListing.findByIdAndDelete(listing._id);
    }

    // 3. Delete the user
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};