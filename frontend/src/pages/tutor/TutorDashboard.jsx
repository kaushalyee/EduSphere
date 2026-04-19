import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Flame,
  PlusSquare,
  CalendarDays,
} from "lucide-react";

import TutorSidebar from "./components/TutorSidebar";
import TutorHeader from "./components/TutorHeader";
import TutorContent from "./components/TutorContent";

export default function TutorDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("tutorActiveTab") || "dashboard"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [selectedTrendingTopic, setSelectedTrendingTopic] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "trending",
      title: "Trending Requests",
      icon: <Flame className="w-5 h-5" />,
    },
    {
      id: "create-session",
      title: "Create Session",
      icon: <PlusSquare className="w-5 h-5" />,
    },
    {
      id: "my-sessions",
      title: "My Sessions",
      icon: <CalendarDays className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    const newUserFlag = localStorage.getItem("isNewUser");
    if (newUserFlag === "true") {
      setIsNewUser(true);
      localStorage.removeItem("isNewUser");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tutorActiveTab", activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TutorSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        menuItems={menuItems}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TutorHeader
          activeTab={activeTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isNewUser={isNewUser}
          tutorName={storedUser?.name || ""}
        />

        <main className="flex-1 p-6 overflow-auto min-w-0">
          <TutorContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedTrendingTopic={selectedTrendingTopic}
            setSelectedTrendingTopic={setSelectedTrendingTopic}
          />
        </main>
      </div>
    </div>
  );
}