const express = require("express");
const router = express.Router();

const {
  createSessionRequest,
  getMySessionRequests,
  getTrendingRequests,
} = require("../controllers/sessionRequestController");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/", protect, authorize("student"), createSessionRequest);
router.get("/my-requests", protect, authorize("student"), getMySessionRequests);

// Tutor - view trending requested topics
router.get("/trending", protect, authorize("tutor"), getTrendingRequests);

module.exports = router;