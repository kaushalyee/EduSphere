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
import StudentProfile from "./modules/StudentProfile"; // ← add this import

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // ← add this

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      setShowProfile(false);
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

  // When switching tabs, close profile
  const handleTabChange = (tab) => {
    setShowProfile(false);
    setActiveTab(tab);
  };

  const options = [
    {
      id: "Dashboard",
      title: "Dashboard Overview",
      icon: <LayoutDashboard className="w-5 h-5 text-black" />,
    },
    {
      id: "PeerLearning",
      title: "Peer Learning & Kuppi",
      icon: <Users className="w-5 h-5 text-black" />,
    },
    {
      id: "Market",
      title: "Student Marketplace",
      icon: <ShoppingBag className="w-5 h-5 text-black" />,
    },
    {
      id: "Progress",
      title: "Progress Tracking",
      icon: <TrendingUp className="w-5 h-5 text-black" />,
    },
    {
      id: "Rewards",
      title: "Rewards & Game",
      icon: <Award className="w-5 h-5 text-black" />,
    },
  ];

  return (
    <div className="p-0">
      <StudentContent activeTab={activeTab} options={options} setActiveTab={setActiveTab} />
    </div>
  );
}
