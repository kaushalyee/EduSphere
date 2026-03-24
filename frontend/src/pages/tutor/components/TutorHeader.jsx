import React from "react";
import { Menu } from "lucide-react";

export default function TutorHeader({
  activeTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const titles = {
    dashboard: "Dashboard Overview",
    trending: "Trending Topics",
    "create-session": "Create Session",
    "my-sessions": "My Sessions",
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="text-slate-600 hover:text-slate-900"
      >
        <Menu className="w-7 h-7" />
      </button>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {titles[activeTab] || "Tutor Dashboard"}
        </h1>
        <p className="text-slate-500 text-lg">Welcome back</p>
      </div>
    </header>
  );
}