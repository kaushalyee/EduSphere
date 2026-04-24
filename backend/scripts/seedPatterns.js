/**
 * scripts/seedPatterns.js
 *
 * Seeds realistic learning patterns for demo/presentation purposes.
 * Run once: node scripts/seedPatterns.js
 *
 * Real data will override these automatically as students use the platform.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const LearningPattern = require("../models/LearningPattern");

const DEMO_PATTERNS = [
  {
    weakTopic: "Classes & Objects",
    prerequisiteTopic: "Arrays & Strings",
    sampleSize: 14,
    avgScoreWithPrereq: 76,
    avgScoreWithoutPrereq: 48,
    improvementRate: 28,
  },
  {
    weakTopic: "Inheritance",
    prerequisiteTopic: "Classes & Objects",
    sampleSize: 11,
    avgScoreWithPrereq: 74,
    avgScoreWithoutPrereq: 47,
    improvementRate: 27,
  },
  {
    weakTopic: "Polymorphism",
    prerequisiteTopic: "Inheritance",
    sampleSize: 9,
    avgScoreWithPrereq: 72,
    avgScoreWithoutPrereq: 46,
    improvementRate: 26,
  },
  {
    weakTopic: "SQL Queries",
    prerequisiteTopic: "Relational Model",
    sampleSize: 13,
    avgScoreWithPrereq: 78,
    avgScoreWithoutPrereq: 51,
    improvementRate: 27,
  },
  {
    weakTopic: "Joins",
    prerequisiteTopic: "SQL Queries",
    sampleSize: 10,
    avgScoreWithPrereq: 73,
    avgScoreWithoutPrereq: 49,
    improvementRate: 24,
  },
  {
    weakTopic: "Normalization (1NF–BCNF)",
    prerequisiteTopic: "Relational Model",
    sampleSize: 8,
    avgScoreWithPrereq: 71,
    avgScoreWithoutPrereq: 44,
    improvementRate: 27,
  },
  {
    weakTopic: "Dynamic Programming",
    prerequisiteTopic: "Arrays & Strings",
    sampleSize: 15,
    avgScoreWithPrereq: 69,
    avgScoreWithoutPrereq: 41,
    improvementRate: 28,
  },
  {
    weakTopic: "Graphs",
    prerequisiteTopic: "Trees & BSTs",
    sampleSize: 12,
    avgScoreWithPrereq: 75,
    avgScoreWithoutPrereq: 50,
    improvementRate: 25,
  },
  {
    weakTopic: "Microservices",
    prerequisiteTopic: "REST APIs",
    sampleSize: 9,
    avgScoreWithPrereq: 77,
    avgScoreWithoutPrereq: 52,
    improvementRate: 25,
  },
  {
    weakTopic: "Load Balancing",
    prerequisiteTopic: "Scalability Concepts",
    sampleSize: 8,
    avgScoreWithPrereq: 74,
    avgScoreWithoutPrereq: 50,
    improvementRate: 24,
  },
  {
    weakTopic: "Neural Networks",
    prerequisiteTopic: "Linear Algebra",
    sampleSize: 11,
    avgScoreWithPrereq: 70,
    avgScoreWithoutPrereq: 43,
    improvementRate: 27,
  },
  {
    weakTopic: "CPU Scheduling",
    prerequisiteTopic: "Processes & Threads",
    sampleSize: 10,
    avgScoreWithPrereq: 75,
    avgScoreWithoutPrereq: 48,
    improvementRate: 27,
  },
  {
    weakTopic: "Virtual Memory",
    prerequisiteTopic: "Memory Management",
    sampleSize: 9,
    avgScoreWithPrereq: 72,
    avgScoreWithoutPrereq: 47,
    improvementRate: 25,
  },
  {
    weakTopic: "React",
    prerequisiteTopic: "JavaScript (DOM)",
    sampleSize: 16,
    avgScoreWithPrereq: 80,
    avgScoreWithoutPrereq: 53,
    improvementRate: 27,
  },
  {
    weakTopic: "Authentication (JWT/OAuth)",
    prerequisiteTopic: "REST APIs",
    sampleSize: 10,
    avgScoreWithPrereq: 76,
    avgScoreWithoutPrereq: 51,
    improvementRate: 25,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let inserted = 0;
    let skipped = 0;

    for (const pattern of DEMO_PATTERNS) {
      const existing = await LearningPattern.findOne({
        weakTopic: pattern.weakTopic,
        prerequisiteTopic: pattern.prerequisiteTopic,
      });

      if (existing) {
        console.log(
          `Skipped (already exists): ${pattern.prerequisiteTopic} → ${pattern.weakTopic}`
        );
        skipped++;
        continue;
      }

      await LearningPattern.create(pattern);
      console.log(
        `Inserted: ${pattern.prerequisiteTopic} → ${pattern.weakTopic} (+${pattern.improvementRate}%)`
      );
      inserted++;
    }

    console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
};

seed();