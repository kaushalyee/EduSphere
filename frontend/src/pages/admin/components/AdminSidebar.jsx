import React, { useState } from "react";
import { 
  GraduationCap, 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  LogOut 
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    {
      id: "Overview",
      title: "Dashboard Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "Marketplace",
      title: "Marketplace Moderation",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      id: "Users",
      title: "User Management",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
        isHovered ? "w-64" : "w-20"
      }`}
    >
      {/* Branding */}
      <div className={`h-20 flex items-center border-b border-gray-100 w-full text-left transition-all ${
        isHovered ? "px-[18px]" : "justify-center px-0"
      }`}>
        <GraduationCap className="w-7 h-7 flex-shrink-0 text-blue-600" />
        {isHovered && (
          <span className="ml-4 text-gray-800 font-bold text-lg whitespace-nowrap transition-opacity duration-300">
            EduSphere <span className="text-blue-500 text-xs inline-block ml-1 uppercase tracking-widest font-bold">Admin</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`sidebar-item w-full flex items-center py-3 transition-all duration-200 ${
                    active
                      ? "active bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 border-l-4 border-transparent"
                  } ${isHovered ? "px-[22px]" : "justify-center px-0"}`}
                >
                  <div className={`flex-shrink-0 ${active ? "text-blue-600" : "text-gray-400"}`}>
                    {item.icon}
                  </div>
                  {isHovered && (
                    <span className="ml-3 text-sm font-medium whitespace-nowrap transition-opacity duration-300">
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
          onClick={handleLogout}
          className={`w-full flex items-center py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-xl ${
            isHovered ? "px-[22px]" : "justify-center px-0"
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isHovered && (
            <span className="font-semibold ml-3 whitespace-nowrap transition-opacity duration-300">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
