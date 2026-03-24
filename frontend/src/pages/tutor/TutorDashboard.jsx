import React, { useState } from "react";
import TutorSidebar from "./components/TutorSidebar";
import TutorHeader from "./components/TutorHeader";
import TutorContent from "./components/TutorContent";

export default function TutorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <TutorSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        tutorName={storedUser?.name || "Tutor Name"}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <TutorHeader
          activeTab={activeTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="p-6">
          <TutorContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
}