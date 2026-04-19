const express = require("express");
const router = express.Router();

const {
  createSession,
  getMySessions,
  getAllSessions,
  getSessionById,
  updateSession,
  markSessionComplete,
  cancelSession,
  getCompletedSessions,
  getCancelledSessions,
  getArchivedSessions,
  archiveSession,
  restoreSession,
  getStudentFeed,
} = require("../controllers/sessionController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// Create session (Tutor)
router.post("/", protect, authorize("tutor"), createSession);

// Tutor - Active sessions
router.get("/my-sessions", protect, authorize("tutor"), getMySessions);

// Tutor - Completed sessions
router.get("/completed", protect, authorize("tutor"), getCompletedSessions);

// Tutor - Cancelled sessions
router.get("/cancelled", protect, authorize("tutor"), getCancelledSessions);

// Tutor - Archived sessions
router.get("/archived", protect, authorize("tutor"), getArchivedSessions);
 

// Student - Recommended feed   BEFORE /:id
router.get("/feed", protect, authorize("student"), getStudentFeed);

// Student - View all sessions
router.get("/", protect, getAllSessions);
//Edit session (Tutor)   /:id always last
router.put("/:sessionId", protect, authorize("tutor"), updateSession);

// Get single session   /:id always last
router.get("/:id", protect, getSessionById);

// Mark complete
router.put("/:sessionId/complete", protect, authorize("tutor"), markSessionComplete);

// Cancel session
router.put("/:sessionId/cancel", protect, authorize("tutor"), cancelSession);
// Archive session (completed or cancelled only)
router.put("/:sessionId/archive", protect, authorize("tutor"), archiveSession);
 
// Restore archived session
router.put("/:sessionId/restore", protect, authorize("tutor"), restoreSession);

module.exports = router;
