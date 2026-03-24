import React from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Flame,
  PlusSquare,
  CalendarDays,
  UserCircle2,
  LogOut,
} from "lucide-react";

export default function TutorSidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen = true,
  tutorName = "Tutor Name",
  onLogout,
}) {
  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "trending",
      title: "Trending Topics",
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

  return (
    <aside
      className={`bg-[#081530] text-white min-h-screen flex flex-col border-r border-slate-800 transition-all duration-300 ${
        isSidebarOpen ? "w-72" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-5 border-b border-slate-800">
        <GraduationCap className="w-8 h-8 text-white" />
        {isSidebarOpen && (
          <span className="ml-3 text-white font-bold text-3xl leading-none">
            EduSphere
          </span>
        )}
      </div>

      {/* Tutor profile */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-blue-600/20 flex items-center justify-center">
            <UserCircle2 className="w-7 h-7 text-blue-400" />
          </div>

          {isSidebarOpen && (
            <div>
              <p className="text-xs text-slate-400">Tutor</p>
              <h3 className="text-sm font-semibold text-white">{tutorName}</h3>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4">
        <div className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#2F66E0] text-white"
                    : "text-slate-200 hover:bg-slate-800"
                }`}
              >
                <span>{item.icon}</span>
                {isSidebarOpen && (
                  <span className="text-[18px] font-medium">{item.title}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-300 hover:bg-red-500/10 transition"
        >
          <LogOut className="w-5 h-5" />
          {isSidebarOpen && (
            <span className="text-[17px] font-medium">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}