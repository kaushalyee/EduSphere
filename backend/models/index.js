const UserModels = require('./User');
const Session = require('./Session');
const QuizAttempt = require('./QuizAttempt');
const AssignmentRequirement = require('./AssignmentRequirement');
const AssignmentSubmission = require('./AssignmentSubmission');
const PredictionResult = require('./PredictionResult');
const ChatConversation = require('./ChatConversation');
const ChatMessage = require('./ChatMessage');
const KuppiReco = require('./KuppiReco');
const MarketplaceListing = require('./MarketplaceListing');
const ListingReport = require('./ListingReport');
const Wallet = require('./Wallet');
const RewardTransaction = require('./RewardTransaction');
const GameAttempt = require('./GameAttempt');
const Score = require('./Score');

module.exports = {
  ...UserModels,
  Session,
  QuizAttempt,
  AssignmentRequirement,
  AssignmentSubmission,
  PredictionResult,
  ChatConversation,
  ChatMessage,
  KuppiReco,
  MarketplaceListing,
  ListingReport,
  Wallet,
  RewardTransaction,
  GameAttempt,
  Score
};
