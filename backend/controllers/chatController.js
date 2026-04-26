const ChatConversation = require('../models/ChatConversation');
const ChatMessage = require('../models/ChatMessage');
const Session = require('../models/Session');
const QuizResult = require('../models/QuizResult');
const { getResponse, generateConversationTitle, extractAcademicTopic } = require('../ai/chatEngine');

const getStudentQuizPerformance = async (studentId, category) => {
  try {
    const sessions = await Session.find({ category }).select('_id');
    const sessionIds = sessions.map(s => s._id);

    if (sessionIds.length === 0) return null;

    const results = await QuizResult.find({
      studentId,
      sessionId: { $in: sessionIds }
    }).sort({ createdAt: -1 }).limit(3);

    if (results.length === 0) return null;

    const avgPercentage = Math.round(
      results.reduce((sum, r) => sum + r.percentage, 0) / results.length
    );

    return {
      attempts: results.length,
      averageScore: avgPercentage,
      lastScore: results[0].percentage,
      lastMarks: `${results[0].marksObtained}/${results[0].totalMarks}`
    };
  } catch (err) {
    return null;
  }
};

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

    // Check for academic topic FIRST so we can personalise the response
    const academicTopic = extractAcademicTopic(message);
    let recommendedSessions = [];
    let quizPerformance = null;

    if (academicTopic.detected && academicTopic.category) {
      quizPerformance = await getStudentQuizPerformance(req.user._id, academicTopic.category);
      recommendedSessions = await getRecommendedSessions(academicTopic.category);
    }

    // Build personalised AI response
    let aiResponseText = aiResult.response;
    if (quizPerformance) {
      const performanceMsg = quizPerformance.lastScore < 50
        ? `I can see you scored ${quizPerformance.lastScore}% in your last ${academicTopic.category} quiz. Don't worry — with the right guidance you can improve!`
        : `I can see you scored ${quizPerformance.lastScore}% in your last ${academicTopic.category} quiz. You're doing well but there's always room to grow!`;
      aiResponseText = performanceMsg + ' ' + aiResult.response;
    }

    if (aiResult.followUp) {
      aiResponseText += '\n\n' + aiResult.followUp;
    }

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

    const aiMsg = new ChatMessage({
      conversationId: newConversation._id,
      senderId: null,
      content: aiResponseText
    });
    await aiMsg.save();

    return res.status(201).json({
      success: true,
      data: {
        conversationId: newConversation._id,
        title,
        messages: [userMsg, aiMsg],
        recommendedSessions,
        academicTopic: academicTopic.detected ? academicTopic.category : null,
        quizPerformance
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

    // Check for academic topic FIRST so we can personalise the response
    const academicTopic = extractAcademicTopic(message);
    let recommendedSessions = [];
    let quizPerformance = null;

    if (academicTopic.detected && academicTopic.category) {
      quizPerformance = await getStudentQuizPerformance(req.user._id, academicTopic.category);
      recommendedSessions = await getRecommendedSessions(academicTopic.category);
    }

    // Build personalised AI response
    let aiResponseText = aiResult.response;
    if (quizPerformance) {
      const performanceMsg = quizPerformance.lastScore < 50
        ? `I can see you scored ${quizPerformance.lastScore}% in your last ${academicTopic.category} quiz. Don't worry — with the right guidance you can improve!`
        : `I can see you scored ${quizPerformance.lastScore}% in your last ${academicTopic.category} quiz. You're doing well but there's always room to grow!`;
      aiResponseText = performanceMsg + ' ' + aiResult.response;
    }

    if (aiResult.followUp) {
      aiResponseText += '\n\n' + aiResult.followUp;
    }

    const aiMessage = new ChatMessage({
      conversationId,
      senderId: null,
      content: aiResponseText
    });
    await aiMessage.save();

    conversation.lastMessageAt = Date.now();
    await conversation.save();

    return res.status(200).json({
      success: true,
      data: {
        userMessage,
        aiMessage,
        recommendedSessions,
        academicTopic: academicTopic.detected ? academicTopic.category : null,
        quizPerformance
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
