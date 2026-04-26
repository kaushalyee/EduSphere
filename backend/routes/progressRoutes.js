const express = require('express');
const router = express.Router();
const { 
  getLearningTrajectory, 
  getTrajectorySummary,
  getTrajectoryWithFilter,
  getSubjectScorecard,
  getRecentActivity,
  getStreakTracker,
  getWeakSubjectSpotlight,
  getPersonalBest,
  getStagnationAlerts
} = require('../controllers/progressController');

console.log(">>> REGISTERING PROGRESS ROUTES <<<");

// Route to get learning trajectory data
router.get('/trajectory/:studentId', getLearningTrajectory);

// Route to get trajectory summary
router.get('/trajectory/:studentId/summary', getTrajectorySummary);

// Route to get filtered trajectory data
router.get('/trajectory/:studentId/filter', getTrajectoryWithFilter);

// Route to get subject scorecard
router.get('/trajectory/:studentId/scorecard', getSubjectScorecard);

// Route to get recent quiz activity
router.get('/trajectory/:studentId/recent-activity', getRecentActivity);

// Route to get streak tracker data
router.get('/trajectory/:studentId/streaks', getStreakTracker);

// Route to get weak subject spotlight
router.get('/trajectory/:studentId/weak-subject', getWeakSubjectSpotlight);

// Route to get personal best badges
router.get('/trajectory/:studentId/personal-best', getPersonalBest);

// Route to get stagnation alerts
router.get('/trajectory/:studentId/stagnation-alerts', getStagnationAlerts);

console.log(">>> REGISTERED ROUTES:", router.stack.map(r => r.route.path));

module.exports = router;
