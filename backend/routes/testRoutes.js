const router = require("express").Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const { Student, Wallet } = require('../models');

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

// Test initialization
router.get("/init", async (req, res) => {
  try {
    let student = await Student.findOne({ email: "test.init@example.com" });
    if (!student) {
      student = new Student({
        email: "test.init@example.com",
        password: "securepassword",
        student_id: `IT${Math.floor(Math.random() * 100000000)}`,
        name: "Init Route Test Student",
        tutor: false,
      });
      await student.save();
    }

    let wallet = await Wallet.findOne({ student_id: student._id });
    if (!wallet) {
      wallet = new Wallet({
        student_id: student._id,
        balance: 100,
      });
      await wallet.save();
    }

    res.status(200).json({
      success: true,
      message: "Database test initialization successful",
      data: { student, wallet },
    });
  } catch (error) {
    console.error("Test Init Route Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

module.exports = router;