import React from "react";
import { Menu } from "lucide-react";

export default function TutorHeader({
  activeTab,
  isSidebarOpen,
  setIsSidebarOpen,
  isNewUser = false,
  tutorName = "",
}) {
  const titles = {
    dashboard: "Dashboard Overview",
    trending: "Trending Requests",
    "create-session": "Create Session",
    "my-sessions": "My Sessions",
    profile: "Profile",
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {titles[activeTab] || "Tutor Dashboard"}
        </h1>
      </div>

      <div className="flex items-center">
        <div className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-full shadow-sm border border-blue-500/20">
          Tutor Portal
        </div>
      </div>
    </header>
  );
}
