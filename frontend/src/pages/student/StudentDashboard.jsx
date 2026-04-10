import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Users,
  ShoppingBag,
  Award,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import StudentSidebar from "./components/StudentSidebar";
import StudentHeader from "./components/StudentHeader";
import StudentContent from "./components/StudentContent";
import ChatbotButton from "./components/ChatbotButton";
import ChatbotOverlay from "./components/ChatbotOverlay";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { logout } = useAuth();

  const getInitialTab = (path) => {
    if (path.includes("progress-tracking")) return "Progress";
    if (path.includes("marketplace")) return "Market";
    if (path.includes("peer-learning") || path.includes("kuppi")) return "PeerLearning";
    return "Dashboard";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab(pathname));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Handle navigation state from assignment submission
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      window.history.replaceState({}, document.title);
    } else {
      setActiveTab(getInitialTab(pathname));
    }
  }, [location.state, pathname]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/");
    }
  };

  const options = [
    {
      id: "Dashboard",
      title: "Dashboard Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "PeerLearning",
      title: "Peer Learning & Kuppi",
      icon: <Users className="w-5 h-5" />,
    },
{
  id: "Market",
  title: "Market Place",
  icon: <ShoppingBag className="w-5 h-5" />,
},
    {
      id: "Progress",
      title: "Progress Tracking",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: "Rewards",
      title: "Rewards & Game",
      icon: <Award className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        options={options}
      />

      <div className="main-content flex-1 min-w-0 flex flex-col">
        <StudentHeader
          setIsSidebarOpen={setIsSidebarOpen}
          activeTab={activeTab}
          options={options}
          handleLogout={handleLogout}
        />

        <main className="flex-1 p-6 overflow-auto">
          <StudentContent activeTab={activeTab} options={options} setActiveTab={setActiveTab} />
        </main>
      </div>

      <ChatbotButton isOpen={isChatOpen} toggleChat={() => setIsChatOpen(!isChatOpen)} />
      {isChatOpen && <ChatbotOverlay onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}