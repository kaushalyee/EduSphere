import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Award,
  Activity
} from 'lucide-react';
import api from '../../api/api';

// Color palette for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AnalyticsDashboard = () => {
  // State for storing analytics data
  const [overview, setOverview] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch overview data on component mount
  useEffect(() => {
    fetchOverview();
    fetchSubmissions();
    fetchPerformance();
  }, [timeframe, filterStatus]);

  // Function to fetch overview statistics
  const fetchOverview = async () => {
    try {
      const response = await api.get('/analytics/overview');
      setOverview(response.data.data);
    } catch (error) {
      console.error('Error fetching overview:', error);
      setError('Failed to fetch overview data');
    }
  };

  // Function to fetch submissions with filters
  const fetchSubmissions = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await api.get(`/analytics/submissions?${params}`);
      setSubmissions(response.data.data.submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Failed to fetch submissions data');
    }
  };

  // Function to fetch performance metrics
  const fetchPerformance = async () => {
    try {
      const response = await api.get(`/analytics/performance?timeframe=${timeframe}`);
      setPerformance(response.data.data);
    } catch (error) {
      console.error('Error fetching performance:', error);
      setError('Failed to fetch performance data');
    }
  };

  // Update loading state when all data is fetched
  useEffect(() => {
    if (overview && submissions.length > 0 && performance) {
      setLoading(false);
    }
  }, [overview, submissions, performance]);

  // Format time for display
  const formatTime = (ms) => {
    if (!ms) return '0s';
    const seconds = Math.round(ms / 1000);
    return seconds > 60 ? `${Math.round(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 animate-pulse">Loading analytics...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <div className="flex gap-4">
          {/* Timeframe selector */}
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          
          {/* Status filter */}
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="analyzing">Analyzing</option>
            <option value="graded">Graded</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {overview?.overview?.totalSubmissions || 0}
          </div>
          <div className="text-sm text-gray-600">Submissions</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-green-600" />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {overview?.overview?.totalUsers || 0}
          </div>
          <div className="text-sm text-gray-600">Users</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-gray-500">Average</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(overview?.overview?.avgConfidence || 0)}%
          </div>
          <div className="text-sm text-gray-600">Confidence</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-gray-500">Average</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {formatTime(performance?.metrics?.analysis?.averageTime)}
          </div>
          <div className="text-sm text-gray-600">Analysis Time</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overview?.gradeDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, count }) => `${name}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(overview?.gradeDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Submissions Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Submissions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performance?.metrics?.trends?.dailySubmissions || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {overview?.recentActivity?.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'graded' ? 'bg-green-500' :
                  activity.status === 'analyzing' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`} />
                <div>
                  <div className="font-medium text-gray-800">
                    Submission #{activity.id.toString().slice(-6)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {activity.predictedGrade && (
                  <div className="font-medium text-blue-600">
                    {activity.predictedGrade.grade}
                  </div>
                )}
                <div className="text-sm text-gray-500 capitalize">
                  {activity.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Peak Submission Hours</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {performance?.metrics?.trends?.peakHours?.map((hour, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {hour.hour}:00
              </div>
              <div className="text-sm text-gray-600">
                {hour.submissions} submissions
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
