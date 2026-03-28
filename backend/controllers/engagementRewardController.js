const Wallet = require("../models/Wallet");
const { convertQuizResultToRP } = require("../services/quizRPConversionService");

const getMyWalletBalance = async (req, res) => {
  try {
    const userId = req.user?._id;
    const wallet = await Wallet.findOne({ userId });

    return res.status(200).json({
      success: true,
      data: {
        studentId: userId,
        balance: wallet ? wallet.balance : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wallet balance",
      error: error.message,
    });
  }
};

const convertQuizToRP = async (req, res) => {
  try {
    const { quizResultId } = req.params;
    const result = await convertQuizResultToRP(quizResultId);

    if (result.alreadyProcessed) {
      return res
        .status(409)
        .json({ success: false, message: "Already processed", data: result });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz result converted to RP",
      data: result,
    });
  } catch (error) {
    if (error?.message && error.message.includes("not found")) {
      return res.status(404).json({ success: false, message: error.message });
    }

    console.error("[convertQuizToRP]", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getMyWalletBalance,
  convertQuizToRP,
};
