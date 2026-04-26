import React from "react";
import { GraduationCap, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function TutorSidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen = false,
  setIsSidebarOpen,
  menuItems = [],
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
      className={`bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <button
        onClick={() => setActiveTab("dashboard")}
        className={`h-16 flex items-center border-b border-gray-100 w-full text-left hover:bg-gray-50 transition-colors flex-shrink-0 ${
          isSidebarOpen ? "px-[18px]" : "justify-center px-0"
        }`}
      >
        <GraduationCap className="w-7 h-7 flex-shrink-0 text-blue-600" />
        {isSidebarOpen && (
          <span className="ml-4 text-gray-800 font-bold text-lg whitespace-nowrap">
            EduSphere
          </span>
        )}
      </button>

      {/* Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const active = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center py-3 transition-all duration-200 ${
                    active
                      ? "bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 border-l-4 border-transparent"
                  } ${isSidebarOpen ? "px-[22px]" : "justify-center px-0"}`}
                >
                  <div
                    className={`flex-shrink-0 ${
                      active ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {item.icon}
                  </div>

                  {isSidebarOpen && (
                    <span className="ml-3 text-sm font-medium whitespace-nowrap">
                      {item.title}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100 mt-auto flex-shrink-0 bg-white">
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              logout();
              navigate("/");
            }
          }}
          className={`w-full flex items-center py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-xl ${
            isSidebarOpen ? "px-[22px]" : "justify-center px-0"
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isSidebarOpen && (
            <span className="font-semibold ml-3 whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}