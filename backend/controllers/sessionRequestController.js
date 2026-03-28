const SessionRequest = require("../models/SessionRequest");
const { TOPICS_BY_CATEGORY } = require("../constants/topics");

const createSessionRequest = async (req, res) => {
  try {
    const { category, topic, preferredMode, preferredTime, preferredDate } = req.body;

    if (!category || !topic || !preferredTime) {
      return res.status(400).json({
        message: "Category, topic, and preferred time are required",
      });
    }

    const validCategories = Object.keys(TOPICS_BY_CATEGORY);
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category selected" });
    }

    const validTopics = TOPICS_BY_CATEGORY[category] || [];
    if (!validTopics.includes(topic)) {
      return res.status(400).json({
        message: "Invalid topic selected for this category",
      });
    }

    const existingRequest = await SessionRequest.findOne({
      studentId: req.user._id,
      category,
      topic,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already requested this topic",
      });
    }

    const newRequest = await SessionRequest.create({
      studentId: req.user._id,
      category,
      topic,
      preferredMode: preferredMode || "any",
      preferredTime,
      preferredDate: preferredDate || null,
    });

    res.status(201).json({
      message: "Session request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Create session request error:", error);
    res.status(500).json({ message: "Server error while creating session request" });
  }
};

const getMySessionRequests = async (req, res) => {
  try {
    const requests = await SessionRequest.find({ studentId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ requests });
  } catch (error) {
    console.error("Get my session requests error:", error);
    res.status(500).json({ message: "Server error while fetching requests" });
  }
};

const getTrendingRequests = async (req, res) => {
  try {
    const trendingRequests = await SessionRequest.aggregate([
      {
        $match: {
          status: "pending",
        },
      },
      {
        $group: {
          _id: {
            category: "$category",
            topic: "$topic",
            preferredTime: "$preferredTime",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.category": 1,
          "_id.topic": 1,
          count: -1,
        },
      },
      {
        $group: {
          _id: {
            category: "$_id.category",
            topic: "$_id.topic",
          },
          requestCount: { $sum: "$count" },
          preferredTime: { $first: "$_id.preferredTime" },
        },
      },
      {
        $sort: { requestCount: -1 },
      },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          topic: "$_id.topic",
          requestCount: 1,
          preferredTime: 1,
        },
      },
    ]);

    res.status(200).json({ trendingRequests });
  } catch (error) {
    console.error("Get trending requests error:", error);
    res.status(500).json({ message: "Server error while fetching trending requests" });
  }
};
module.exports = {
  createSessionRequest,
  getMySessionRequests,
  getTrendingRequests,
};