const MoodEntry = require('../models/MoodEntry');

// Log mood
exports.logMood = async (req, res) => {
  try {
    const { mood, note } = req.body;
    if (!mood || mood < 1 || mood > 10) {
      return res.status(400).json({ success: false, message: 'Mood must be between 1 and 10' });
    }
    const entry = await MoodEntry.create({
      studentId: req.user._id,
      mood,
      note: note || ''
    });
    return res.status(201).json({ success: true, data: entry });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get mood history for last 7 days
exports.getMoodHistory = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const entries = await MoodEntry.find({
      studentId: req.user._id,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    return res.status(200).json({ success: true, data: entries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check if student logged mood today
exports.getTodayMood = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entry = await MoodEntry.findOne({
      studentId: req.user._id,
      date: { $gte: today }
    });

    return res.status(200).json({ success: true, data: entry });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
