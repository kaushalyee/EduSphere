import React from "react";
import { GraduationCap, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function TutorSidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen = true,
  tutorName = "Tutor Name",
  menuItems = [],
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto transition-all duration-300 flex flex-col ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <GraduationCap className="w-7 h-7 text-blue-600" />
        {isSidebarOpen && (
          <span className="ml-2 text-gray-800 font-bold text-lg">EduSphere</span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 transition-all duration-200 ${
                    active
                      ? "bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 border-l-4 border-transparent"
                  } ${!isSidebarOpen ? "justify-center" : "gap-3"}`}
                >
                  <div className={active ? "text-blue-600" : "text-gray-400"}>
                    {item.icon}
                  </div>
                  {isSidebarOpen && <span>{item.title}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              logout();
              navigate("/");
            }
          }}
          className={`w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-xl ${
            !isSidebarOpen ? "justify-center" : "gap-3"
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isSidebarOpen && <span className="font-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  );
}