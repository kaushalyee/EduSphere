const RewardEvent = require("../models/RewardEvent");
const GameAttempt = require("../models/GameAttempt");
const User = require("../models/User");
const mongoose = require("mongoose");

/**
 * Creates a reward event and emits a wallet update socket event.
 */
async function triggerWalletUpdate(userId) {
  if (!global.io) return;

  try {
    const uid = new mongoose.Types.ObjectId(userId);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Fetch Today GP
    const todayPointsAgg = await RewardEvent.aggregate([
      {
        $match: {
          userId: uid,
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

    const todayPoints = todayPointsAgg.length > 0 ? todayPointsAgg[0].total : 0;

    // Fetch Weekly Attempts
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyAttempts = await GameAttempt.countDocuments({
      userId: uid,
      createdAt: { $gte: sevenDaysAgo },
    });

    // Emit to specific user if possible, or broadcast (here broadcasting for simplicity as per common task patterns)
    // In a real production app, you'd use socket rooms based on userId.
    global.io.emit("wallet:update", {
      userId,
      todayPoints,
      weeklyAttempts
    });
  } catch (error) {
    console.error("Error triggering wallet update:", error);
  }
}

async function createRewardEvent(userId, type, points, description) {
  try {
    const event = await RewardEvent.create({
      userId,
      type: type.toUpperCase(),
      points,
      description
    });

    await triggerWalletUpdate(userId);
    return event;
  } catch (error) {
    console.error("Error creating reward event:", error);
  }
}

module.exports = {
  triggerWalletUpdate,
  createRewardEvent
};
