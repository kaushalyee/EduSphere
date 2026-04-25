import React, { useState, useMemo, useEffect } from 'react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
const LearningTrajectoryGraph = () => {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedPeriod, setSelectedPeriod] = useState('All Time');
  const [targetGrade] = useState(85);
  
  const [trajectoryData, setTrajectoryData] = useState([]);
  const [scorecard, setScorecard] = useState([]);
  const [streaks, setStreaks] = useState({});
  const [badges, setBadges] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!user || (!user._id && !user.id)) {
            setError("Authentication required.");
            return;
        }
        
        const studentId = user._id || user.id;
        
        const [
          trajectoryRes,
          scorecardRes,
          streaksRes,
          personalBestRes,
          summaryRes
        ] = await Promise.all([
          api.get(`/progress/trajectory/${studentId}`),
          api.get(`/progress/trajectory/${studentId}/scorecard`),
          api.get(`/progress/trajectory/${studentId}/streaks`),
          api.get(`/progress/trajectory/${studentId}/personal-best`),
          api.get(`/progress/trajectory/${studentId}/summary`)
        ]);

        if (trajectoryRes.data.success) setTrajectoryData(trajectoryRes.data.trajectory || []);
        if (scorecardRes.data.success) setScorecard(scorecardRes.data.scorecard || []);
        if (streaksRes.data.success) setStreaks(streaksRes.data.streaks || {});
        if (personalBestRes.data.success) setBadges(personalBestRes.data.badges || []);
        if (summaryRes.data.success) setSummary(summaryRes.data || null);
        
      } catch (err) {
        console.error('Failed to load real trajectory data:', err);
        setError("Failed to fetch learning trajectory. Play some quizzes first!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const subjects = useMemo(() => {
    return scorecard.map(sc => ({
      name: sc.subject,
      score: sc.latest,
      status: sc.trend,
      trend: parseFloat((sc.latest - sc.average).toFixed(1))
    }));
  }, [scorecard]);

  const data = useMemo(() => {
    const allData = [];
    trajectoryData.forEach(traj => {
      (traj.dataPoints || []).forEach(dp => {
        const d = new Date(dp.date);
        allData.push({
          month: d.toLocaleDateString('default', { month: 'short' }) + ' ' + d.getDate(),
          score: dp.percentage,
          subject: traj.subject,
          date: dp.date
        });
      });
    });
    return allData.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [trajectoryData]);

  const stats = useMemo(() => {
    let highestScore = 0;
    let highestScoreMonth = '-';
    let studyStreak = 0;
    
    data.forEach(d => {
      if (d.score > highestScore) {
        highestScore = d.score;
        highestScoreMonth = d.month;
      }
    });

    Object.values(streaks).forEach(s => {
      if (s.currentStreak > studyStreak) studyStreak = s.currentStreak;
    });

    return {
      currentScore: summary?.overallAverage || 0,
      improvement: (summary?.improvingSubjects > 0 && summary?.subjectSummaries?.length > 0)
        ? parseFloat(((summary.improvingSubjects / summary.subjectSummaries.length) * 10).toFixed(1))
        : 0,
      highestScore,
      highestScoreMonth,
      subjectsTracked: scorecard.length,
      studyStreak,
      totalStudyHours: Math.round(data.length * 0.5) // Approximate half hour per quiz mapped
    };
  }, [summary, data, scorecard, streaks]);
  
  const milestones = useMemo(() => {
    return [
      { icon: 'trophy', title: 'First 90% score!', achieved: data.some(d => d.score >= 90), date: 'Based on quiz history' },
      { icon: 'flame', title: 'Achieved a study streak!', achieved: stats.studyStreak > 0, date: 'Consistency unlocked' },
      { icon: 'trending', title: 'Earned a personal best!', achieved: badges.length > 0, date: 'Performance height' },
      { icon: 'target', title: 'Consistent Learner', achieved: data.length >= 5, date: '5+ Quizzes done' }
    ];
  }, [data, badges, stats.studyStreak]);

  const getSmartTip = () => {
    if (data.length < 3) return "Take a few more quizzes to unlock AI-powered insights on your performance!";
    const recentScores = data.slice(-3);
    const olderScores = data.slice(-6, -3);
    
    if (olderScores.length === 0) return "Keep building your initial trajectory; you're doing great!";

    const recentAvg = recentScores.reduce((sum, item) => sum + item.score, 0) / recentScores.length;
    const olderAvg = olderScores.reduce((sum, item) => sum + item.score, 0) / olderScores.length;

    if (recentAvg < olderAvg - 5) {
      return "Your scores have dropped slightly recently. Check your weak areas to revise earlier material!";
    } else if (recentAvg > olderAvg + 5) {
      return "Great improvement! Your recent performance shows excellent progress on your target subjects.";
    } else {
      return "Steady performance mapped correctly! A little extra focused practice could push you to the next grade limit.";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'improving': return 'text-green-600 bg-green-50 border-green-200';
      case 'declining': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getMilestoneIcon = (iconType) => {
    switch (iconType) {
      case 'trophy': return <Trophy className="w-6 h-6" />;
      case 'flame': return <Flame className="w-6 h-6" />;
      case 'trending': return <TrendingUp className="w-6 h-6" />;
      case 'target': return <Target className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedSubject !== 'All Subjects') {
       filtered = data.filter(item => item.subject === selectedSubject);
    }
    
    const now = new Date();
    if (selectedPeriod === '1 Month') {
       filtered = filtered.filter(item => new Date(item.date) >= new Date(now.getTime() - 30*24*60*60*1000));
    } else if (selectedPeriod === '3 Months') {
       filtered = filtered.filter(item => new Date(item.date) >= new Date(now.getTime() - 90*24*60*60*1000));
    } else if (selectedPeriod === '6 Months') {
       filtered = filtered.filter(item => new Date(item.date) >= new Date(now.getTime() - 180*24*60*60*1000));
    }
    
    return filtered;
  }, [selectedSubject, selectedPeriod, data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const p = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{p.month}</p>
          <p className="text-sm text-gray-600">{p.subject}</p>
          <p className="text-lg font-bold text-purple-600">{p.score}%</p>
        </div>
      );
    }
    return null;
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const element = document.getElementById('trajectory-report-container');
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        scale: 2, 
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Student_Trajectory_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Failed to generate PDF report.');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!trajectoryData.length && !error) {
    return (
        <div className="flex items-center justify-center p-12">
           <div className="text-center text-gray-500 font-medium">No quiz results found. Attempt quizzes to see your trajectory map out here!</div>
        </div>
    )
  }

  return (
    <div id="trajectory-report-container" className="space-y-8 bg-gray-50 p-6 rounded-xl border border-transparent">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Learning Trajectory</h2>
        <p className="text-gray-600">Track your performance trends across different subjects based on live quiz results.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Card 1: Current Score */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Current Average</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.currentScore}%</div>
          <div className="flex items-center text-xs text-green-600 mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            Active average mapped
          </div>
        </div>

        {/* Card 2: Highest Score */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Highest Score</span>
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.highestScore}%</div>
          <div className="text-xs text-gray-600 mt-1">Achieved in {stats.highestScoreMonth}</div>
        </div>

        {/* Card 3: Subjects Tracked */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Subjects Tracked</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.subjectsTracked}</div>
          <div className="text-xs text-gray-600 mt-1">Active categories</div>
        </div>

        {/* Card 4: Study Streak */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Max Study Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.studyStreak}</div>
          <div className="text-xs text-gray-600 mt-1">Consecutive weeks</div>
        </div>
        
        {/* Card 5: Total Study Hours */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Study Hours</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalStudyHours}h</div>
          <div className="text-xs text-gray-600 mt-1">Across all {data.length} quizzes</div>
        </div>
      </div>

      {/* Time Period Selector & Export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['1 Month', '3 Months', '6 Months', 'All Time'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
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
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
          {isExporting ? 'Generating PDF...' : 'Download Report (PDF)'}
        </button>
      </div>

      {/* Graph Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Performance Over Time</h3>
          
          {/* Subject Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All Subjects">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" stroke="#6b7280" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="#6b7280" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={targetGrade} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                label={{ value: `Target: ${targetGrade}%`, position: 'topLeft', fill: '#ef4444', fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#9333ea" 
                fillOpacity={1} 
                fill="url(#colorScore)" 
                strokeWidth={3}
                activeDot={{ r: 6, fill: '#9333ea', stroke: '#fff', strokeWidth: 2 }}
                dot={{ fill: '#9333ea', r: 4, stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Breakdown Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
            Subject Breakdown
          </h3>
          <div className="space-y-3">
            {subjects.length === 0 && <p className="text-sm text-gray-500">No subjects tracked yet.</p>}
            {subjects.map((subject) => (
              <div 
                key={subject.name}
                className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(subject.status)}`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-1 rounded-md shadow-sm">
                    {getStatusIcon(subject.status)}
                  </div>
                  <span className="font-medium text-sm">{subject.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{subject.score}%</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-white flex items-center justify-center rounded-full bg-opacity-70 shadow-[0_1px_2px_rgba(0,0,0,0.05)] w-12 text-center h-6 border">
                    {subject.trend > 0 ? `+${subject.trend}` : `${subject.trend}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Badges */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Milestone Badges
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                  milestone.achieved 
                    ? 'bg-gradient-to-b from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-md' 
                    : 'bg-gray-50 border-gray-200 opacity-60 grayscale'
                }`}
              >
                <div className={`mb-3 p-3 rounded-full ${milestone.achieved ? 'bg-white shadow-sm text-orange-500' : 'bg-gray-100 text-gray-400'}`}>
                  {getMilestoneIcon(milestone.icon)}
                </div>
                <h4 className={`font-bold text-sm mb-1 ${milestone.achieved ? 'text-gray-900' : 'text-gray-500'}`}>
                  {milestone.title}
                </h4>
                <p className="text-xs text-gray-500 font-medium">{milestone.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Tip Box */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-2 rounded-lg text-purple-600 flex-shrink-0 mt-1">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-purple-900 mb-1">Smart Tip based on your data</h3>
            <p className="text-purple-800 text-sm font-medium leading-relaxed">{getSmartTip()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningTrajectoryGraph;
