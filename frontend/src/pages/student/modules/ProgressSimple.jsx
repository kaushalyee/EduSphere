import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import AssignmentSubmissionWithRubric from '../../../components/assignments/AssignmentSubmissionWithRubric';
import LearningTrajectoryGraph from '../../../components/progress/LearningTrajectoryGraphSimple';
import SmartComparison from '../../../components/progress/SmartComparisonSimple';

const ProgressSimple = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleSubmissionComplete = (result) => {
    console.log('Submission completed:', result);
    alert('Assignment submitted successfully! Check the analysis results.');
  };

  const handleBackToDashboard = () => {
    // Navigate back to student dashboard
    navigate('/student/dashboard');
  };

  const handleBackToOverview = () => {
    // Navigate back to overview tab within progress
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                title="Back to Dashboard"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              {activeTab !== 'overview' && (
                <button
                  onClick={handleBackToOverview}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 transition-colors"
                  title="Back to Overview"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Overview</span>
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Progress Tracking System
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Student Progress Management</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-wrap p-2 gap-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'trajectory', label: 'Learning Trajectory' },
              { id: 'comparison', label: 'Smart Comparison' },
              { id: 'assignment', label: 'Assignment Submission' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {activeTab === 'assignment' && (
            <AssignmentSubmissionWithRubric 
              assignment={{ title: 'Demo Assignment', _id: 'default-assignment-id' }}
              onSubmissionComplete={handleSubmissionComplete}
            />
          )}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Progress Management System</h2>
                <p className="text-xl font-semibold text-gray-700 mb-2">Track. Compare. Improve.</p>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Three intelligent modules that turn raw academic data into meaningful insights helping every student understand where they stand, how far they've come, and where to focus next.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl border border-blue-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-500 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                      Subjects Tracked
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Learning Trajectory Graph</h3>
                  <p className="text-gray-600 text-sm mb-4">Visualize your academic progress over time with detailed analytics and insights</p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Track performance trends across subjects
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Identify strengths and weaknesses
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Monitor streaks and consistency
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Get personalized recommendations
                    </li>
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => setActiveTab('trajectory')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Explore Learning Trajectory
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="bg-gradient-to-br from-white to-green-50 rounded-xl border border-green-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-500 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                      Improvement Insights
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Smart Comparison</h3>
                  <p className="text-gray-600 text-sm mb-4">Compare your progress with your past self and current growth rate in a healthy way</p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Compare with past performance
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Analyze growth rate trends
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Identify improvement areas
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Set realistic goals
                    </li>
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => setActiveTab('comparison')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Explore Smart Comparison
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl border border-purple-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-500 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">
                      Avg. Time Saved
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Assignment Submission</h3>
                  <p className="text-gray-600 text-sm mb-4">Know before you go, upload your assignment draft and get your grade prediction instantly</p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      Pre-submission grade prediction
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      Weak area identification
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      Rubric compliance check
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      Instant feedback
                    </li>
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => setActiveTab('assignment')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Explore Assignment Submission
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Your Progress at a Glance</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Total Quizzes</p>
                    <p className="text-2xl font-bold text-gray-800 mb-1">12</p>
                    <p className="text-xs font-medium text-green-600">+2 this week</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Average Score</p>
                    <p className="text-2xl font-bold text-gray-800 mb-1">82%</p>
                    <p className="text-xs font-medium text-green-600">+5% improvement</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Study Streak</p>
                    <p className="text-2xl font-bold text-gray-800 mb-1">3</p>
                    <p className="text-xs font-medium text-green-600">weeks</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Assignments</p>
                    <p className="text-2xl font-bold text-gray-800 mb-1">8</p>
                    <p className="text-xs font-medium text-orange-600">2 pending</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'trajectory' && <LearningTrajectoryGraph />}
          {activeTab === 'comparison' && <SmartComparison />}
        </div>
      </div>
    </div>
  );
};

export default ProgressSimple;
