const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getRecentActivity } = require("../controllers/activityController");

const router = express.Router();

router.get("/recent", protect, getRecentActivity);

module.exports = router;
