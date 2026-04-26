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
async function getOrCreateWallet(userId, options = {}) {
  const uid = toUserObjectId(userId);
  const { session } = options;

  let walletQuery = Wallet.findOne({ userId: uid });
  if (session) walletQuery = walletQuery.session(session);

  let wallet = await walletQuery;
  if (wallet) return wallet;

  try {
    const walletData = {
      userId: uid,
      balance: 0,
      currency: "coins",
    };

    if (session) {
      const created = await Wallet.create([walletData], { session });
      return created[0];
    }

    return await Wallet.create(walletData);
  } catch (err) {
    if (err && err.code === 11000) {
      let retryQuery = Wallet.findOne({ userId: uid });
      if (session) retryQuery = retryQuery.session(session);
      wallet = await retryQuery;
      if (wallet) return wallet;
    }
    throw err;
  }
}

module.exports = {
  getOrCreateWallet,
  toUserObjectId,
};
