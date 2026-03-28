import React from "react";
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
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col shadow-xl">
      {/* Branding */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="p-2 bg-primary-600 rounded-lg">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-black text-white tracking-tight">
          EduSphere <span className="text-primary-500 text-xs block -mt-1 uppercase tracking-widest font-bold">Admin</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-900/50 scale-[1.02]"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
