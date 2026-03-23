const express = require("express");
const router = express.Router();
const { completeOnboarding } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.put("/onboarding", protect, completeOnboarding);

module.exports = router;