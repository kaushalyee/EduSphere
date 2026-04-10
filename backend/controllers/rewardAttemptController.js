const mongoose = require("mongoose");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const AttemptCollection = require("../models/AttemptCollection");
const RewardTransaction = require("../models/RewardTransaction");
const GameAttempt = require("../models/GameAttempt");
const {
  buildAttemptConfig,
  getTodayDateKey,
  normalizeDailyAttemptState,
} = require("../services/rewardEngineService");
const { toUserObjectId } = require("../services/walletService");

const getAttemptConfig = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const [user, wallet] = await Promise.all([
      User.findById(userId),
      Wallet.findOne({ userId: toUserObjectId(userId) }),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetState = normalizeDailyAttemptState(user);
    if (resetState.reset) {
      await user.save();
    }

    const walletBalance = Number(wallet?.balance ?? 0);
    const config = await buildAttemptConfig({ user, walletBalance });

    return res.status(200).json({
      attemptCost: config.attemptCost,
      maxAttempts: config.maxAttemptsPerDay,
      attemptsUsedToday: config.attemptsUsedToday,
      availableAttempts: config.availableAttempts,
      walletBalance: config.walletBalance,
      usageMultiplier: config.usageMultiplier,
      performanceMultiplier: config.performanceMultiplier,
      lastQuizPerformance: config.lastQuizPerformance,
      totalAttemptsLast7Days: config.totalAttemptsLast7Days,
      companionSpendingLast7Days: config.companionSpendingLast7Days,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to load attempt config", error: error.message });
  }
};

const unlockAttempt = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    let responsePayload = null;
    await session.withTransaction(async () => {
      const uid = toUserObjectId(userId);
      const [user, wallet] = await Promise.all([
        User.findById(uid).session(session),
        Wallet.findOne({ userId: uid }).session(session),
      ]);

      if (!user) throw new Error("User not found");
      if (!wallet) throw new Error("Wallet not found");

      const resetState = normalizeDailyAttemptState(user);
      if (resetState.reset) {
        await user.save({ session });
      }

      const config = await buildAttemptConfig({
        user,
        walletBalance: Number(wallet.balance ?? 0),
      });

      if (config.availableAttempts <= 0) {
        throw new Error("No attempts left for today");
      }

      if (wallet.balance < config.attemptCost) {
        throw new Error("Insufficient wallet balance");
      }

      wallet.balance -= config.attemptCost;
      user.attemptsUsedToday += 1;
      user.lastAttemptDate = new Date();

      await Promise.all([wallet.save({ session }), user.save({ session })]);

      await RewardTransaction.create(
        [
          {
            walletId: wallet._id,
            amount: config.attemptCost,
            type: "spent",
            description: "Reward attempt unlock",
          },
        ],
        { session }
      );

      await AttemptCollection.findOneAndUpdate(
        { userId: uid, date: getTodayDateKey() },
        { $inc: { attemptsCount: 1 } },
        { upsert: true, session, new: true, setDefaultsOnInsert: true }
      );

      const levelId = Math.floor(Math.random() * 5) + 1;
      const gameAttempt = await GameAttempt.create(
        [
          {
            userId: user._id,
            puzzleId: String(levelId),
            date: getTodayDateKey(),
            status: "started",
          },
        ],
        { session }
      );

      responsePayload = {
        success: true,
        remainingBalance: wallet.balance,
        attemptsLeft: Math.max(0, config.maxAttemptsPerDay - user.attemptsUsedToday),
        levelId,
        attemptId: gameAttempt[0]._id,
      };
    });

    return res.status(200).json(responsePayload);
  } catch (error) {
    const message = error.message || "Failed to unlock attempt";
    const statusCode =
      message === "No attempts left for today" || message === "Insufficient wallet balance"
        ? 400
        : message === "User not found" || message === "Wallet not found"
        ? 404
        : 500;
    return res.status(statusCode).json({ success: false, message });
  } finally {
    await session.endSession();
  }
};

module.exports = {
  getAttemptConfig,
  unlockAttempt,
};
