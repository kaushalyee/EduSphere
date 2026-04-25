const { TOPICS_BY_CATEGORY } = require("../constants/topics");
const LearningPattern = require("../models/LearningPattern");

const ALL_TOPICS = Object.values(TOPICS_BY_CATEGORY).flat();

function buildVector(topics) {
  return ALL_TOPICS.map((t) => (topics.includes(t) ? 1 : 0));
}

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

/**
 * Normalize weakTopics — supports both old format ["OOP"] 
 * and new format [{ topic, weight }]
 */
function normalizeWeakTopics(studentWeakTopics) {
  if (!studentWeakTopics || studentWeakTopics.length === 0) return [];

  if (typeof studentWeakTopics[0] === "string") {
    return studentWeakTopics.map((topic, index) => ({
      topic,
      weight: Math.max(1 - index * 0.1, 0.5),
    }));
  }

  return studentWeakTopics.map((item) => ({
    topic: item.topic,
    weight: Number(item.weight) || 0.5,
  }));
}

/**
 * Main ranking function.
 * Returns sessions scored by:
 *  - Cosine similarity (topic match)
 *  - Weakness weight (how weak the student is in that topic)
 * Also attaches prerequisiteAdvice if a learning pattern exists.
 */
async function rankSessions(studentWeakTopics, sessions) {
  if (!studentWeakTopics || studentWeakTopics.length === 0) {
    return sessions.map((s) => ({
      ...s.toObject(),
      recommendationScore: 0,
      isRecommended: false,
      recommendationReason: null,
      prerequisiteAdvice: null,
    }));
  }

  const weighted = normalizeWeakTopics(studentWeakTopics);
  const studentTopics = weighted.map((t) => t.topic);
  const studentVector = buildVector(studentTopics);

  // Score all sessions
  const scored = sessions.map((session) => {
    const sessionVector = buildVector([session.topic]);
    const cosineScore = cosineSimilarity(studentVector, sessionVector);
    const weakEntry = weighted.find((t) => t.topic === session.topic);
    const weaknessScore = weakEntry ? weakEntry.weight : 0;

    // Cosine acts as gate — if no match, score is 0
    const finalScore =
      cosineScore > 0
        ? parseFloat((cosineScore * 0.5 + weaknessScore * 0.5).toFixed(4))
        : 0;

    const isRecommended = finalScore > 0;

    const recommendationReason =
      weaknessScore >= 0.8
        ? `High priority — ${session.topic} is one of your weakest areas`
        : isRecommended
        ? `${session.topic} matches your weak topics`
        : null;

    return {
      ...session.toObject(),
      recommendationScore: finalScore,
      isRecommended,
      recommendationReason,
      prerequisiteAdvice: null, // filled in below
    };
  });

  // ── Attach prerequisite advice from LearningPattern ──────────────────────
  const recommendedTopics = [...new Set(
    scored.filter((s) => s.isRecommended).map((s) => s.topic)
  )];

  // Fetch best pattern for each recommended topic in one query
  const patterns = await LearningPattern.find({
    weakTopic: { $in: recommendedTopics },
  }).sort({ improvementRate: -1 });

  // Map: weakTopic → best pattern
  const patternMap = {};
  for (const p of patterns) {
    if (!patternMap[p.weakTopic]) {
      patternMap[p.weakTopic] = p;
    }
  }

  // Attach advice to each scored session
  for (const session of scored) {
    if (!session.isRecommended) continue;
    const pattern = patternMap[session.topic];
    if (pattern) {
      session.prerequisiteAdvice = {
        topic: pattern.prerequisiteTopic,
        improvementRate: pattern.improvementRate,
        sampleSize: pattern.sampleSize,
        avgScoreWithPrereq: pattern.avgScoreWithPrereq,
        avgScoreWithoutPrereq: pattern.avgScoreWithoutPrereq,
      };
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  const recommended = scored
    .filter((s) => s.isRecommended)
    .sort((a, b) => b.recommendationScore - a.recommendationScore);

  const others = scored
    .filter((s) => !s.isRecommended)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return [...recommended, ...others];
}

module.exports = { rankSessions };