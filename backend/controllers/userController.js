const User = require("../models/User");

exports.completeOnboarding = async (req, res) => {
  try {
    const { year, semester, weakCategories, weakTopics } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Only students can complete onboarding" });
    }

    user.year = year;
    user.semester = semester;
    user.weakCategories = weakCategories;
    user.weakTopics = weakTopics;

    await user.save();

    res.json({ message: "Onboarding completed successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};