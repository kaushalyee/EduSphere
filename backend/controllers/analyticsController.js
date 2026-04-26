const AssignmentSubmission = require('../models/AssignmentSubmission');
const AssignmentRequirement = require('../models/AssignmentRequirement');
const User = require('../models/User');

/**
 * GET /api/analytics/overview
 * Get system overview statistics
 */
exports.getOverview = async (req, res) => {
  try {
    // Get total counts for dashboard
    const [
      totalSubmissions,
      totalAssignments,
      totalUsers,
      recentSubmissions,
      topSubjects,
      gradeDistribution
    ] = await Promise.all([
      // Count total submissions
      AssignmentSubmission.countDocuments(),
      // Count total assignments
      AssignmentRequirement.countDocuments(),
      // Count total users
      User.countDocuments(),
      // Get recent submissions (last 7 days)
      AssignmentSubmission.find({
        submittedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }).sort({ submittedAt: -1 }).limit(10),
      // Get top subjects by submission count
      AssignmentSubmission.aggregate([
        { $group: { _id: '$requirementId' }, totalSubmissions: { $sum: 1 } },
        { $sort: { totalSubmissions: -1 } },
        { $limit: 5 }
      ]),
      // Get grade distribution
      AssignmentSubmission.aggregate([
        {
          $match: { predictedGrade: { $exists: true } }
        },
        {
          $group: {
            _id: '$predictedGrade.grade',
            count: { $sum: 1 },
            avgPercentage: { $avg: '$predictedGrade.percentage' }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    // Calculate average analysis confidence
    const avgConfidence = await AssignmentSubmission.aggregate([
      { $match: { predictedGrade: { $exists: true } } },
      { $group: { _id: null, avgConfidence: { $avg: '$predictedGrade.confidence' } } }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalSubmissions,
          totalAssignments,
          totalUsers,
          avgConfidence: avgConfidence.length > 0 ? avgConfConfidence[0].avgConfidence : 0
        },
        recentActivity: recentSubmissions.map(sub => ({
          id: sub._id,
          studentId: sub.studentId,
          submittedAt: sub.submittedAt,
          status: sub.status,
          predictedGrade: sub.predictedGrade
        })),
        topSubjects: topSubjects,
        gradeDistribution: gradeDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
};

/**
 * GET /api/analytics/submissions
 * Get detailed submission analytics with filtering
 */
exports.getSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, subject, dateFrom, dateTo } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (subject) filter['rubricAnalysis.criteria.name'] = { $in: [subject] };
    if (dateFrom || dateTo) {
      filter.submittedAt = {};
      if (dateFrom) filter.submittedAt.$gte = new Date(dateFrom);
      if (dateTo) filter.submittedAt.$lte = new Date(dateTo);
    }

    // Get submissions with pagination and filtering
    const submissions = await AssignmentSubmission.find(filter)
      .populate('studentId', 'name email')
      .populate('requirementId', 'title')
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await AssignmentSubmission.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: {
        submissions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
};

/**
 * GET /api/analytics/performance
 * Get system performance metrics
 */
exports.getPerformance = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query; // Default to 30 days

    // Calculate date range based on timeframe
    let dateFrom;
    switch (timeframe) {
      case '7d':
        dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get performance metrics
    const [
      avgAnalysisTime,
      statusStats,
      dailySubmissions,
      peakHours
    ] = await Promise.all([
      // Calculate average analysis time
      AssignmentSubmission.aggregate([
        { $match: { analysisCompletedAt: { $exists: true }, submittedAt: { $gte: dateFrom } } },
        {
          $project: {
            analysisTime: {
              $subtract: ['$analysisCompletedAt', '$submittedAt']
            }
          }
        },
        {
          $group: { _id: null, avgAnalysisTime: { $avg: '$analysisTime' } }
        }
      ]),
      // Get success/error rates
      AssignmentSubmission.aggregate([
        { $match: { submittedAt: { $gte: dateFrom } } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      // Get daily submission trends
      AssignmentSubmission.aggregate([
        { $match: { submittedAt: { $gte: dateFrom } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$submittedAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      // Get peak submission hours
      AssignmentSubmission.aggregate([
        { $match: { submittedAt: { $gte: dateFrom } } },
        {
          $group: {
            _id: {
              $hour: { $hour: '$submittedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    return res.status(200).json({
      success: true,
      data: {
        timeframe,
        metrics: {
          analysis: {
            averageTime: avgAnalysisTime.length > 0 ? Math.round(avgAnalysisTime[0].avgAnalysisTime / 1000) : 0, // Convert ms to seconds
            successRate: statusStats.find(s => s._id === 'graded')?.count || 0,
            errorRate: statusStats.find(s => s._id === 'submitted')?.count || 0
          },
          trends: {
            dailySubmissions: dailySubmissions.map(d => ({
              date: d._id,
              count: d.count
            })),
            peakHours: peakHours.map(h => ({
              hour: h._id,
              submissions: h.count
            }))
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch performance data',
      error: error.message
    });
  }
};
