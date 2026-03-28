const QuizResult = require("../models/QuizResult");
const Wallet = require("../models/Wallet");
const RewardTransaction = require("../models/RewardTransaction");

const calculateRPFromPercentage = (percentage) => {
  if (percentage >= 90) return 100;
  if (percentage >= 75) return 80;
  if (percentage >= 50) return 40;
  return 20;
};

const convertQuizResultToRP = async (quizResultId) => {
  const quizResult = await QuizResult.findById(quizResultId);
  if (!quizResult) {
    throw new Error(`QuizResult not found: ${quizResultId}`);
  }

  const existingWallet = await Wallet.findOne({ userId: quizResult.studentId });
  const wallet =
    existingWallet ||
    (await Wallet.create({
      userId: quizResult.studentId,
      balance: 0,
    }));

  // Duplicate protection: never create more than one transaction for same quiz result.
  const existingTransaction = await RewardTransaction.findOne({
    walletId: wallet._id,
    description: `quiz:${quizResult._id}`,
  });

  if (existingTransaction) {
    return {
      percentage: quizResult.percentage,
      rpEarned: existingTransaction.amount,
      walletBalance: wallet.balance,
      alreadyProcessed: true,
      transactionId: existingTransaction._id.toString(),
    };
  }

  const rp = calculateRPFromPercentage(Number(quizResult.percentage || 0));

  const updatedWallet = await Wallet.findByIdAndUpdate(
    wallet._id,
    { $inc: { balance: rp } },
    { new: true }
  );

  const transaction = await RewardTransaction.create({
    walletId: wallet._id,
    amount: rp,
    type: "earned",
    description: `quiz:${quizResult._id}`,
  });

  return {
    percentage: quizResult.percentage,
    rpEarned: rp,
    walletBalance: updatedWallet ? updatedWallet.balance : wallet.balance + rp,
    alreadyProcessed: false,
    transactionId: transaction._id.toString(),
  };
};

module.exports = {
  convertQuizResultToRP,
};
