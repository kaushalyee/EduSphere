import React, { useState, useEffect } from "react";
import AdminSidebar from "./components/AdminSidebar";
import StatsOverview from "./components/StatsOverview";
import MarketplaceModeration from "./components/MarketplaceModeration";
import UserManagement from "./components/UserManagement";
import StudentVerification from "./components/StudentVerification";
import api from "../../api/api";
import { AlertCircle, Menu } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/admin/stats");
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          setError(response.data.message || "Failed to load dashboard stats");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Connection error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "Overview") {
      fetchStats();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await api.get("/admin/verifications/pending");
        if (res.data.success) setPendingCount(res.data.data.length);
      } catch {
        // non-critical — badge simply won't show
      }
    };
    fetchPendingCount();
  }, [activeTab]);

  const PAGE_TITLES = {
    Overview: "Dashboard Overview",
    Marketplace: "Marketplace Moderation",
    Users: "User Management",
    Verification: "Student Verification",
  };
  const currentPageTitle = PAGE_TITLES[activeTab] || activeTab;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">{currentPageTitle}</h1>
              <p className="text-sm text-gray-500">Welcome back</p>
            <div className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-full shadow-sm border border-blue-500/20">
              Admin Portal
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "Overview" ? (
            <div className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <StatsOverview stats={stats} loading={loading} />
            </div>
          ) : activeTab === "Marketplace" ? (
            <MarketplaceModeration />
          ) : activeTab === "Users" ? (
            <UserManagement />
          ) : activeTab === "Verification" ? (
            <StudentVerification />
          ) : (
            <div className="py-20 bg-white rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-10 h-10 text-gray-300 mb-4" />
              <h3 className="text-base font-bold text-gray-800">{activeTab} Section</h3>
              <p className="text-gray-500 mt-1 text-sm max-w-md">
                This section is coming soon.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}