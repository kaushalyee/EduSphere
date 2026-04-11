const RewardEvent = require("../models/RewardEvent");
const GameAttempt = require("../models/GameAttempt");

/**
 * Get unified recent activity feed (rewards + game attempts).
 * GET /api/activity/recent
 */
exports.getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    const rewards = await RewardEvent.find({ userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const games = await GameAttempt.find({ userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Transform rewards
    const formattedRewards = rewards.map((r) => {
      let type = "REWARD";
      const rawType = r.type?.toUpperCase();
      if (["QUIZ", "ASSIGNMENT", "STREAK"].includes(rawType)) {
        type = rawType;
      }

      return {
        type,
        title: r.description || r.type,
        points: r.points,
        createdAt: r.createdAt,
      };
    });

    // Transform games
    const formattedGames = games.map((g) => ({
      type: g.status === "completed" ? "GAME_WIN" : "GAME_LOSS",
      title: g.status === "completed" ? "Game Victory" : "Game Attempt",
      points: g.score || 0,
      createdAt: g.createdAt,
    }));

    // Combine, sort by date DESC, and limit to 6
    const combined = [...formattedRewards, ...formattedGames]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);

    res.json(combined);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ message: "Error fetching recent activity" });
  }
};
