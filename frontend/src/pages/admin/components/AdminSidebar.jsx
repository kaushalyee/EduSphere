import React from "react";
import {
  GraduationCap,
  LayoutDashboard,
  ShoppingBag,
  Users,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingCount = 0,
  isSidebarOpen = true,
  setIsSidebarOpen,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { id: "Overview",      title: "Dashboard Overview",      icon: LayoutDashboard },
    { id: "Marketplace",   title: "Marketplace Moderation",  icon: ShoppingBag },
    { id: "Users",         title: "User Management",         icon: Users },
    { id: "Verification",  title: "Student Verification",    icon: ShieldCheck, badge: pendingCount > 0 ? pendingCount : null },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-white h-screen sticky top-0 overflow-y-auto flex flex-col border-r border-gray-100 transition-all duration-300 shrink-0`}
    >
      {/* Branding */}
      <div className="h-16 flex items-center border-b border-gray-100 px-[18px] shrink-0">
        <GraduationCap className="text-blue-600 w-6 h-6 shrink-0" />
        {isSidebarOpen && (
          <div className="ml-2 flex items-baseline gap-1 overflow-hidden">
            <span className="text-gray-800 font-bold text-lg whitespace-nowrap">EduSphere</span>
            <span className="text-xs text-gray-500 whitespace-nowrap">ADMIN</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        <ul>
          {menuItems.map((item) => {
            const active = activeTab === item.id;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  title={!isSidebarOpen ? item.title : undefined}
                  className={`w-full flex items-center py-3 transition-all duration-200 ${
                    isSidebarOpen
                      ? `px-[22px] border-l-4 ${
                          active
                            ? "bg-blue-50 text-blue-600 font-semibold border-blue-600"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 border-transparent"
                        }`
                      : `justify-center ${
                          active
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-400 hover:bg-gray-100 hover:text-gray-800"
                        }`
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isSidebarOpen ? "mr-3" : ""
                    } ${active ? "text-blue-600" : "text-gray-400"}`}
                  />
                  {isSidebarOpen && (
                    <span className="text-sm flex-1 text-left">{item.title}</span>
                  )}
                  {isSidebarOpen && item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                  {!isSidebarOpen && item.badge && (
                    <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1.5 right-1.5" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout — pinned to bottom */}
      <div className="mt-auto border-t border-gray-100">
        <button
          onClick={handleLogout}
          title={!isSidebarOpen ? "Logout" : undefined}
          className={`w-full flex items-center py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all ${
            isSidebarOpen ? "px-[22px]" : "justify-center"
          }`}
        >
          <LogOut className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? "mr-3" : ""}`} />
          {isSidebarOpen && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
