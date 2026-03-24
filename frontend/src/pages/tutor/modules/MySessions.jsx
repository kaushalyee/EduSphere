import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  Clock3,
  Monitor,
  MapPin,
  Users,
  BookOpen,
  FileText,
  Link as LinkIcon,
  ArrowUpDown,
} from "lucide-react";

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchMySessions = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/sessions/my-sessions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSessions(response.data.sessions || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch your sessions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMySessions();
  }, []);

const sortedSessions = [...sessions].sort((a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
});
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <p className="text-slate-600 text-lg">Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-900">No Sessions Yet</h2>
        <p className="text-slate-500 mt-3">
          You have not created any sessions yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-500 text-sm">
          {sortedSessions.length} session{sortedSessions.length !== 1 ? "s" : ""}
        </p>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white">
            <button
              onClick={() => setSortOrder("newest")}
              className={`px-4 py-2 text-sm font-medium transition ${
                sortOrder === "newest"
                  ? "bg-[#2F66E0] text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortOrder("oldest")}
              className={`px-4 py-2 text-sm font-medium transition border-l border-slate-200 ${
                sortOrder === "oldest"
                  ? "bg-[#2F66E0] text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Oldest
            </button>
          </div>
        </div>
      </div>

      {/* Sessions grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {sortedSessions.map((session) => (
          <div
            key={session._id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-2">
                  {session.category}
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {session.topic}
                </h3>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  session.mode === "online"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {session.mode}
              </span>
            </div>

            <div className="space-y-3 text-slate-600">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-slate-500" />
                <span>{formatDate(session.date)}</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock3 className="w-5 h-5 text-slate-500" />
                <span>
                  {session.time} · {session.duration} mins
                </span>
              </div>

              <div className="flex items-center gap-3">
                {session.mode === "online" ? (
                  <Monitor className="w-5 h-5 text-slate-500" />
                ) : (
                  <MapPin className="w-5 h-5 text-slate-500" />
                )}
                <span>
                  {session.mode === "online"
                    ? "Online Session"
                    : session.location || "No location added"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-slate-500" />
                <span>
                  Registered: {session.registeredCount}
                  {session.capacity ? ` / ${session.capacity}` : ""}
                </span>
              </div>
            </div>

            {session.description && (
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <p className="font-semibold text-slate-800">Description</p>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {session.description}
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              {session.meetingLink && (
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                >
                  <LinkIcon className="w-4 h-4" />
                  Meeting Link
                </a>
              )}

              {session.quizLink && (
                <a
                  href={session.quizLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition"
                >
                  <BookOpen className="w-4 h-4" />
                  Quiz Link
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
