const QuizResult = require("../models/QuizResult");
const LearningPattern = require("../models/LearningPattern");

/**
 * Recalculates learning patterns for a given topic.
 * Called automatically after every quiz result upload.
 *
 * Logic:
 * - Find all students who have a quiz result for this topic
 * - For each student, check what other topics they studied BEFORE this topic
 * - Compare average scores: students who studied prereq vs those who didn't
 * - If studying prereq X before topic Y improves score → save pattern
 */
const recalculatePatterns = async (topic) => {
  try {
    // Get all quiz results with session topic populated
    const allResults = await QuizResult.find({})
      .populate("sessionId", "topic")
      .lean();

    // Filter out results where sessionId is null (deleted sessions)
    const validResults = allResults.filter(
      (r) => r.sessionId && r.sessionId.topic
    );

    // Group results by student
    const byStudent = {};
    for (const r of validResults) {
      const sid = r.studentId.toString();
      if (!byStudent[sid]) byStudent[sid] = [];
      byStudent[sid].push({
        topic: r.sessionId.topic,
        percentage: r.percentage,
        date: r.createdAt,
      });
    }

    // For each student who has a result for this topic,
    // find what they studied before it
    const withoutPrereqScores = []; // scores of students who went straight to topic
    const prereqScores = {};        // prereqTopic → [scores of students who did prereq first]

    for (const studentResults of Object.values(byStudent)) {
      // Sort by date ascending
      const sorted = studentResults.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Find this student's result for the target topic
      const topicResult = sorted.find((r) => r.topic === topic);
      if (!topicResult) continue;

      // Find sessions they attended BEFORE the target topic
      const before = sorted.filter(
        (r) =>
          r.topic !== topic &&
          new Date(r.date) < new Date(topicResult.date)
      );

      if (before.length === 0) {
        // No prerequisite — went straight to topic
        withoutPrereqScores.push(topicResult.percentage);
      } else {
        // Had prerequisite(s) — record which ones
        for (const prereq of before) {
          if (!prereqScores[prereq.topic]) prereqScores[prereq.topic] = [];
          prereqScores[prereq.topic].push(topicResult.percentage);
        }
      }
    }

    const avgWithout =
      withoutPrereqScores.length > 0
        ? withoutPrereqScores.reduce((a, b) => a + b, 0) /
          withoutPrereqScores.length
        : null;

    // Save or update patterns for each prerequisite topic
    for (const [prereqTopic, scores] of Object.entries(prereqScores)) {
      // Need at least 2 students to form a meaningful pattern
      if (scores.length < 2) continue;

      const avgWith =
        scores.reduce((a, b) => a + b, 0) / scores.length;

      const improvement =
        avgWithout !== null ? avgWith - avgWithout : 0;

      // Only save if studying prereq actually helps
      if (improvement <= 0) continue;

      await LearningPattern.findOneAndUpdate(
        { weakTopic: topic, prerequisiteTopic: prereqTopic },
        {
          sampleSize: scores.length,
          avgScoreWithPrereq: parseFloat(avgWith.toFixed(2)),
          avgScoreWithoutPrereq: parseFloat((avgWithout || 0).toFixed(2)),
          improvementRate: parseFloat(improvement.toFixed(2)),
        },
        { upsert: true, new: true }
      );
    }

    console.log(`[patternEngine] Patterns updated for topic: ${topic}`);
  } catch (err) {
    console.error(`[patternEngine] Error recalculating patterns for ${topic}:`, err.message);
  }
};

module.exports = { recalculatePatterns };
