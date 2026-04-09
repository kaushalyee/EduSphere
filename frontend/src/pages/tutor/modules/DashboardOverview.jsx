import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    online: 0,
    offline: 0,
  });

  const [nextSession, setNextSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [upcomingRes, completedRes, cancelledRes] = await Promise.all([
          axios.get("/api/sessions/my-sessions", { headers }),
          axios.get("/api/sessions/completed", { headers }),
          axios.get("/api/sessions/cancelled", { headers }),
        ]);

        const upcomingSessions = upcomingRes.data.sessions || [];
        const completedSessions = completedRes.data.sessions || [];
        const cancelledSessions = cancelledRes.data.sessions || [];

        const allSessions = [
          ...upcomingSessions,
          ...completedSessions,
          ...cancelledSessions,
        ];

        // 🔥 Find next upcoming session
        const sortedUpcoming = [...upcomingSessions].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setNextSession(sortedUpcoming[0] || null);

        setStats({
          total: allSessions.length,
          upcoming: upcomingSessions.length,
          completed: completedSessions.length,
          cancelled: cancelledSessions.length,
          online: allSessions.filter((s) => s.mode === "online").length,
          offline: allSessions.filter((s) => s.mode === "offline").length,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const cards = [
    { title: "Total", value: stats.total, color: "text-blue-600" },
    { title: "Upcoming", value: stats.upcoming, color: "text-amber-600" },
    { title: "Completed", value: stats.completed, color: "text-emerald-600" },
    { title: "Cancelled", value: stats.cancelled, color: "text-red-600" },
    { title: "Online", value: stats.online, color: "text-sky-600" },
    { title: "Offline", value: stats.offline, color: "text-violet-600" },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition"
          >
            <p className="text-xs text-gray-500">{card.title}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* 🔥 NEXT SESSION */}
      <div className="mt-8">
        {nextSession ? (
          <div className="bg-gradient-to-r from-[#2F66E0] to-blue-500 text-white p-6 rounded-2xl shadow-lg">
            <p className="text-sm opacity-80">Next Session</p>

            <h2 className="text-2xl font-bold mt-1">
              {nextSession.topic}
            </h2>

            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <span>📅 {formatDate(nextSession.date)}</span>
              <span>⏰ {nextSession.time}</span>
              <span>📍 {nextSession.mode}</span>
            </div>

            <p className="mt-3 text-sm opacity-90">
              Get ready for your next session!
            </p>
          </div>
        ) : (
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border text-center">
            <p className="text-gray-500">No upcoming sessions</p>
          </div>
        )}
      </div>

      {/* 🔥 OVERVIEW TEXT */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-bold mb-3 text-gray-800">
          Tutor Summary
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed">
          You have created{" "}
          <span className="font-semibold text-blue-600">
            {stats.total}
          </span>{" "}
          sessions. Currently,{" "}
          <span className="text-amber-600 font-semibold">
            {stats.upcoming}
          </span>{" "}
          are upcoming,{" "}
          <span className="text-emerald-600 font-semibold">
            {stats.completed}
          </span>{" "}
          completed, and{" "}
          <span className="text-red-600 font-semibold">
            {stats.cancelled}
          </span>{" "}
          cancelled.
        </p>
      </div>
    </div>
  );
}