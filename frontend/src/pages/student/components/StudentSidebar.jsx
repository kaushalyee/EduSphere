import React from "react";
import { GraduationCap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function StudentSidebar({
  isSidebarOpen,
  activeTab,
  setActiveTab,
  options,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`bg-slate-900 text-slate-300 h-screen sticky top-0 overflow-y-auto transition-all duration-300 flex flex-col ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800">
        <GraduationCap className="w-7 h-7 text-primary-500" />
        {isSidebarOpen && (
          <span className="ml-2 text-white font-bold text-lg">
            EduSphere
          </span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {options.map((opt) => (
            <li key={opt.id}>
              <button
                onClick={() => {
                  if (opt.id === "Dashboard") {
                    navigate("/student/dashboard");
                    setActiveTab("Dashboard");
                    return;
                  }

                  if (opt.id === "Rewards") {
                    navigate("/student/rewards");
                    setActiveTab("Rewards");
                    return;
                  }

                  if (opt.id === "Companion") {
                    navigate("/student/companion");
                    setActiveTab("Companion");
                    return;
                  }

                  setActiveTab(opt.id);
                }}
                className={`w-full flex items-center px-4 py-3 transition ${
                  (opt.id === "Dashboard" &&
                    isActive("/student/dashboard")) ||
                  (opt.id === "Rewards" &&
                    location.pathname.startsWith("/student/rewards")) ||
                  (opt.id === "Companion" &&
                    isActive("/student/companion")) ||
                  activeTab === opt.id
                    ? "bg-primary-600 text-white"
                    : "hover:bg-slate-800 hover:text-white"
                } ${!isSidebarOpen ? "justify-center" : "gap-3"}`}
              >
                {opt.icon}
                {isSidebarOpen && <span>{opt.title}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
