const ChatConversation = require('../models/ChatConversation');
const ChatMessage = require('../models/ChatMessage');
const Session = require('../models/Session');
const { getResponse, generateConversationTitle, extractAcademicTopic } = require('../ai/chatEngine');

const getRecommendedSessions = async (category) => {
  try {
    console.log('Searching sessions for category:', category);
    const sessions = await Session.find({
      status: 'upcoming',
      category: category  // exact match
    })
    .populate('tutorId', 'name')
    .sort({ date: 1 })
    .limit(3);
    
    console.log('Found sessions:', sessions.length);
    return sessions;
  } catch (err) {
    console.error('Error fetching recommended sessions:', err);
    return [];
  }
};

// GET all conversations for the logged in user
exports.getConversations = async (req, res) => {
  try {
    const conversations = await ChatConversation.find({
      participants: req.user._id
    }).sort({ lastMessageAt: -1 });

    const data = await Promise.all(conversations.map(async (conv) => {
      const lastMessage = await ChatMessage.findOne({ conversationId: conv._id })
        .sort({ createdAt: -1 });
      return {
        ...conv.toObject(),
        lastMessage
      };
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET all messages for a specific conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await ChatConversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const messages = await ChatMessage.find({ conversationId })
      .sort({ createdAt: 1 });

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST create a new conversation and send first message
exports.startConversation = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const aiResult = getResponse(message);
    const title = generateConversationTitle(message);

    const newConversation = new ChatConversation({
      participants: [req.user._id],
      isGroupChat: false,
      groupName: title, 
      lastMessageAt: Date.now()
    });

    await newConversation.save();

    const userMsg = new ChatMessage({
      conversationId: newConversation._id,
      senderId: req.user._id,
      content: message
    });
    await userMsg.save();

    let aiResponseText = aiResult.response;
    if (aiResult.followUp) {
      aiResponseText += "\n\n" + aiResult.followUp;
    }

    const aiMsg = new ChatMessage({
      conversationId: newConversation._id,
      senderId: null,
      content: aiResponseText
    });
    await aiMsg.save();

    // Check for academic topic
    const academicTopic = extractAcademicTopic(message);
    let recommendedSessions = [];

    if (academicTopic.detected && academicTopic.category) {
      recommendedSessions = await getRecommendedSessions(academicTopic.category);
    }

    return res.status(201).json({
      success: true,
      data: {
        conversationId: newConversation._id,
        title,
        messages: [userMsg, aiMsg],
        recommendedSessions,
        academicTopic: academicTopic.detected ? academicTopic.category : null
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST send a message to existing conversation
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const conversation = await ChatConversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const userMessage = new ChatMessage({
      conversationId,
      senderId: req.user._id,
      content: message
    });
    await userMessage.save();

    const aiResult = getResponse(message);

    let aiResponseText = aiResult.response;
    if (aiResult.followUp) {
      aiResponseText += "\n\n" + aiResult.followUp;
    }

    const aiMessage = new ChatMessage({
      conversationId,
      senderId: null,
      content: aiResponseText
    });
    await aiMessage.save();

    conversation.lastMessageAt = Date.now();
    await conversation.save();

    // Check for academic topic
    const academicTopic = extractAcademicTopic(message);
    let recommendedSessions = [];

    if (academicTopic.detected && academicTopic.category) {
      recommendedSessions = await getRecommendedSessions(academicTopic.category);
    }

    return res.status(200).json({
      success: true,
      data: {
        userMessage,
        aiMessage,
        recommendedSessions,
        academicTopic: academicTopic.detected ? academicTopic.category : null
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE a conversation
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const conversation = await ChatConversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await ChatMessage.deleteMany({ conversationId });
    await ChatConversation.findByIdAndDelete(conversationId);

    return res.status(200).json({ success: true, message: "Conversation deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
