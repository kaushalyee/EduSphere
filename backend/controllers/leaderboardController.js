const User = require("../models/User");
const GameScore = require("../models/GameScore");
const GameAttempt = require("../models/GameAttempt");
const Score = require("../models/Score");

/**
 * Returns a UTC Date object representing the start of the current day (00:00:00) in Asia/Colombo.
 */
function getColomboStartOfDay() {
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Colombo',
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(now);
  const utcRef = new Date(`${dateStr}T00:00:00Z`);

  const getOffset = (d) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Colombo',
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    }).formatToParts(d);
    const p = {}; parts.forEach(pt => p[pt.type] = pt.value);
    const localAsUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    return localAsUTC - d.getTime();
  };

  const offset = getOffset(utcRef);
  return new Date(utcRef.getTime() - offset);
}

exports.getTop3Leaderboard = async (req, res) => {
  try {
    const startOfDay = getColomboStartOfDay();
    console.log("[Leaderboard] Fetching top 3 players since:", startOfDay.toISOString());

    // 1. Filter: Role student, GP > 0, and last updated/reset today
    const topPlayers = await User.find({ 
      role: "student",
      totalGP: { $gt: 0 },
      lastGPReset: { $gte: startOfDay }
    })
      .sort({ totalGP: -1 })
      .limit(3)
      .select("name email totalGP activeCompanion");

    console.log("[Leaderboard] Raw users fetched:", topPlayers.map(p => ({
      email: p.email,
      gp: p.totalGP,
      lastReset: p.lastGPReset
    })));

    const formattedPlayers = topPlayers.map((player) => ({
      name: player.name,
      score: player.totalGP,
      activeCompanion: player.activeCompanion || "robot",
    }));

    console.log("[Leaderboard] Formatted Top3 Data:", formattedPlayers);
    res.status(200).json({ topPlayers: formattedPlayers });
  } catch (error) {
    console.error("[Leaderboard] Fetch Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Resets the leaderboard by zeroing out totalGP for all users and deleting all scores/attempts.
 */
exports.resetLeaderboard = async (req, res) => {
  try {
    console.log("[Leaderboard] Resetting all scores...");

    // 1. Reset all users' totalGP and gamePoints (if applicable)
    // We also update lastGPReset to now to mark the start of the new period
    await User.updateMany(
      { role: "student" },
      { 
        $set: { 
          totalGP: 0, 
          lastGPReset: new Date() 
        } 
      }
    );

    // 2. Clear score and attempt collections to ensure no leftover data
    await GameScore.deleteMany({});
    await GameAttempt.deleteMany({});
    await Score.deleteMany({});

    console.log("[Leaderboard] Reset complete.");
    res.status(200).json({ 
      success: true, 
      message: "Leaderboard and game history have been reset successfully." 
    });
  } catch (error) {
    console.error("[Leaderboard] Reset Error:", error);
    res.status(500).json({ message: "Reset failed", error: error.message });
  }
};
