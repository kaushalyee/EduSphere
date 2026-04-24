const mongoose = require("mongoose");
const User = require("../models/User");
const companionsConfig = require("../config/companions");

// GET /api/companions
exports.getCompanions = function (req, res) {
  try {
    res.status(200).json(companionsConfig);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/companions/buy
exports.buyCompanion = async function (req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { companionId } = req.body;
    const userId = req.user._id;

    const companion = companionsConfig.find((c) => c.id === companionId);
    if (!companion) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Companion not found" });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    const owned = user.companionsOwned || [];
    if (!owned.includes('robot')) {
      owned.push('robot');
    }
    user.companionsOwned = owned;

    if (user.companionsOwned.includes(companionId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Companion already owned" });
    }

    const Wallet = require("../models/Wallet");
    const wallet = await Wallet.findOne({ userId: user._id }).session(session);
    
    // Sync user rewardPoints from wallet balance
    const currentBalance = wallet ? wallet.balance : 0;
    user.rewardPoints = currentBalance;

    if (currentBalance < companion.price) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Not enough reward points" });
    }

    // Process purchase
    if (wallet) {
      wallet.balance -= companion.price;
      await wallet.save({ session });
    }
    
    user.rewardPoints = wallet ? wallet.balance : 0;
    user.companionsOwned.push(companionId);

    // NORMALIZE WEAK TOPICS (SUPPORTS STRINGS AND OBJECTS)
    if (user.weakTopics && Array.isArray(user.weakTopics)) {
      user.weakTopics = user.weakTopics.map(function (t) {
        return typeof t === "string" ? { topic: t, weight: 0 } : t;
      });
    }

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Companion purchased successfully",
      rewardPoints: user.rewardPoints,
      companionsOwned: user.companionsOwned
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error("Purchase Error:", error);
    res.status(400).json({ 
      message: error.name === 'ValidationError' 
        ? "Failed to update user data" 
        : (error.message || "Failed to purchase companion")
    });
  }
};

// PUT /api/companions/equip
exports.equipCompanion = async function (req, res) {
  try {
    // STEP 4 — VALIDATE INPUT
    if (!req.body.companionId) {
      return res.status(400).json({
        message: "Invalid companion ID"
      });
    }

    const { companionId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    // STEP 2 — VALIDATE USER DATA
    if (!user) throw new Error("User not found");

    if (!user.rewardPoints) {
      user.rewardPoints = 0;
    }

    // STEP 3 — PREVENT DOUBLE SELECTION CRASH
    // We check if an active companion is already set (and it's not the default 'robot')
    // to prevent double selection issues.
    if (user.activeCompanion && user.activeCompanion !== 'robot' && user.activeCompanion === companionId) {
      return res.status(400).json({
        message: "Companion already selected"
      });
    }

    // Default ownership of robot
    const owned = user.companionsOwned || [];
    if (!owned.includes('robot')) {
      owned.push('robot');
      user.companionsOwned = owned;
    }

    if (!user.companionsOwned.includes(companionId)) {
      return res.status(400).json({ message: "You do not own this companion" });
    }

    user.activeCompanion = companionId;

    // NORMALIZE WEAK TOPICS (SUPPORTS STRINGS AND OBJECTS)
    if (user.weakTopics && Array.isArray(user.weakTopics)) {
      user.weakTopics = user.weakTopics.map(function (t) {
        return typeof t === "string" ? { topic: t, weight: 0 } : t;
      });
    }

    await user.save();

    res.status(200).json({
      message: "Companion equipped successfully",
      activeCompanion: user.activeCompanion
    });
  } catch (err) {
    // STEP 1 — ADD SAFE BACKEND HANDLING
    console.error("Equip Error:", err);
    return res.status(400).json({
      message: err.name === 'ValidationError'
        ? "Failed to update user data"
        : (err.message || "Failed to select companion")
    });
  }
};
