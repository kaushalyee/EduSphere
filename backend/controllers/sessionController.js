const Session = require("../models/Session");
const { TOPICS_BY_CATEGORY } = require("../constants/topics");
const QuizResult = require("../models/QuizResult");
const SessionRequest = require("../models/SessionRequest");

const isValidUrl = (value) => {
  return /^https?:\/\/.+/i.test(value);
};

const createSession = async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        success: false,
        message: "Only tutors can create sessions",
      });
    }

    const {
      category,
      topic,
      date,
      time,
      duration,
      mode,
      location,
      meetingLink,
      quizLink,
      capacity,
      description,
    } = req.body;

    if (!category || !topic || !date || !time || !mode) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const allowedTopics = TOPICS_BY_CATEGORY[category];

    if (!allowedTopics) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    if (!allowedTopics.includes(topic)) {
      return res.status(400).json({
        success: false,
        message: "Topic does not belong to the selected category",
      });
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Past dates cannot be selected",
      });
    }

    if (duration && Number(duration) < 30) {
      return res.status(400).json({
        success: false,
        message: "Session duration must be at least 30 minutes",
      });
    }

    if (mode === "online" && !meetingLink?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Meeting link is required for online sessions",
      });
    }

    if (mode === "offline" && !location?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location is required for offline sessions",
      });
    }

    if (meetingLink && !isValidUrl(meetingLink)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid meeting link",
      });
    }

    if (quizLink && !isValidUrl(quizLink)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid quiz link",
      });
    }

    if (capacity && Number(capacity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be at least 1",
      });
    }

    const session = await Session.create({
      tutorId: req.user._id,
      category,
      topic,
      date,
      time,
      duration: duration ? Number(duration) : 60,
      mode,
      location: mode === "offline" ? location.trim() : "",
      meetingLink: mode === "online" ? meetingLink.trim() : "",
      quizLink: quizLink ? quizLink.trim() : "",
      capacity: capacity ? Number(capacity) : null,
      description: description ? description.trim() : "",
    });

const updatedRequests = await SessionRequest.updateMany(
  {
    category: category.trim(),
    topic: topic.trim(),
    status: "pending",
  },
  {
    $set: {
      status: "fulfilled",
      matchedSessionId: session._id,
    },
  }
);

console.log("Updated requests result:", updatedRequests);

    return res.status(201).json({
      success: true,
      message: "Session created successfully",
      session,
    });
  } catch (error) {
    console.error("createSession error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating session",
    });
  }
};

const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      tutorId: req.user._id,
      status: "upcoming",
    })
      .populate("tutorId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("getMySessions error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching sessions",
    });
  }
};

const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: "upcoming" })
      .populate("tutorId", "name email")
      .sort({ date: 1, time: 1 });

    return res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("getAllSessions error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching all sessions",
    });
  }
};

const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate(
      "tutorId",
      "name email"
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("getSessionById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching session",
    });
  }
};
// MARK AS COMPLETE
const markSessionComplete = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // check ownership
    if (session.tutorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // prevent re-completing
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session already completed" });
    }

    // cannot complete cancelled session
    if (session.status === "cancelled") {
      return res.status(400).json({ message: "Cancelled session cannot be completed" });
    }

    session.status = "completed";
    session.completedAt = new Date();

    await session.save();

    res.status(200).json({
      success: true,
      message: "Session marked as complete",
      session,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// CANCEL SESSION
const cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // check ownership
    if (session.tutorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    //check already a cancelled session
    if (session.status === "cancelled") {
      return res.status(400).json({ message: "Session already cancelled" });
    }
    //  cannot cancel completed session
    if (session.status === "completed") {
      return res.status(400).json({ message: "Completed session cannot be cancelled" });
    }

    session.status = "cancelled";

    await session.save();

    res.status(200).json({
      success: true,
      message: "Session cancelled",
      session,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const getCompletedSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      tutorId: req.user._id,
      status: "completed",
    }).sort({ updatedAt: -1 });

    const sessionIds = sessions.map((session) => session._id);

    const uploadedSessionIds = await QuizResult.find({
      sessionId: { $in: sessionIds },
    }).distinct("sessionId");

    const uploadedSet = new Set(
      uploadedSessionIds.map((id) => id.toString())
    );

    const sessionsWithUploadStatus = sessions.map((session) => ({
      ...session.toObject(),
      resultsUploaded: uploadedSet.has(session._id.toString()),
    }));

    res.status(200).json({
      success: true,
      sessions: sessionsWithUploadStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching completed sessions",
    });
  }
};
const getCancelledSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      tutorId: req.user._id,
      status: "cancelled",
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching cancelled sessions",
    });
  }
};

module.exports = {
  createSession,
  getMySessions,
  getAllSessions,
  getSessionById,
  markSessionComplete,
  cancelSession,
  getCompletedSessions,
  getCancelledSessions,
};