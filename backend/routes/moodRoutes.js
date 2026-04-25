const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, moodController.logMood);
router.get('/history', protect, moodController.getMoodHistory);
router.get('/today', protect, moodController.getTodayMood);

module.exports = router;
