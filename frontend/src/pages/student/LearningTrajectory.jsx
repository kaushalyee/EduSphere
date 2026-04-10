import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Trophy, 
  BookOpen, 
  Flame, 
  Clock,
  Download,
  ChevronDown,
  Award,
  Target,
  Lightbulb
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area } from 'recharts';

const LearningTrajectory = () => {
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedPeriod, setSelectedPeriod] = useState('3 Months');
  const [targetGrade] = useState(85);

  // Sample data - in real app this would come from API
  const performanceData = useMemo(() => [
    { month: 'Jan', score: 78, subject: 'Database Systems', date: '2024-01-15' },
    { month: 'Feb', score: 82, subject: 'Software Engineering', date: '2024-02-20' },
    { month: 'Mar', score: 91, subject: 'Database Systems', date: '2024-03-18' },
    { month: 'Apr', score: 85, subject: 'Data Structures', date: '2024-04-22' },
    { month: 'May', score: 88, subject: 'Database Systems', date: '2024-05-16' },
    { month: 'Jun', score: 79, subject: 'Software Engineering', date: '2024-06-25' },
  ], []);

  const subjects = useMemo(() => [
    { name: 'Database Systems', score: 88, status: 'improving', trend: 12 },
    { name: 'Software Engineering', score: 72, status: 'stable', trend: 0 },
    { name: 'Data Structures', score: 65, status: 'declining', trend: -8 },
    { name: 'Mathematics', score: 93, status: 'improving', trend: 15 },
    { name: 'Physics', score: 81, status: 'stable', trend: 2 },
    { name: 'Chemistry', score: 77, status: 'improving', trend: 5 }
  ], []);

  const milestones = useMemo(() => [
    { icon: 'trophy', title: 'First 90% score!', achieved: true, date: 'March 2024' },
    { icon: 'flame', title: 'Improved 3 months in a row!', achieved: true, date: 'April 2024' },
    { icon: 'trending', title: 'Biggest single jump: +8%', achieved: true, date: 'March 2024' },
    { icon: 'target', title: 'Reach 95% target', achieved: false, date: 'In Progress' }
  ], []);

  const stats = useMemo(() => ({
    currentScore: 85,
    improvement: 7.2,
    trend: 'improving',
    highestScore: 91,
    highestScoreMonth: 'March',
    subjectsTracked: 6,
    studyStreak: 12,
    totalStudyHours: 156
  }), []);

  const getSmartTip = () => {
    const recentScores = performanceData.slice(-3);
    const olderScores = performanceData.slice(-6, -3);
    
    if (recentScores.length < 3 || olderScores.length < 3) {
      return "Keep up the consistent work to build meaningful trends!";
    }

    const recentAvg = recentScores.reduce((sum, item) => sum + item.score, 0) / recentScores.length;
    const olderAvg = olderScores.reduce((sum, item) => sum + item.score, 0) / olderScores.length;

    if (recentAvg < olderAvg) {
      return "Your scores have dropped slightly recently. Consider revising earlier next semester!";
    } else if (recentAvg > olderAvg + 5) {
      return "Great improvement! Your recent performance shows excellent progress.";
    } else {
      return "Steady performance! A little extra practice could push you to the next level.";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'improving':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declining':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getMilestoneIcon = (iconType) => {
    switch (iconType) {
      case 'trophy':
        return <Trophy className="w-6 h-6" />;
      case 'flame':
        return <Flame className="w-6 h-6" />;
      case 'trending':
        return <TrendingUp className="w-6 h-6" />;
      case 'target':
        return <Target className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const filteredData = useMemo(() => {
    if (selectedSubject === 'All Subjects') {
      return performanceData;
    }
    return performanceData.filter(item => item.subject === selectedSubject);
  }, [selectedSubject, performanceData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.month}</p>
          <p className="text-sm text-gray-600">{data.subject}</p>
          <p className="text-lg font-bold text-purple-600">{data.score}%</p>
        </div>
      );
    }
    return null;
  };

  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF export functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Trajectory</h1>
          <p className="text-gray-600">Track your performance trends across different subjects.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Current Score</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.currentScore}%</div>
            <div className="text-xs text-green-600 mt-1">+{stats.improvement}% from last month</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Highest Score Ever</span>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.highestScore}%</div>
            <div className="text-xs text-gray-600 mt-1">Achieved in {stats.highestScoreMonth}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Subjects Tracked</span>
              <BookOpen className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.subjectsTracked}</div>
            <div className="text-xs text-gray-600 mt-1">Active subjects</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Study Streak</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.studyStreak}</div>
            <div className="text-xs text-gray-600 mt-1">Days in a row</div>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex gap-2 mb-4 md:mb-0">
            {['1 Month', '3 Months', '6 Months', 'All Time'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Report (PDF)
          </button>
        </div>

        {/* Graph Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">Performance Graph</h2>
            
            {/* Subject Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.name} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={targetGrade} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                label={{ value: `Target: ${targetGrade}%`, position: 'topLeft' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#9333ea" 
                fill="#e9d5ff" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#9333ea" 
                strokeWidth={3}
                dot={{ fill: '#9333ea', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Breakdown Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Subject Breakdown</h2>
          <div className="space-y-3">
            {subjects.map((subject) => (
              <div 
                key={subject.name}
                className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(subject.status)}`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(subject.status)}
                  <span className="font-medium">{subject.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">{subject.score}%</span>
                  <span className="text-sm">
                    {subject.trend > 0 ? `+${subject.trend}%` : `${subject.trend}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Badges */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Milestone Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border text-center ${
                  milestone.achieved 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className={`mb-2 ${milestone.achieved ? 'text-yellow-600' : 'text-gray-400'}`}>
                  {getMilestoneIcon(milestone.icon)}
                </div>
                <h3 className="font-semibold text-sm mb-1">{milestone.title}</h3>
                <p className="text-xs text-gray-600">{milestone.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Tip Box */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Tip</h3>
              <p className="text-gray-700">{getSmartTip()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningTrajectory;
