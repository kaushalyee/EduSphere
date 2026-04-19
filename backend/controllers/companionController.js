const mongoose = require("mongoose");
const User = require("../models/User");
const companionsConfig = require("../config/companions");

// GET /api/companions
exports.getCompanions = (req, res) => {
  try {
    res.status(200).json(companionsConfig);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/companions/buy
exports.buyCompanion = async (req, res) => {
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
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Companion purchased successfully",
      rewardPoints: user.rewardPoints,
      companionsOwned: user.companionsOwned
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/companions/equip
exports.equipCompanion = async (req, res) => {
  try {
    const { companionId } = req.body;
    const userId = req.user._id;

    if (!companionId) {
      return res.status(400).json({ message: "Companion ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
    await user.save();

    res.status(200).json({
      message: "Companion equipped successfully",
      activeCompanion: user.activeCompanion
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
