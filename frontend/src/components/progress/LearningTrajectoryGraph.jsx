import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Award, 
  Crosshair,
  Calendar,
  Clock,
  AlertTriangle,
  Trophy,
  Flame,
  Activity,
  Filter
} from 'lucide-react';

const LearningTrajectoryGraph = () => {
  const [trajectoryData, setTrajectoryData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New feature states
  const [dateRange, setDateRange] = useState('1month');
  const [scorecard, setScorecard] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [streaks, setStreaks] = useState({});
  const [weakSubjectSpotlight, setWeakSubjectSpotlight] = useState(null);
  const [personalBests, setPersonalBests] = useState([]);
  const [badges, setBadges] = useState([]);
  const [stagnationAlerts, setStagnationAlerts] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const studentId = "demo_student";
        
        // Fetch all data in parallel
        const [
          trajectoryResponse,
          scorecardResponse,
          activityResponse,
          streaksResponse,
          weakSubjectResponse,
          personalBestResponse,
          stagnationResponse
        ] = await Promise.all([
          api.get(`/progress/trajectory/${studentId}/filter?range=${dateRange}`),
          api.get(`/progress/trajectory/${studentId}/scorecard`),
          api.get(`/progress/trajectory/${studentId}/recent-activity?limit=5`),
          api.get(`/progress/trajectory/${studentId}/streaks`),
          api.get(`/progress/trajectory/${studentId}/weak-subject`),
          api.get(`/progress/trajectory/${studentId}/personal-best`),
          api.get(`/progress/trajectory/${studentId}/stagnation-alerts`)
        ]);
        
        // Process trajectory data
        const subjectsData = trajectoryResponse.data.trajectory.map(subj => {
          const formattedPoints = subj.dataPoints.map(item => {
            const dateObj = new Date(item.date);
            return {
              ...item,
              formattedDate: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`
            };
          });
          return { ...subj, dataPoints: formattedPoints };
        });

        setTrajectoryData(subjectsData);
        if (subjectsData.length > 0) {
          setSelectedSubject(subjectsData[0].subject);
        }
        
        // Set other data
        setScorecard(scorecardResponse.data.scorecard || []);
        setRecentActivity(activityResponse.data.activity || []);
        setStreaks(streaksResponse.data.streaks || {});
        setWeakSubjectSpotlight(weakSubjectResponse.data.spotlight);
        setPersonalBests(personalBestResponse.data.personalBests || []);
        setBadges(personalBestResponse.data.badges || []);
        setStagnationAlerts(stagnationResponse.data.alerts || []);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch learning data:', err);
        setError(`Failed to load data: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [dateRange]); // Re-fetch when date range changes

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-gray-500 animate-pulse font-medium">Loading advanced trajectory...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 h-64 bg-red-50 rounded-2xl shadow-sm border border-red-100">
        <div className="text-red-500 font-medium">{error}</div>
      </div>
    );
  }

  if (!trajectoryData.length) {
    return (
      <div className="flex items-center justify-center p-8 h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-gray-500">No trajectory data found. Check back after attempting some quizzes!</div>
      </div>
    );
  }

  const activeData = trajectoryData.find(d => d.subject === selectedSubject) || trajectoryData[0];

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving': return <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-sm font-semibold"><TrendingUp className="w-4 h-4 mr-1" /> Improving</div>;
      case 'declining': return <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-sm font-semibold"><TrendingDown className="w-4 h-4 mr-1" /> Declining</div>;
      default: return <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded text-sm font-semibold"><Minus className="w-4 h-4 mr-1" /> Stable</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Learning Trajectory Component */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-6">
        
        {/* Header and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-800">Learning Trajectory</h2>
            <p className="text-sm text-gray-500">Track your performance trends across different subjects.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Date Range Filter */}
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="text-sm font-medium bg-transparent border-none focus:outline-none text-gray-700"
              >
                <option value="2weeks">Last 2 Weeks</option>
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="all">All Time</option>
              </select>
            </div>
            
            {/* Subject Selection */}
            <div className="flex gap-2 p-1 bg-gray-50 rounded-lg overflow-x-auto border border-gray-100">
              {trajectoryData.map((subj) => (
                <button
                  key={subj.subject}
                  onClick={() => setSelectedSubject(subj.subject)}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-all whitespace-nowrap ${
                    selectedSubject === subj.subject
                      ? 'bg-white text-indigo-600 shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  {subj.subject}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Scorecard */}
        {scorecard.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scorecard.map((subject) => (
              <div key={subject.subject} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">{subject.subject}</h3>
                  <div className={`flex items-center px-2 py-1 rounded text-sm font-semibold ${
                    subject.trend === 'improving' ? 'text-green-600 bg-green-50' :
                    subject.trend === 'declining' ? 'text-red-600 bg-red-50' :
                    'text-gray-600 bg-gray-50'
                  }`}>
                    <span className="mr-1">{subject.trendIcon}</span>
                    {subject.trend}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Avg</p>
                    <p className="text-lg font-bold text-gray-800">{subject.average}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">High</p>
                    <p className="text-lg font-bold text-green-600">{subject.highest}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Latest</p>
                    <p className="text-lg font-bold text-blue-600">{subject.latest}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alerts and Badges Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Weak Subject Spotlight */}
          {weakSubjectSpotlight && (
            <div className={`p-4 rounded-xl border ${
              weakSubjectSpotlight.severity === 'critical' ? 'bg-red-50 border-red-200' :
              weakSubjectSpotlight.severity === 'warning' ? 'bg-orange-50 border-orange-200' :
              'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`w-5 h-5 ${
                  weakSubjectSpotlight.severity === 'critical' ? 'text-red-600' :
                  weakSubjectSpotlight.severity === 'warning' ? 'text-orange-600' :
                  'text-yellow-600'
                }`} />
                <h3 className="font-bold text-gray-800">Needs Attention</h3>
              </div>
              <p className="text-sm text-gray-700">{weakSubjectSpotlight.message}</p>
            </div>
          )}

          {/* Personal Best Badge */}
          {badges.length > 0 && (
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-gray-800">Personal Best!</h3>
              </div>
              <p className="text-sm text-gray-700">{badges[0].message}</p>
            </div>
          )}

          {/* Streak Tracker */}
          {Object.keys(streaks).length > 0 && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-800">Study Streaks</h3>
              </div>
              <div className="space-y-1">
                {Object.entries(streaks).slice(0, 2).map(([subject, data]) => (
                  <div key={subject} className="flex justify-between text-sm">
                    <span className="text-gray-600">{subject}:</span>
                    <span className="font-bold text-purple-700">{data.currentStreak} weeks</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Graph and Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Graph Section - Takes 3/4 width */}
          <div className="lg:col-span-3">
            {activeData && (
              <>
                {/* Key Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm"><Target className="w-5 h-5"/></div>
                    <div>
                      <p className="text-xs text-indigo-500 font-bold uppercase tracking-wide">Average</p>
                      <p className="text-lg font-extrabold text-indigo-900">{activeData.averageScore}%</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-green-600 shadow-sm"><Award className="w-5 h-5"/></div>
                    <div>
                      <p className="text-xs text-green-600 font-bold uppercase tracking-wide">Highest</p>
                      <p className="text-lg font-extrabold text-green-900">{activeData.highestScore}%</p>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-orange-600 shadow-sm"><Crosshair className="w-5 h-5"/></div>
                    <div>
                      <p className="text-xs text-orange-600 font-bold uppercase tracking-wide">Latest</p>
                      <p className="text-lg font-extrabold text-orange-900">{activeData.latestScore}%</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Current Trend</p>
                      {getTrendIcon(activeData.trend)}
                    </div>
                  </div>
                </div>

                {/* Graph */}
                <div className="h-80 w-full bg-white border border-gray-100 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={activeData.dataPoints}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={true} stroke="#D1D5DB" />
                      <XAxis 
                        dataKey="formattedDate" 
                        axisLine={{ stroke: '#9CA3AF', strokeWidth: 2 }}
                        tickLine={{ stroke: '#9CA3AF', strokeWidth: 2 }}
                        tick={{ fill: '#374151', fontSize: 14, fontWeight: 'bold' }}
                        dy={10}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        axisLine={{ stroke: '#9CA3AF', strokeWidth: 2 }}
                        tickLine={{ stroke: '#9CA3AF', strokeWidth: 2 }}
                        tick={{ fill: '#374151', fontSize: 14, fontWeight: 'bold' }}
                        dx={-10}
                      />
                      <Tooltip
                        cursor={{ stroke: '#E5E7EB', strokeWidth: 2, strokeDasharray: '5 5' }}
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: '1px solid #E5E7EB',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                          padding: '12px'
                        }}
                        itemStyle={{ fontWeight: 'bold' }}
                        formatter={(value, name, props) => [`${value}%`, "Score"]}
                        labelFormatter={(label, payload) => {
                          const title = payload && payload[0] ? payload[0].payload.label : "";
                          return (
                            <div className="mb-2 border-b border-gray-100 pb-2">
                              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
                              <div className="text-gray-800 font-bold mt-1 text-sm">{title}</div>
                            </div>
                          );
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="percentage" 
                        name="Score %"
                        stroke="#4F46E5" 
                        strokeWidth={4}
                        dot={{ 
                          r: 6, 
                          fill: '#fff', 
                          strokeWidth: 3, 
                          stroke: '#4F46E5',
                          onClick: (data) => setSelectedQuiz(data)
                        }}
                        activeDot={{ r: 8, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>

          {/* Recent Activity Sidebar - Takes 1/4 width */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-xl border border-gray-100 h-[28rem] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-800">Recent Activity</h3>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={activity.quizId}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                      selectedQuiz?.quizId === activity.quizId 
                        ? 'border-indigo-300 bg-indigo-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedQuiz(activity)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-500">{activity.subject}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        activity.performance === 'excellent' ? 'bg-green-100 text-green-700' :
                        activity.performance === 'good' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {activity.percentage}%
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">{activity.quizTitle}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.attemptedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stagnation Alerts */}
        {stagnationAlerts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              Areas Needing Attention
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stagnationAlerts.map((alert, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border ${
                    alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                    'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-800">{alert.subject}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                      'bg-orange-200 text-orange-800'
                    }`}>
                      {alert.severity === 'high' ? 'High Priority' : 'Medium Priority'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  <p className="text-xs text-gray-600 italic">{alert.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningTrajectoryGraph;
