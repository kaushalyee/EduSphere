const User = require("../models/User");

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

exports.completeOnboarding = async (req, res) => {
  try {
    const { year, semester, weakCategories, weakTopics } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Only students can complete onboarding" });
    }

    user.year = year;
    user.semester = semester;
    user.weakCategories = weakCategories;
    user.weakTopics = weakTopics;

    await user.save();

    res.json({ message: "Onboarding completed successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Returns the user's total GP (wallet balance).
 * GET /api/users/wallet
 */
exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // 🛡️ ATOMIC RESET CHECK (Optimistic Concurrency)
    if (isNewDay(user.lastGPReset)) {
      await User.findOneAndUpdate(
        { _id: req.user.id, lastGPReset: user.lastGPReset },
        { $set: { totalGP: 0, lastGPReset: new Date() } }
      );
      // Re-fetch or adjust local user object if needed, though getWallet just returns balance
      user.totalGP = 0; 
    }

    console.log("User:", req.user.id, "GP:", user.totalGP);
    res.status(200).json({
      totalGP: user.totalGP || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Returns the current authenticated user details.
 * GET /api/users/me
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // 🕒 ENFORCE DAILY RESET ATOMICALLY (PART 2)
    if (isNewDay(user.lastGPReset)) {
      console.log(`[GP RESET] Resetting GP for user ${user._id} on profile fetch`);
      const updated = await User.findOneAndUpdate(
        { _id: req.user.id, lastGPReset: user.lastGPReset },
        { $set: { totalGP: 0, lastGPReset: new Date() } },
        { new: true }
      );
      if (updated) {
        // Sync Reward Points from Wallet if they exist
        const Wallet = require("../models/Wallet");
        const wallet = await Wallet.findOne({ userId: updated._id });
        if (wallet) {
          updated.rewardPoints = wallet.balance;
        }
        return res.status(200).json(updated);
      }
    }
    
    // Sync Reward Points from Wallet
    const Wallet = require("../models/Wallet");
    const wallet = await Wallet.findOne({ userId: user._id });
    if (wallet) {
      user.rewardPoints = wallet.balance;
      // We don't necessarily need to save it to DB every time if we just want it in the response
    }

    // DEBUG LOG (PART 6)
    console.log("User:", user._id, "GP:", user.totalGP, "RP:", user.rewardPoints);
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};