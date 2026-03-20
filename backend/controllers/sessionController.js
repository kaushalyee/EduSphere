const Session = require("../models/Session");
const { TOPICS_BY_CATEGORY } = require("../constants/topics");

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

    if (mode === "online" && !meetingLink) {
      return res.status(400).json({
        success: false,
        message: "Meeting link is required for online sessions",
      });
    }

    if (mode === "offline" && !location) {
      return res.status(400).json({
        success: false,
        message: "Location is required for offline sessions",
      });
    }

    const session = await Session.create({
      tutorId: req.user._id,
      category,
      topic,
      date,
      time,
      duration: duration || 60,
      mode,
      location: mode === "offline" ? location : "",
      meetingLink: mode === "online" ? meetingLink : "",
      quizLink: quizLink || "",
      capacity: capacity || null,
      description: description || "",
    });

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
    const sessions = await Session.find({ tutorId: req.user._id })
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
    const sessions = await Session.find()
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

module.exports = {
  createSession,
  getMySessions,
  getAllSessions,
  getSessionById,
};