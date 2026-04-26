const express = require('express');
const router = express.Router();
const { 
  getOverview,
  getSubmissions,
  getPerformance
} = require('../controllers/analyticsController');

const { protect, authorize } = require('../middlewares/authMiddleware');

console.log(">>> REGISTERING ANALYTICS ROUTES <<<");

// All analytics routes require authentication and admin authorization
router.use(protect);
router.use(authorize('admin', 'tutor'));

// GET /api/analytics/overview - Get system overview statistics
router.get('/overview', getOverview);

// GET /api/analytics/submissions - Get detailed submission analytics with filtering
router.get('/submissions', getSubmissions);

// GET /api/analytics/performance - Get system performance metrics
router.get('/performance', getPerformance);

console.log(">>> REGISTERED ANALYTICS ROUTES:", router.stack.map(r => r.route?.path || 'middleware').filter(p => p !== 'middleware'));

module.exports = router;
