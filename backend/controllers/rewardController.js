const mongoose = require("mongoose");
const RewardEvent = require("../models/RewardEvent");

/**
 * Get total reward points earned by the logged-in user today.
 * GET /api/rewards/today
 */
exports.getTodayGP = async (req, res) => {
  try {
    const userId = req.user.id;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const totalPoints = await RewardEvent.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startOfToday },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$points" },
        },
      },
    ]);

    res.json({
      todayGP: totalPoints.length > 0 ? totalPoints[0].total : 0,
    });
  } catch (error) {
    console.error("Error fetching today's GP:", error);
    res.status(500).json({ message: "Error fetching today's GP" });
  }
};
