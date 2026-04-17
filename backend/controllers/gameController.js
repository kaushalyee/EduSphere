const puzzles = require("../data/puzzles");
const GameAttempt = require("../models/GameAttempt");
const GameScore = require("../models/GameScore");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const { toUserObjectId } = require("../services/walletService");
const { createRewardEvent, triggerWalletUpdate } = require("../services/eventService");
const { calculateGP } = require("../utils/gpCalculator");

const DAILY_LIMIT = 5;
const MAX_ATTEMPTS_PER_WEEK = 20; // Increased to match UI and requirements
const COST_PER_ATTEMPT = 10;

/**
 * Returns a UTC Date object representing the start of the current day (00:00:00) in Asia/Colombo.
 * Production-ready implementation using Intl API to calculate offsets accurately.
 */
function getColomboStartOfDay() {
  const now = new Date();
  
  // 1. Get current date in Colombo
  const dateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Colombo',
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(now);

  // 2. Create UTC reference at midnight
  const utcRef = new Date(`${dateStr}T00:00:00Z`);

  // 3. Find the offset between Colombo and UTC at that specific time
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
  
  // 4. Adjust UTC reference to get the actual UTC time for Colombo midnight
  return new Date(utcRef.getTime() - offset);
}

/**
 * Returns a UTC Date object representing the end of the current day in Asia/Colombo.
 */
function getColomboEndOfDay() {
  const start = getColomboStartOfDay();
  return new Date(start.getTime() + 24 * 60 * 60 * 1000);
}

/**
 * Returns the current date in "YYYY-MM-DD" format in Asia/Colombo.
 */
function getToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Colombo',
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
}

function isBasicValid(puzzle) {
  if (!puzzle || puzzle.size !== 5) return false;
  if (!Array.isArray(puzzle.pairs) || puzzle.pairs.length === 0) return false;

  return puzzle.pairs.every((pair) => {
    if (!pair?.color || !Array.isArray(pair.a) || !Array.isArray(pair.b)) {
      return false;
    }

    const points = [pair.a, pair.b];
    return points.every(
      ([row, col]) =>
        Number.isInteger(row) &&
        Number.isInteger(col) &&
        row >= 0 &&
        col >= 0 &&
        row < puzzle.size &&
        col < puzzle.size
    );
  });
}

// Removed old unlockGame and completeGame as per requirements


exports.getDailyStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getToday();

    const count = await GameAttempt.countDocuments({
      userId,
      date: today,
    });

    return res.json({
      used: count,
      remaining: Math.max(0, DAILY_LIMIT - count),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.resetDailyAttempts = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getToday();

    await GameAttempt.deleteMany({
      userId,
      date: today,
    });

    return res.json({
      message: "Today's attempts reset",
      used: 0,
      remaining: DAILY_LIMIT,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Helper to check if it's a new day for GP reset (Asia/Colombo)
 */
function isNewDay(lastReset) {
  if (!lastReset) return true;
  const today = getToday();
  const last = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(lastReset));

  return today !== last;
}

/**
 * Submits a game score, calculates GP, and saves to database.
 * POST /api/game/submit
 */
exports.submitScore = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    const userId = req.user.id;
    const { attemptId, gridSize } = req.body;

    // 1. VALIDATE ATTEMPT
    if (!attemptId || !gridSize) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: attemptId and gridSize are required.",
      });
    }

    const attempt = await GameAttempt.findOne({
      _id: attemptId,
      userId,
      status: "started"
    });

    if (!attempt) {
      return res.status(400).json({
        success: false,
        message: "Invalid or already completed attempt."
      });
    }

    // 2. PREVENT DUPLICATE SUBMISSION
    const existingScore = await GameScore.findOne({ attemptId });
    if (existingScore) {
      return res.status(400).json({
        success: false,
        message: "Score already submitted for this attempt."
      });
    }

    // 3. CALCULATE ELAPSED TIME ON BACKEND (SECURE)
    const now = new Date();
    const startTime = new Date(attempt.createdAt);
    const elapsedTime = Math.max(1, Math.floor((now - startTime) / 1000));

    // Calculate GP using utility function
    const gp = calculateGP(elapsedTime, gridSize);

    // 4. ATOMIC USER GP UPDATE
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetNeeded = isNewDay(user.lastGPReset);
    let finalUser;

    if (resetNeeded) {
      finalUser = await User.findOneAndUpdate(
        { _id: userId }, 
        { 
          $set: { 
            totalGP: gp, 
            lastGPReset: new Date() 
          } 
        },
        { new: true }
      );
    } else {
      finalUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { totalGP: gp } },
        { new: true }
      );
    }

    // 5. SAVE SCORE RECORD
    const newScore = new GameScore({
      userId,
      attemptId,
      gp,
      time: elapsedTime,
      gridSize,
    });
    await newScore.save();

    // 6. MARK ATTEMPT AS COMPLETED
    await GameAttempt.findByIdAndUpdate(attemptId, {
      status: "completed",
      time: elapsedTime,
      score: gp // Keep for compatibility but prioritize GameScore.gp
    });

    // 🎯 CREATE REWARD EVENT FOR ACTIVITY FEED
    await createRewardEvent(userId, "GAME_WIN", gp, `Completed ${gridSize} puzzle in ${elapsedTime}s`);

    // 🎯 TRIGGER REAL-TIME LEADERBOARD UPDATE
    if (global.io) {
      global.io.emit("leaderboard:update");
    }

    return res.status(201).json({
      success: true,
      gp,
      totalGP: finalUser.totalGP
    });
  } catch (error) {
    console.error("Error submitting score:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while submitting score.",
    });
  }
};

/**
 * Returns top players sorted by their Daily GP descending.
 * Aggregates performance across the current day.
 * GET /api/game/leaderboard
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const startOfDay = getColomboStartOfDay();
    const endOfDay = getColomboEndOfDay();

    const leaderboard = await GameScore.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: startOfDay, 
            $lt: endOfDay 
          }
        }
      },
      {
        $group: {
          _id: "$userId",
          totalGP: { $sum: "$gp" },
          totalTime: { $sum: "$time" }
        }
      },
      { $sort: { totalGP: -1, totalTime: 1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 1,
          totalGP: 1,
          totalTime: 1,
          name: "$userDetails.name",
          studentID: "$userDetails.studentID",
          avatar: "$userDetails.avatar"
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching leaderboard.",
    });
  }
};
/**
 * Count number of game attempts in the last 7 days for the logged-in user.
 * GET /api/game/weekly-attempts
 */
exports.getWeeklyAttempts = async (req, res) => {
  try {
    const userId = req.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const count = await GameAttempt.countDocuments({
      userId,
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      currentAttempts: count,
      maxAttempts: 20, // Assuming 20 is the max attempts for the week as per UI
    });
  } catch (error) {
    console.error("Error fetching weekly attempts:", error);
    res.status(500).json({ message: "Error fetching weekly attempts" });
  }
};
