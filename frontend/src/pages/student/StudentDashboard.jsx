import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Users, BookOpen, Award, ShoppingBag, MessageSquare, GraduationCap, LayoutDashboard, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // getting auth logout
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      // Execute global logout
      logout();
      // Navigate to the home screen
      navigate("/");
    }
  };

  const options = [
    {
      id: "Dashboard",
      title: "Dashboard Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
      action: () => setActiveTab("Dashboard")
    },
    {
      id: "PeerLearning",
      title: "Peer Learning & Kuppi",
      icon: <Users className="w-5 h-5" />,
      action: () => setActiveTab("PeerLearning")
    },
    {
      id: "GradePredictor",
      title: "Grade Predictor",
      icon: <BookOpen className="w-5 h-5" />,
      action: () => setActiveTab("GradePredictor")
    },
    {
      id: "RewardSystem",
      title: "Reward System",
      icon: <Award className="w-5 h-5" />,
      action: () => setActiveTab("RewardSystem")
    },
    {
      id: "MarketPlace",
      title: "Market Place",
      icon: <ShoppingBag className="w-5 h-5" />,
      action: () => setActiveTab("MarketPlace")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans relative overflow-hidden">
      {/* Sidebar - Matches the dark styling provided in the example */}
      <aside className={`bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out flex flex-col z-20 shadow-xl ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 bg-slate-950 border-b border-slate-800">
          {isSidebarOpen && (
            <Link to="/" className="flex items-center space-x-2 group overflow-hidden">
              <GraduationCap className="h-8 w-8 text-primary-500 group-hover:text-primary-400 shrink-0 transition-colors" />
              <span className="text-xl font-bold text-white whitespace-nowrap">EduSphere</span>
            </Link>
          )}
          {!isSidebarOpen && (
            <Link to="/" className="mx-auto">
              <GraduationCap className="h-8 w-8 text-primary-500 hover:text-primary-400 shrink-0 transition-colors" />
            </Link>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-1">
            {options.map((opt) => (
              <li key={opt.id}>
                <button
                  onClick={opt.action}
                  className={`w-full flex items-center px-4 py-3 transition-colors ${activeTab === opt.id
                      ? "bg-primary-600 text-white border-l-4 border-white"
                      : "hover:bg-slate-800 hover:text-white border-l-4 border-transparent"
                    } ${!isSidebarOpen ? "justify-center" : "space-x-3"}`}
                  title={!isSidebarOpen ? opt.title : ""}
                >
                  <div className="shrink-0">{opt.icon}</div>
                  {isSidebarOpen && <span className="text-sm font-medium whitespace-nowrap text-left truncate">{opt.title}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {options.find(o => o.id === activeTab)?.title || "Student Dashboard"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Welcome back!</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>

        {/* Dashboard Content Dynamic View Placeholder */}
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto mt-10">
            <div className="p-4 bg-primary-50 text-primary-600 rounded-full mb-4">
              {options.find(o => o.id === activeTab)?.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {options.find(o => o.id === activeTab)?.title}
            </h3>
            <p className="text-gray-500 max-w-md">
              This feature module is accessible here. Select an option from the sidebar to switch views!
            </p>
          </div>
        </main>
      </div>

      {/* Floating Chatbot Button (Stays on Bottom Right) */}
      <button
        className="fixed bottom-8 right-8 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:scale-105 transition-all z-50 flex items-center justify-center"
        onClick={() => console.log("Open Chatbot")}
        title="Open Chatbot"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}