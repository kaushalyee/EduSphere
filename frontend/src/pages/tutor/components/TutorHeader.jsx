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

  const greeting = isNewUser
    ? `Welcome${tutorName ? `, ${tutorName}` : ""}! Let's get started.`
    : `Welcome back${tutorName ? `, ${tutorName}` : ""}!`;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {titles[activeTab] || "Tutor Dashboard"}
        </h1>
        <p className="text-slate-500 text-lg">{greeting}</p>
      </div>
    </header>
  );
}
