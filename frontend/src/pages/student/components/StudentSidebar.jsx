import React from "react";
import { GraduationCap } from "lucide-react";

export default function StudentSidebar({
  isSidebarOpen,
  activeTab,
  setActiveTab,
  options,
}) {
  return (
    <aside
      className={`bg-slate-900 text-slate-300 h-screen transition-all duration-300 flex flex-col ${
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
                onClick={() => setActiveTab(opt.id)}
                className={`w-full flex items-center px-4 py-3 transition ${
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