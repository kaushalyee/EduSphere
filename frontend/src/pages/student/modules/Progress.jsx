import React, { useState } from 'react';
import LearningTrajectoryGraph from '../../../components/progress/LearningTrajectoryGraph';
import SmartComparison from '../../../components/progress/SmartComparison';
import AssignmentSubmission from '../../../components/progress/AssignmentSubmission';
import { 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Info,
  ArrowRight,
  Target,
  Award,
  Clock
} from 'lucide-react';

const Progress = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch(activeTab) {
      case 'trajectory':
        return <LearningTrajectoryGraph />;
      case 'comparison':
        return <SmartComparison />;
      case 'assignment':
        return <AssignmentSubmission />;
      default:
        return <OverviewTab onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Progress Management</h1>
          <p className="text-gray-600">Track your academic growth, compare performance, and improve your assignments</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-wrap p-2 gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'trajectory', label: 'Learning Trajectory', icon: TrendingUp },
              { id: 'comparison', label: 'Smart Comparison', icon: BarChart3 },
              { id: 'assignment', label: 'Assignment Submission', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ onNavigate }) => {
  const features = [
    {
      id: 'trajectory',
      title: 'Learning Trajectory Graph',
      description: 'Visualize your academic progress over time with detailed analytics and insights',
      icon: TrendingUp,
      color: 'indigo',
      features: [
        'Track performance trends across subjects',
        'Identify strengths and weaknesses',
        'Monitor streaks and consistency',
        'Get personalized recommendations'
      ],
      stats: { label: 'Subjects Tracked', value: '3+', icon: Target }
    },
    {
      id: 'comparison',
      title: 'Smart Comparison',
      description: 'Compare your progress with your past self and current growth rate in a healthy way',
      icon: BarChart3,
      color: 'green',
      features: [
        'Compare with past performance',
        'Analyze growth rate trends',
        'Identify improvement areas',
        'Set realistic goals'
      ],
      stats: { label: 'Improvement Insights', value: 'Real-time', icon: Award }
    },
    {
      id: 'assignment',
      title: 'Assignment Submission',
      description: 'Know before you go, upload your assignment draft and get your grade prediction instantly',
      icon: FileText,
      color: 'purple',
      features: [
        'Pre-submission grade prediction',
        'Weak area identification',
        'Rubric compliance check',
        'Instant feedback'
      ],
      stats: { label: 'Avg. Time Saved', value: '2hrs', icon: Clock }
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Progress Management System</h2>
        <p className="text-xl font-semibold text-gray-700 mb-2">Track. Compare. Improve.</p>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Three intelligent modules that turn raw academic data into meaningful insights helping every student understand where they stand, how far they've come, and where to focus next.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div 
            key={feature.id}
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${feature.color}-100 rounded-lg`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
              </div>
              <div className={`px-3 py-1 bg-${feature.color}-50 text-${feature.color}-700 rounded-full text-xs font-semibold`}>
                {feature.stats.label}
              </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{feature.description}</p>

            {/* Features List */}
            <ul className="space-y-2 mb-6">
              {feature.features.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className={`w-1.5 h-1.5 bg-${feature.color}-500 rounded-full`} />
                  {item}
                </li>
              ))}
            </ul>

            {/* Action Button */}
            <button
              onClick={() => onNavigate(feature.id)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-${feature.color}-600 text-white rounded-lg font-medium hover:bg-${feature.color}-700 transition-colors`}
            >
              Explore {feature.title}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Your Progress at a Glance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Quizzes', value: '12', change: '+2 this week', positive: true },
            { label: 'Average Score', value: '82%', change: '+5% improvement', positive: true },
            { label: 'Study Streak', value: '3 weeks', change: 'Keep it up!', positive: true },
            { label: 'Assignments', value: '8', change: '2 pending review', positive: false }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
              <p className={`text-xs font-medium ${stat.positive ? 'text-green-600' : 'text-orange-600'}`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;