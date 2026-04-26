const express = require('express');
const router = express.Router();
const { 
  getSelfComparison,
  getGrowthTrajectory,
  getSubjectRadar,
  getComparisonInsights,
  getProgressSummary
} = require('../controllers/comparisonController');

console.log(">>> REGISTERING COMPARISON ROUTES <<<");

// Route to get self-comparison data
router.get('/self/:studentId', getSelfComparison);

// Route to get growth trajectory
router.get('/growth-trajectory/:studentId', getGrowthTrajectory);

// Route to get subject radar data
router.get('/subject-radar/:studentId', getSubjectRadar);

// Route to get comparison insights
router.get('/insights/:studentId', getComparisonInsights);

// Route to get progress summary
router.get('/progress-summary/:studentId', getProgressSummary);

console.log(">>> REGISTERED COMPARISON ROUTES:", router.stack.map(r => r.route.path));

module.exports = router;
