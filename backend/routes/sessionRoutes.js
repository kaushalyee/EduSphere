const express = require("express");
const router = express.Router();

const {
  createSession, getMySessions, getAllSessions, getSessionById,
  updateSession, markSessionComplete, cancelSession,
  getCompletedSessions, getCancelledSessions, getArchivedSessions,
  archiveSession, restoreSession, getStudentFeed,
} = require("../controllers/sessionController");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/", protect, authorize("tutor"), createSession);

router.get("/my-sessions", protect, authorize("tutor"), getMySessions);
router.get("/completed", protect, authorize("tutor"), getCompletedSessions);
router.get("/cancelled", protect, authorize("tutor"), getCancelledSessions);
router.get("/archived", protect, authorize("tutor"), getArchivedSessions);
router.get("/feed", protect, authorize("student"), getStudentFeed);
router.get("/", protect, getAllSessions);
router.get("/:id", protect, getSessionById);

// Specific PUT routes BEFORE the generic one
router.put("/:sessionId/complete", protect, authorize("tutor"), markSessionComplete);
router.put("/:sessionId/cancel", protect, authorize("tutor"), cancelSession);
router.put("/:sessionId/archive", protect, authorize("tutor"), archiveSession);
router.put("/:sessionId/restore", protect, authorize("tutor"), restoreSession);

//  Generic PUT last
router.put("/:sessionId", protect, authorize("tutor"), updateSession);

module.exports = router;