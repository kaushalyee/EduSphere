const puzzles = require("../data/puzzles");
const GameAttempt = require("../models/GameAttempt");
const GameScore = require("../models/GameScore");
const User = require("../models/User");
const { calculateGP } = require("../utils/gpCalculator");

const DAILY_LIMIT = 5;

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
    const userId = req.user.id;
    const today = getToday();

    const todayAttempts = await GameAttempt.find({ userId, date: today });

    if (todayAttempts.length >= DAILY_LIMIT) {
      return res.status(400).json({
        message: `Daily limit reached (${DAILY_LIMIT} games)`,
      });
    }

    const activeAttempt = await GameAttempt.findOne({
      userId,
      status: "started",
    });

    if (activeAttempt) {
      await GameAttempt.findByIdAndUpdate(activeAttempt._id, {
        status: "abandoned",
      });
    }

    const attemptsRemaining = DAILY_LIMIT - todayAttempts.length;
    if (attemptsRemaining <= 0) {
      return res.status(400).json({ message: "No attempts left" });
    }

    const attemptNumber = todayAttempts.length + 1;
    const selectedPuzzle = puzzles[String(attemptNumber)];
    if (!selectedPuzzle || !isBasicValid(selectedPuzzle)) {
      return res.status(500).json({ message: "No valid puzzles configured" });
    }

    console.log("Selected Puzzle for attempt:", attemptNumber);

    const attempt = await GameAttempt.create({
      userId,
      puzzleId: String(attemptNumber),
      date: today,
      status: "started",
    });

    return res.json({ attempt: attemptNumber });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.completeGame = async (req, res) => {
  try {
    const { attemptId, time } = req.body;
    const parsedTime = Number(time) || 0;
    const score = Math.max(0, 1000 - parsedTime * 2);

    const updated = await GameAttempt.findOneAndUpdate(
      { _id: attemptId, userId: req.user.id },
      {
        status: "completed",
        time: parsedTime,
        score,
      },
      { new: true }
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
 * Submits a game score, calculates GP, and saves to database.
 * POST /api/game/submit
 */
exports.submitScore = async (req, res) => {
  try {
    const { userId, time, gridSize } = req.body;

    // Validate inputs
    if (!userId || time === undefined || !gridSize) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, time, and gridSize are required.",
      });
    }

    // Calculate GP using utility function
    const gp = calculateGP(time, gridSize);

    // Save record to database
    const newScore = new GameScore({
      userId,
      gp,
      time,
      gridSize,
    });

    await newScore.save();

    // Update user's total GP
    await User.findByIdAndUpdate(userId, {
      $inc: { totalGP: gp },
    });

    return res.status(201).json({
      success: true,
      gp,
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
 * Returns top players sorted by GP descending.
 * GET /api/leaderboard
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await GameScore.find()
      .populate("userId", "name email") // Populate user details
      .sort({ gp: -1 })
      .limit(10);

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching leaderboard.",
    });
  }
};

