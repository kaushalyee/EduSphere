import React from "react";
import { Menu } from "lucide-react";

export default function StudentHeader({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  options,
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

    </header>
  );
}