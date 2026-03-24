const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  importQuizResults,
  getResultsBySession,
  getResultsByStudent,
  getMyResults, // ✅ ADD THIS
} = require("../controllers/quizResultController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".xlsx", ".xls"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files (.xlsx, .xls) are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// Upload Excel
router.post(
  "/import/:sessionId",
  protect,
  authorize("tutor"),
  upload.single("file"),
  importQuizResults
);

//
router.get(
  "/session/:sessionId",
  protect,
  authorize("tutor", "admin"),
  getResultsBySession
);

// Get specific student
router.get("/student/:studentId", protect, getResultsByStudent);

//
router.get("/me", protect, authorize("student"), getMyResults);

module.exports = router;