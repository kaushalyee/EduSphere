const router = require("express").Router();
const { protect, authorize } = require("../middlewares/authMiddleware");

// Any logged user
router.get("/me", protect, (req, res) => {
  res.json({
    message: "You are logged in",
    user: req.user,
  });
});

// Tutor only
router.get("/tutor-only", protect, authorize("tutor"), (req, res) => {
  res.json({ message: "Welcome Tutor!" });
});

// Student only
router.get("/student-only", protect, authorize("student"), (req, res) => {
  res.json({ message: "Welcome Student!" });
});

module.exports = router;