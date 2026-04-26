const SessionRequest = require("../models/SessionRequest");

const createSessionRequest = async (req, res) => {
  try {
    const { category, topic, preferredMode, preferredTime, preferredDate } = req.body;

    const request = new SessionRequest({
      studentId: req.user._id,
      category,
      topic,
      preferredMode,
      preferredTime,
      preferredDate,
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    console.error("Create session request error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user's session requests
// @route   GET /api/session-requests/my-requests
// @access  Private (Student)
const getMySessionRequests = async (req, res) => {
  try {
    const requests = await SessionRequest.find({ studentId: req.user._id })
    .populate("matchedSessionId", "status")
    .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Get my session requests error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get trending requested topics
// @route   GET /api/session-requests/trending
// @access  Private (Tutor)
const getTrendingRequests = async (req, res) => {
  try {
    const trending = await SessionRequest.aggregate([
      { $match: { status: "pending" } },
      { 
        $group: { 
          _id: { topic: "$topic", category: "$category" }, 
          count: { $sum: 1 } 
        } 
      },
      { 
        $project: { 
          topic: "$_id.topic", 
          category: "$_id.category", 
          count: 1, 
          _id: 0 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json(trending);
  } catch (error) {
    console.error("Get trending requests error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createSessionRequest,
  getMySessionRequests,
  getTrendingRequests,
};
