import React from "react";
import { Menu, LogOut } from "lucide-react";

export default function StudentHeader({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  options,
  handleLogout,
}) {
  const current = options.find((o) => o.id === activeTab);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
        >
          <Menu className="w-5 h-5" />
        </button>

        {activeTab !== "Market" && (
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {current?.title || "Student Dashboard"}
            </h2>
            <p className="text-sm text-gray-500">Welcome back</p>
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </header>
  );
}