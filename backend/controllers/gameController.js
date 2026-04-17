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

function getToday() {
  return new Date().toISOString().split("T")[0];
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

exports.unlockGame = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const uid = toUserObjectId(userId);
    const today = getToday();

    // 1. Weekly Attempt Limit
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const count = await GameAttempt.countDocuments({
      userId: uid,
      createdAt: { $gte: sevenDaysAgo },
    });

    if (count >= MAX_ATTEMPTS_PER_WEEK) {
      return res.status(403).json({
        message: "Weekly attempt limit reached. Earn more rewards to continue next week.",
      });
    }

    // 2. Point Check
    const wallet = await Wallet.findOne({ userId: uid });
    if (!wallet || wallet.balance < COST_PER_ATTEMPT) {
      return res.status(400).json({ message: "Not enough reward points to play" });
    }

    const todayAttempts = await GameAttempt.find({ userId: uid, date: today });
    if (todayAttempts.length >= DAILY_LIMIT) {
      return res.status(400).json({
        message: `Daily limit reached (${DAILY_LIMIT} games)`,
      });
    }

    const activeAttempt = await GameAttempt.findOne({
      userId: uid,
      status: "started",
    });

    if (activeAttempt) {
      await GameAttempt.findByIdAndUpdate(activeAttempt._id, {
        status: "abandoned",
      });
    }

    const attemptNumber = todayAttempts.length + 1;
    const selectedPuzzle = puzzles[String(attemptNumber)];
    if (!selectedPuzzle || !isBasicValid(selectedPuzzle)) {
      return res.status(500).json({ message: "No valid puzzles configured" });
    }

    // 3. Deduct Points (Atomic Update)
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId: uid, balance: { $gte: COST_PER_ATTEMPT } },
      { $inc: { balance: -COST_PER_ATTEMPT } },
      { new: true }
    );

    if (!updatedWallet) {
      return res.status(400).json({ message: "Not enough reward points to play" });
    }

    // 🎯 CREATE REWARD EVENT FOR ACTIVITY FEED (COST)
    await createRewardEvent(uid, "GAME_START", -COST_PER_ATTEMPT, "Game Entry Fee");

    console.log("Selected Puzzle for attempt:", attemptNumber);

    const attempt = await GameAttempt.create({
      userId: uid,
      puzzleId: String(attemptNumber),
      date: today,
      status: "started",
    });

    // Real-time update emit
    await triggerWalletUpdate(uid);

    return res.json({ attempt: attemptNumber });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.completeGame = async (req, res) => {
  try {
    const { attemptId, time, moves } = req.body;
    const parsedTime = Number(time) || 0;
    const score = Math.max(0, 1000 - parsedTime * 2);

    const updated = await GameAttempt.findOneAndUpdate(
      { _id: attemptId, userId: req.user.id },
      {
        status: "completed",
        time: parsedTime,
        score,
        moves: Number(moves) || 0,
      },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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
  const now = new Date();

  // 🇱🇰 SRI LANKA TIMEZONE ENFORCEMENT
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);

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
    const userId = req.user.id; // GUARANTEED AUTHENTICATED USER
    console.log("User:", req.user.id);
    const { time, gridSize } = req.body;

    // Validate inputs
    if (time === undefined || !gridSize) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: time and gridSize are required.",
      });
    }

    // 🧠 GET USER FOR SPECIFIC GP UPDATE
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Calculate GP using utility function
    const gp = calculateGP(time, gridSize);

    // 🧠 ATOMIC UPDATE (PART 2 - PREVENT RACE CONDITIONS)
    const resetNeeded = isNewDay(user.lastGPReset);
    let finalUser;

    if (resetNeeded) {
      console.log(`[GP RESET] Atomic reset for user ${userId}`);
      finalUser = await User.findOneAndUpdate(
        { _id: userId, lastGPReset: user.lastGPReset }, // Filter ensures we only reset once
        { 
          $set: { 
            totalGP: gp, 
            lastGPReset: new Date() 
          } 
        },
        { returnDocument: 'after' }
      );

      // If update failed (null), someone else already reset it
      if (!finalUser) {
        finalUser = await User.findByIdAndUpdate(
          userId,
          { $inc: { totalGP: gp } },
          { returnDocument: 'after' }
        );
      }
    } else {
      // Normal increment
      finalUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { totalGP: gp } },
        { returnDocument: 'after' }
      );
    }

    // Save actual score record (stats)
    const newScore = new GameScore({
      userId,
      gp,
      time,
      gridSize,
    });
    await newScore.save();

    // 🎯 CREATE REWARD EVENT FOR ACTIVITY FEED
    await createRewardEvent(userId, "GAME_WIN", gp, `Completed ${gridSize} puzzle in ${time}s`);

    console.log("GP Earned:", gp);
    console.log("User:", userId, "GP Earned:", gp, "Total Daily GP:", finalUser.totalGP);

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
    const leaderboard = await User.find({ 
      totalGP: { $gt: 0 },
      role: 'student'
    })
    .select("name email totalGP studentID")
    .sort({ totalGP: -1 })
    .limit(10);

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
