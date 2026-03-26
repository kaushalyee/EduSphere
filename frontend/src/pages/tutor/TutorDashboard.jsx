import React, { useState, useEffect } from "react";
import TutorSidebar from "./components/TutorSidebar";
import TutorHeader from "./components/TutorHeader";
import TutorContent from "./components/TutorContent";

export default function TutorDashboard() {
const [activeTab, setActiveTab] = useState(
  localStorage.getItem("tutorActiveTab") || "dashboard"
);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    // Check if this is a fresh registration
    const newUserFlag = localStorage.getItem("isNewUser");
    if (newUserFlag === "true") {
      setIsNewUser(true);
      // Clear the flag so refreshing won't show it again
      localStorage.removeItem("isNewUser");
    }
  }, []);
  useEffect(() => {
  localStorage.setItem("tutorActiveTab", activeTab);
}, [activeTab]);

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
          isNewUser={isNewUser}
          tutorName={storedUser?.name || ""}
        />

        <main className="p-6">
          <TutorContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
}
