const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, chatController.getConversations);
router.post('/start', protect, chatController.startConversation);
router.get('/:conversationId/messages', protect, chatController.getMessages);
router.post('/:conversationId/message', protect, chatController.sendMessage);
router.delete('/:conversationId', protect, chatController.deleteConversation);

module.exports = router;
