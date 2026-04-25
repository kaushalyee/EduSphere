import React from "react";
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Users, 
  ShoppingBag,
  FileText,
  Target,
  Clock,
  CheckCircle
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import useAttemptConfig from "../../../hooks/useAttemptConfig";
import PuzzleChallengeCard from "../../../components/rewards/PuzzleChallengeCard";

export default function DashboardOverview({ setActiveTab }) {
  const { user } = useAuth();
  const { config } = useAttemptConfig();

  const stats = [
    {
      title: "Assignments Completed",
      value: "12",
      change: "+2 this week",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Average Grade",
      value: "85%",
      change: "+3% improvement",
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Study Streak",
      value: "7 days",
      change: "Keep it up!",
      icon: <Award className="w-5 h-5 text-orange-600" />,
      color: "bg-orange-50 border-orange-200"
    },
    {
      title: "Kuppi Sessions",
      value: "8",
      change: "+3 this month",
      icon: <Users className="w-5 h-5 text-purple-600" />,
      color: "bg-purple-50 border-purple-200"
    }
  ];

  const quickActions = [
    {
      title: "Peer Learning",
      description: "Join study groups and kuppi sessions",
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-500",
      action: () => setActiveTab("PeerLearning")
    },
    {
      title: "Marketplace",
      description: "Buy and sell educational resources",
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "bg-green-500",
      action: () => setActiveTab("Market")
    },
    {
      title: "Progress Tracking",
      description: "View your learning trajectory and analytics",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-purple-500",
      action: () => setActiveTab("Progress")
    },
    {
      title: "Rewards & Games",
      description: "Earn points and play educational games",
      icon: <Award className="w-6 h-6" />,
      color: "bg-orange-500",
      action: () => setActiveTab("Rewards")
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Student'}!</h1>
        <p className="text-blue-100 text-lg">Continue your learning journey and track your progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-xl border-2 ${stat.color}`}>
            <div className="flex items-center justify-between mb-4">
              {stat.icon}
              <span className="text-sm text-gray-600">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Assignment Submission Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Assignment Submission</h2>
              <p className="text-gray-600">Submit your assignments and get instant feedback with grade predictions</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("Progress")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Go to Assignment Submission
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <h3 className="font-medium text-gray-800">Quick Analysis</h3>
            </div>
            <p className="text-gray-600 text-sm">Get instant feedback on your assignments within minutes</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-gray-800">Grade Prediction</h3>
            </div>
            <p className="text-gray-600 text-sm">Receive predicted grades based on requirement coverage</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h3 className="font-medium text-gray-800">Improvement Tips</h3>
            </div>
            <p className="text-gray-600 text-sm">Get personalized suggestions to enhance your work</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all text-left group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Puzzle Challenge Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PuzzleChallengeCard 
            gameAttempts={config?.availableAttempts ?? 0} 
            hideBadge={true}
          />
        </div>
      </div>
    </div>
  );
}