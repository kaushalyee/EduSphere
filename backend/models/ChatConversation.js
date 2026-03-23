const mongoose = require("mongoose");

const chatConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      trim: true,
      default: "",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

chatConversationSchema.index({ participants: 1 });
chatConversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model("ChatConversation", chatConversationSchema);
