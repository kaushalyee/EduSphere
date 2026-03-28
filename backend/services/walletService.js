const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");

/**
 * Normalize any user id shape to ObjectId for consistent queries.
 */
function toUserObjectId(userId) {
  if (userId instanceof mongoose.Types.ObjectId) return userId;
  return new mongoose.Types.ObjectId(userId);
}

/**
 * Find existing wallet or create one. Handles duplicate-key races safely.
 */
async function getOrCreateWallet(userId) {
  const uid = toUserObjectId(userId);

  let wallet = await Wallet.findOne({ userId: uid });
  if (wallet) return wallet;

  try {
    return await Wallet.create({
      userId: uid,
      balance: 0,
      currency: "coins",
    });
  } catch (err) {
    if (err && err.code === 11000) {
      wallet = await Wallet.findOne({ userId: uid });
      if (wallet) return wallet;
    }
    throw err;
  }
}

module.exports = {
  getOrCreateWallet,
  toUserObjectId,
};
