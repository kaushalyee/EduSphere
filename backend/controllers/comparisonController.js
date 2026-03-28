/**
 * GET /api/comparison/self/:studentId
 * Returns self-comparison data for healthy progress tracking
 */
exports.getSelfComparison = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { timeRange = 'month' } = req.query;

    // Mock self-comparison data
    const selfComparison = {
      currentPeriod: {
        average: 82,
        totalQuizzes: 12,
        subjects: {
          'Programming': { average: 85, trend: 'improving', quizzes: 5 },
          'Database Systems': { average: 78, trend: 'stable', quizzes: 4 },
          'Networking': { average: 83, trend: 'improving', quizzes: 3 }
        }
      },
      previousPeriod: {
        average: 77,
        totalQuizzes: 10,
        subjects: {
          'Programming': { average: 80, trend: 'stable', quizzes: 4 },
          'Database Systems': { average: 75, trend: 'declining', quizzes: 3 },
          'Networking': { average: 76, trend: 'improving', quizzes: 3 }
        }
      },
      improvement: 5.2,
      growthRate: 6.8,
      consistency: 85,
      effortScore: 78
    };

    return res.status(200).json({
      success: true,
      studentId,
      timeRange,
      comparison: selfComparison
    });
  } catch (error) {
    console.error("Error fetching self comparison:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching comparison data.",
      error: error.message,
    });
  }
};

/**
 * GET /api/comparison/growth-trajectory/:studentId
 * Returns growth trajectory data over time
 */
exports.getGrowthTrajectory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { period = '6months' } = req.query;

    // Mock growth trajectory data
    const growthTrajectory = [
      { month: 'Jan', score: 72, quizzes: 3, effort: 65 },
      { month: 'Feb', score: 75, quizzes: 4, effort: 70 },
      { month: 'Mar', score: 78, quizzes: 2, effort: 72 },
      { month: 'Apr', score: 80, quizzes: 5, effort: 78 },
      { month: 'May', score: 82, quizzes: 3, effort: 75 },
      { month: 'Jun', score: 85, quizzes: 4, effort: 82 }
    ];

    return res.status(200).json({
      success: true,
      studentId,
      period,
      trajectory: growthTrajectory
    });
  } catch (error) {
    console.error("Error fetching growth trajectory:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching growth trajectory.",
      error: error.message,
    });
  }
};

/**
 * GET /api/comparison/subject-radar/:studentId
 * Returns subject-wise comparison data for radar chart
 */
exports.getSubjectRadar = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Mock subject radar data
    const subjectRadar = [
      { subject: 'Programming', current: 85, previous: 80, improvement: 6.25 },
      { subject: 'Database', current: 78, previous: 75, improvement: 4.00 },
      { subject: 'Networking', current: 83, previous: 76, improvement: 9.21 },
      { subject: 'Mathematics', current: 80, previous: 72, improvement: 11.11 },
      { subject: 'English', current: 88, previous: 85, improvement: 3.53 }
    ];

    return res.status(200).json({
      success: true,
      studentId,
      radarData: subjectRadar
    });
  } catch (error) {
    console.error("Error fetching subject radar data:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching subject radar data.",
      error: error.message,
    });
  }
};

/**
 * GET /api/comparison/insights/:studentId
 * Returns personalized insights and recommendations
 */
exports.getComparisonInsights = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Mock insights data
    const insights = [
      {
        type: 'positive',
        title: 'Strong Improvement',
        message: 'Your Programming skills have improved by 6% this period',
        icon: 'trending-up',
        actionable: true,
        suggestions: [
          'Continue current study pattern',
          'Try advanced problems to challenge yourself',
          'Help peers to reinforce your knowledge'
        ]
      },
      {
        type: 'warning',
        title: 'Growth Opportunity',
        message: 'Database Systems performance could be improved with more practice',
        icon: 'alert-circle',
        actionable: true,
        suggestions: [
          'Focus on normalization concepts',
          'Practice more SQL queries',
          'Join database study groups'
        ]
      },
      {
        type: 'positive',
        title: 'Consistent Progress',
        message: 'You\'ve maintained steady growth across all subjects',
        icon: 'activity',
        actionable: false,
        suggestions: []
      }
    ];

    const motivationalMessages = [
      "Remember, progress is progress no matter how small!",
      "You're competing with who you were yesterday, not with others.",
      "Every quiz attempt is a step forward in your learning journey.",
      "Consistency beats perfection - keep up the great work!"
    ];

    const randomMotivation = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    return res.status(200).json({
      success: true,
      studentId,
      insights,
      motivationalMessage: randomMotivation,
      healthyCompetitionTips: [
        {
          title: 'Focus on Growth',
          description: 'Track your improvement over time rather than comparing scores'
        },
        {
          title: 'Celebrate Small Wins',
          description: 'Acknowledge every improvement, no matter how small'
        },
        {
          title: 'Learn from Setbacks',
          description: 'Use challenges as learning opportunities'
        },
        {
          title: 'Set Personal Goals',
          description: 'Aim for personal bests, not just beating others'
        }
      ]
    });
  } catch (error) {
    console.error("Error fetching comparison insights:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching insights.",
      error: error.message,
    });
  }
};

/**
 * GET /api/comparison/progress-summary/:studentId
 * Returns comprehensive progress summary
 */
exports.getProgressSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Mock progress summary
    const progressSummary = {
      overallStats: {
        totalQuizzes: 45,
        averageScore: 81.5,
        improvementRate: 7.2,
        consistencyRate: 85,
        bestSubject: 'Programming',
        mostImproved: 'Networking',
        studyStreak: 3
      },
      subjectBreakdown: {
        'Programming': {
          currentLevel: 'Advanced',
          improvement: '+8%',
          timeSpent: '45 hours',
          masteryScore: 85
        },
        'Database Systems': {
          currentLevel: 'Intermediate',
          improvement: '+3%',
          timeSpent: '32 hours',
          masteryScore: 78
        },
        'Networking': {
          currentLevel: 'Intermediate',
          improvement: '+12%',
          timeSpent: '28 hours',
          masteryScore: 83
        }
      },
      learningPatterns: {
        bestStudyTime: 'Evening (6-9 PM)',
        optimalQuizFrequency: '3-4 per week',
        preferredLearningStyle: 'Visual + Practical',
        retentionRate: 87
      },
      recommendations: [
        {
          priority: 'high',
          area: 'Database Systems',
          action: 'Increase practice sessions to 4 per week',
          expectedImprovement: '+5-8%'
        },
        {
          priority: 'medium',
          area: 'Study Schedule',
          action: 'Add 30min review sessions after each quiz',
          expectedImprovement: '+3-5%'
        },
        {
          priority: 'low',
          area: 'Advanced Topics',
          action: 'Explore advanced programming concepts',
          expectedImprovement: '+2-4%'
        }
      ]
    };

    return res.status(200).json({
      success: true,
      studentId,
      summary: progressSummary
    });
  } catch (error) {
    console.error("Error fetching progress summary:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching progress summary.",
      error: error.message,
    });
  }
};
