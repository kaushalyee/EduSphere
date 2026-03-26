const express = require("express");
const router = express.Router();
const {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  uploadListingImages,
  deleteListingImage,
} = require("../controllers/marketplaceController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

// Public routes
router.get("/", getAllListings);
router.get("/:id", getListingById);

// Protected routes (Student only)
router.post("/", protect, authorize("student"), uploadMiddleware, createListing);
router.put("/:id", protect, authorize("student"), updateListing);
router.delete("/:id", protect, authorize("student"), deleteListing);

// Image management
router.post("/:id/images", protect, authorize("student"), uploadMiddleware, uploadListingImages);
router.delete("/:id/images/:imageId", protect, authorize("student"), deleteListingImage);

module.exports = router;
