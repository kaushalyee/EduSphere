/**
 * Migrate legacy wallet documents to the canonical schema (userId, currency, timestamps)
 * and remove duplicate wallets per user (merge balances, re-point RewardTransactions).
 *
 * Run: node backend/scripts/fixWalletSchema.js
 * Requires MONGO_URI in backend/.env
 */
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Wallet = require("../models/Wallet");
const RewardTransaction = require("../models/RewardTransaction");

function toObjectId(val) {
  if (val instanceof mongoose.Types.ObjectId) return val;
  const s = String(val).trim();
  if (!mongoose.Types.ObjectId.isValid(s)) return null;
  return new mongoose.Types.ObjectId(s);
}

async function migrateLegacyFields(coll) {
  const filter = {
    $or: [
      { student_id: { $exists: true } },
      { last_updated: { $exists: true } },
    ],
  };

  let migrated = 0;
  const cursor = coll.find(filter);

  for await (const doc of cursor) {
    const rawUserId = doc.userId != null ? doc.userId : doc.student_id;
    const userId = toObjectId(rawUserId);
    if (!userId) {
      console.warn(
        `[fixWalletSchema] Skip legacy wallet ${doc._id}: cannot resolve userId`
      );
      continue;
    }

    const set = {
      userId,
      currency: doc.currency || "coins",
      balance:
        typeof doc.balance === "number" && !Number.isNaN(doc.balance)
          ? doc.balance
          : 0,
    };

    if (doc.last_updated && !doc.createdAt) {
      set.createdAt = doc.last_updated;
      set.updatedAt = doc.last_updated;
    }

    await coll.updateOne(
      { _id: doc._id },
      {
        $set: set,
        $unset: { student_id: "", last_updated: "" },
      }
    );
    migrated += 1;
  }

  return migrated;
}

async function normalizeStringUserIds(coll) {
  const docs = await coll.find({ userId: { $type: "string" } }).toArray();
  let fixed = 0;

  for (const doc of docs) {
    const userId = toObjectId(doc.userId);
    if (!userId) {
      console.warn(
        `[fixWalletSchema] Skip string userId wallet ${doc._id}: invalid value`
      );
      continue;
    }
    await coll.updateOne({ _id: doc._id }, { $set: { userId } });
    fixed += 1;
  }

  return fixed;
}

async function ensureDefaults(coll) {
  const missingCurrency = await coll
    .find({
      $or: [
        { currency: { $exists: false } },
        { currency: null },
        { currency: "" },
      ],
    })
    .toArray();

  let n = 0;
  for (const doc of missingCurrency) {
    await coll.updateOne(
      { _id: doc._id },
      { $set: { currency: "coins" } }
    );
    n += 1;
  }
  return n;
}

/**
 * For each userId with multiple wallets: keep canonical winner (highest balance,
 * then latest updatedAt), set winner balance to sum of all, move transactions, delete others.
 */
async function dedupeWallets(coll) {
  const dupGroups = await coll
    .aggregate([
      { $match: { userId: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$userId",
          ids: { $push: "$_id" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();

  let duplicatesDeleted = 0;

  for (const g of dupGroups) {
    const wallets = await Wallet.find({ _id: { $in: g.ids } }).lean();
    if (wallets.length < 2) continue;

    wallets.sort((a, b) => {
      const ba = Number(a.balance) || 0;
      const bb = Number(b.balance) || 0;
      if (bb !== ba) return bb - ba;
      const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return tb - ta;
    });

    const winner = wallets[0];
    const losers = wallets.slice(1);
    const totalBalance = wallets.reduce(
      (s, w) => s + (Number(w.balance) || 0),
      0
    );

    await Wallet.updateOne(
      { _id: winner._id },
      { $set: { balance: totalBalance, currency: winner.currency || "coins" } }
    );

    for (const l of losers) {
      await RewardTransaction.updateMany(
        { walletId: l._id },
        { $set: { walletId: winner._id } }
      );
      await coll.deleteOne({ _id: l._id });
      duplicatesDeleted += 1;
    }
  }

  return duplicatesDeleted;
}

async function run() {
  await connectDB();
  const coll = Wallet.collection;

  console.log("[fixWalletSchema] Starting wallet migration…");

  const legacyMigrated = await migrateLegacyFields(coll);
  console.log(`[fixWalletSchema] Legacy fields migrated (student_id/last_updated): ${legacyMigrated}`);

  const stringIdsFixed = await normalizeStringUserIds(coll);
  console.log(`[fixWalletSchema] String userId fields normalized to ObjectId: ${stringIdsFixed}`);

  const defaultsApplied = await ensureDefaults(coll);
  console.log(`[fixWalletSchema] Default currency applied where missing: ${defaultsApplied}`);

  const duplicatesDeleted = await dedupeWallets(coll);
  console.log(`[fixWalletSchema] Duplicate wallet documents removed: ${duplicatesDeleted}`);

  console.log("[fixWalletSchema] Done.");
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error("[fixWalletSchema] Fatal:", err);
  process.exit(1);
});
