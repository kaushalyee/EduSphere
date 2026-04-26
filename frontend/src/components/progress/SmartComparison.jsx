import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  User, 
  Target,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Activity
} from 'lucide-react';

const SmartComparison = () => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true);
        const studentId = "demo_student";
        
        // Mock data for now - will be replaced with API call
        const mockData = {
          selfComparison: {
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
            growthRate: 6.8
          },
          growthTrajectory: [
            { month: 'Jan', score: 72, quizzes: 3 },
            { month: 'Feb', score: 75, quizzes: 4 },
            { month: 'Mar', score: 78, quizzes: 2 },
            { month: 'Apr', score: 80, quizzes: 5 },
            { month: 'May', score: 82, quizzes: 3 },
            { month: 'Jun', score: 85, quizzes: 4 }
          ],
          subjectRadar: [
            { subject: 'Programming', current: 85, previous: 80 },
            { subject: 'Database', current: 78, previous: 75 },
            { subject: 'Networking', current: 83, previous: 76 },
            { subject: 'Mathematics', current: 80, previous: 72 },
            { subject: 'English', current: 88, previous: 85 }
          ],
          insights: [
            {
              type: 'positive',
              title: 'Strong Improvement',
              message: 'Your Programming skills have improved by 6% this period',
              icon: TrendingUp
            },
            {
              type: 'warning',
              title: 'Growth Opportunity',
              message: 'Database Systems performance could be improved with more practice',
              icon: AlertCircle
            },
            {
              type: 'positive',
              title: 'Consistent Progress',
              message: 'You\'ve maintained steady growth across all subjects',
              icon: Activity
            }
          ]
        };

        setComparisonData(mockData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch comparison data:', err);
        setError(`Failed to load comparison data: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [selectedTimeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center text-red-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center text-gray-600">
          <BarChart3 className="w-12 h-12 mx-auto mb-4" />
          <p>No comparison data available</p>
        </div>
      </div>
    );
  }

  const { selfComparison, growthTrajectory, subjectRadar, insights } = comparisonData;

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Smart Comparison</h2>
          <p className="text-gray-600">Compare your progress with your past self in a healthy way</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'semester'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedTimeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">+{selfComparison.improvement}%</span>
          </div>
          <p className="text-green-700 font-medium">Overall Improvement</p>
          <p className="text-green-600 text-sm">vs previous period</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-800">{selfComparison.growthRate}%</span>
          </div>
          <p className="text-blue-700 font-medium">Growth Rate</p>
          <p className="text-blue-600 text-sm">steady progress</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-800">{selfComparison.currentPeriod.average}%</span>
          </div>
          <p className="text-purple-700 font-medium">Current Average</p>
          <p className="text-purple-600 text-sm">across all subjects</p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-800">{selfComparison.currentPeriod.totalQuizzes}</span>
          </div>
          <p className="text-orange-700 font-medium">Quizzes Completed</p>
          <p className="text-orange-600 text-sm">this period</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Trajectory Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Growth Trajectory</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthTrajectory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[60, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#4F46E5" 
                strokeWidth={3}
                dot={{ fill: '#4F46E5', r: 6 }}
                name="Average Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Comparison Radar */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Subject Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={subjectRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[60, 100]} />
              <Radar 
                name="Current Period" 
                dataKey="current" 
                stroke="#4F46E5" 
                fill="#4F46E5" 
                fillOpacity={0.6}
              />
              <Radar 
                name="Previous Period" 
                dataKey="previous" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject-wise Comparison */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Subject-wise Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(selfComparison.currentPeriod.subjects).map(([subject, data]) => {
            const previousData = selfComparison.previousPeriod.subjects[subject];
            const improvement = data.average - previousData.average;
            
            return (
              <div key={subject} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800">{subject}</h4>
                  {getTrendIcon(data.trend)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current</span>
                    <span className="font-bold text-lg text-indigo-600">{data.average}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Previous</span>
                    <span className="font-medium text-gray-700">{previousData.average}%</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-600">Change</span>
                    <span className={`font-bold ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                insight.type === 'positive' ? 'bg-green-50 border-green-200' :
                insight.type === 'warning' ? 'bg-orange-50 border-orange-200' :
                'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  insight.type === 'positive' ? 'bg-green-100' :
                  insight.type === 'warning' ? 'bg-orange-100' :
                  'bg-blue-100'
                }`}>
                  <insight.icon className={`w-5 h-5 ${
                    insight.type === 'positive' ? 'text-green-600' :
                    insight.type === 'warning' ? 'text-orange-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Healthy Competition Message */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Healthy Self-Comparison</h3>
            <p className="text-gray-700 mb-3">
              Remember, the only person you should compare yourself with is who you were yesterday. 
              Your progress is unique to your journey, and every improvement counts!
            </p>
            <div className="flex flex-wrap gap-2">
              {['Focus on growth', 'Celebrate small wins', 'Learn from setbacks', 'Stay consistent'].map((tip) => (
                <span key={tip} className="px-3 py-1 bg-white rounded-full text-sm text-indigo-700 font-medium">
                  {tip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartComparison;
