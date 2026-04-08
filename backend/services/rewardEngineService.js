const QuizResult = require("../models/QuizResult");
const AttemptCollection = require("../models/AttemptCollection");
const SpendingTracking = require("../models/SpendingTracking");
const { toUserObjectId } = require("./walletService");

const BASE_COST = 50;
const MIN_COST = 30;
const MAX_COST = 80;
const BASE_DAILY_LIMIT = 5;

function getTodayDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getPerformanceMultiplier(lastQuizScore) {
  if (lastQuizScore >= 90) return 1.1;
  if (lastQuizScore >= 75) return 1.0;
  if (lastQuizScore >= 50) return 0.9;
  return 0.8;
}

function getUsageMultiplier(attemptsUsedToday) {
  if (attemptsUsedToday >= 5) {
    return { multiplier: null, blocked: true };
  }
  if (attemptsUsedToday >= 4) return { multiplier: 1.2, blocked: false };
  if (attemptsUsedToday >= 3) return { multiplier: 1.1, blocked: false };
  return { multiplier: 1.0, blocked: false };
}

function getMaxAttempts(lastQuizScore) {
  if (lastQuizScore >= 90) return 5;
  if (lastQuizScore >= 75) return 4;
  if (lastQuizScore >= 50) return 3;
  return 3;
}

function clampCost(value) {
  return Math.max(MIN_COST, Math.min(MAX_COST, value));
}

function calcAvailableAttempts(maxAttempts, attemptsUsedToday) {
  return Math.max(0, maxAttempts - attemptsUsedToday);
}

async function resolveLastQuizScore(user) {
  const userId = toUserObjectId(user._id);
  if (Number.isFinite(user.lastQuizScore) && user.lastQuizScore > 0) {
    return user.lastQuizScore;
  }

  const latestQuiz = await QuizResult.findOne({ studentId: userId })
    .sort({ createdAt: -1 })
    .select("percentage");

  return Number(latestQuiz?.percentage ?? 0);
}

async function getCompanionSpendingLast7Days(userId) {
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const result = await SpendingTracking.aggregate([
    {
      $match: {
        userId: toUserObjectId(userId),
        type: "companion",
        createdAt: { $gte: since },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return Number(result[0]?.total ?? 0);
}

async function getTotalAttemptsLast7Days(userId) {
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const result = await AttemptCollection.aggregate([
    {
      $match: {
        userId: toUserObjectId(userId),
        createdAt: { $gte: since },
      },
    },
    { $group: { _id: null, total: { $sum: "$attemptsCount" } } },
  ]);

  return Number(result[0]?.total ?? 0);
}

function normalizeDailyAttemptState(user) {
  const todayKey = getTodayDateKey();
  const lastAttemptKey = user.lastAttemptDate ? getTodayDateKey(user.lastAttemptDate) : null;

  if (!lastAttemptKey || lastAttemptKey !== todayKey) {
    user.attemptsUsedToday = 0;
    user.lastAttemptDate = new Date();
    return { reset: true, todayKey };
  }

  return { reset: false, todayKey };
}

async function buildAttemptConfig({ user, walletBalance }) {
  const lastQuizScore = await resolveLastQuizScore(user);
  const maxAttemptsPerDay = getMaxAttempts(lastQuizScore);
  const performanceMultiplier = getPerformanceMultiplier(lastQuizScore);

  const { multiplier: usageMultiplier, blocked: usageBlocked } = getUsageMultiplier(
    user.attemptsUsedToday || 0
  );

  const companionSpendingLast7Days = await getCompanionSpendingLast7Days(user._id);
  const totalAttemptsLast7Days = await getTotalAttemptsLast7Days(user._id);

  let attemptCost = MAX_COST;
  if (!usageBlocked) {
    const spendingDiscount = companionSpendingLast7Days > 100 ? 0.9 : 1.0;
    const rawCost = BASE_COST * performanceMultiplier * usageMultiplier * spendingDiscount;
    attemptCost = clampCost(Math.round(rawCost));
  }

  const availableAttempts = usageBlocked
    ? 0
    : calcAvailableAttempts(maxAttemptsPerDay, user.attemptsUsedToday || 0);

  return {
    attemptCost,
    maxAttemptsPerDay,
    availableAttempts,
    usageMultiplier: usageMultiplier ?? 1.0,
    performanceMultiplier,
    walletBalance,
    lastQuizPerformance: lastQuizScore,
    attemptsUsedToday: user.attemptsUsedToday || 0,
    totalAttemptsLast7Days,
    companionSpendingLast7Days,
    usageBlocked,
    baseDailyLimit: BASE_DAILY_LIMIT,
  };
}

module.exports = {
  BASE_COST,
  MIN_COST,
  MAX_COST,
  BASE_DAILY_LIMIT,
  getTodayDateKey,
  normalizeDailyAttemptState,
  buildAttemptConfig,
};
