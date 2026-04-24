import React, { useState, useEffect } from "react";
import AdminSidebar from "./components/AdminSidebar";
import StatsOverview from "./components/StatsOverview";
import MarketplaceModeration from "./components/MarketplaceModeration";
import UserManagement from "./components/UserManagement";
import api from "../../api/api";
import { AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {activeTab === "Overview" ? "Dashboard Overview" : activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-full shadow-sm border border-blue-500/20">
              Admin Portal
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {activeTab === "Overview" ? (
            <div className="max-w-7xl mx-auto space-y-8">
              {error && (
                <div className="flex items-center gap-3 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] text-rose-600">
                  <AlertCircle className="w-6 h-6" />
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <section>
                <div className="mb-6">
                  <h3 className="text-xl font-black text-gray-900">Platform Performance</h3>
                  <p className="text-gray-500 font-medium">Real-time statistics of EduSphere growth</p>
                </div>
                <StatsOverview stats={stats} loading={loading} />
              </section>

              {/* Placeholder for more cards/charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                     <AlertCircle className="w-8 h-8 text-gray-300" />
                   </div>
                   <h4 className="text-lg font-bold text-gray-900">Activity Charts</h4>
                   <p className="text-gray-500 text-sm mt-1">Growth charts and user activity maps coming soon.</p>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                     <AlertCircle className="w-8 h-8 text-gray-300" />
                   </div>
                   <h4 className="text-lg font-bold text-gray-900">Notification Hub</h4>
                   <p className="text-gray-500 text-sm mt-1">Global platform alerts and system logs coming soon.</p>
                </div>
              </div>
            </div>
          ) : activeTab === "Marketplace" ? (
            <MarketplaceModeration />
          ) : activeTab === "Users" ? (
            <UserManagement />
          ) : (
            <div className="max-w-7xl mx-auto py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">{activeTab} Section</h3>
              <p className="text-gray-500 mt-2 font-medium max-w-md px-6">
                We are currently building the {activeTab.toLowerCase()} tools for administrators. Please check back soon.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}