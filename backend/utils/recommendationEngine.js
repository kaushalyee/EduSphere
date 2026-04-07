// utils/recommendationEngine.js
const { TOPICS_BY_CATEGORY } = require("../constants/topics");

const ALL_TOPICS = Object.values(TOPICS_BY_CATEGORY).flat();

function buildVector(topics) {
  return ALL_TOPICS.map(t => (topics.includes(t) ? 1 : 0));
}

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

function rankSessions(studentWeakTopics, sessions) {
  if (!studentWeakTopics || studentWeakTopics.length === 0) {
    return sessions.map(s => ({
      ...s.toObject(),
      recommendationScore: 0,
      isRecommended: false,
    }));
  }

  const studentVector = buildVector(studentWeakTopics);

  const scored = sessions.map(session => {
    const sessionVector = buildVector([session.topic]);
    const score = cosineSimilarity(studentVector, sessionVector);
    return {
      ...session.toObject(),
      recommendationScore: parseFloat(score.toFixed(4)),
      isRecommended: score > 0,
    };
  });

  const recommended = scored
    .filter(s => s.isRecommended)
    .sort((a, b) => b.recommendationScore - a.recommendationScore);

  const others = scored.filter(s => !s.isRecommended);

  return [...recommended, ...others];
}

module.exports = { rankSessions };