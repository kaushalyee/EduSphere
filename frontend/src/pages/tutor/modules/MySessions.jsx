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
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

const STATUS_FILTERS = ["upcoming", "completed", "cancelled"];

const STATUS_STYLES = {
  upcoming: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("upcoming");
  const [actionLoading, setActionLoading] = useState(null); // sessionId being acted on
  const [confirmDialog, setConfirmDialog] = useState(null); // { sessionId, action }

  const token = localStorage.getItem("token");

const fetchSessions = async (status) => {
  try {
    setLoading(true);
    setError("");
    setSessions([]);

    const endpoint =
      status === "completed"
        ? "http://localhost:5000/api/sessions/completed"
        : status === "cancelled"
        ? "http://localhost:5000/api/sessions/cancelled"
        : "http://localhost:5000/api/sessions/my-sessions";

    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSessions(response.data.sessions || []);
  } catch (err) {
    setSessions([]);
    setError(err.response?.data?.message || "Failed to fetch sessions");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchSessions(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleAction = async (sessionId, action) => {
    setConfirmDialog(null);
    setActionLoading(sessionId + action);
    try {
      const url =
        action === "complete"
          ? `http://localhost:5000/api/sessions/${sessionId}/complete`
          : `http://localhost:5000/api/sessions/${sessionId}/cancel`;

      await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      // Optimistically remove from current list
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} session`);
    } finally {
      setActionLoading(null);
    }
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {confirmDialog.action === "complete"
                ? "Mark as Complete?"
                : "Cancel Session?"}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {confirmDialog.action === "complete"
                ? "This will mark the session as completed. This action cannot be undone."
                : "This will cancel the session. This action cannot be undone."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition"
              >
                Go Back
              </button>
              <button
                onClick={() =>
                  handleAction(confirmDialog.sessionId, confirmDialog.action)
                }
                className={`flex-1 px-4 py-2 rounded-xl font-medium text-white transition ${
                  confirmDialog.action === "complete"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {confirmDialog.action === "complete" ? "Confirm" : "Cancel Session"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-sm font-semibold capitalize rounded-t-lg transition border-b-2 -mb-px ${
              statusFilter === status
                ? "border-[#2F66E0] text-[#2F66E0]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-slate-600 text-lg">Loading sessions...</p>
        </div>
      ) : sortedSessions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900 capitalize">
            No {statusFilter} Sessions
          </h2>
          <p className="text-slate-500 mt-3">
            You have no {statusFilter} sessions yet.
          </p>
        </div>
      ) : (
        <>
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500 text-sm">
              {sortedSessions.length} session
              {sortedSessions.length !== 1 ? "s" : ""}
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

          {/* Sessions Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {sortedSessions.map((session) => {
              const isActing =
                actionLoading === session._id + "complete" ||
                actionLoading === session._id + "cancel";

              return (
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

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          session.mode === "online"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {session.mode}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          STATUS_STYLES[session.status] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>
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
                        <p className="font-semibold text-slate-800">
                          Description
                        </p>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {session.description}
                      </p>
                    </div>
                  )}

                  {/* Links */}
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

                  {/* Action Buttons — only for upcoming sessions */}
                  {session.status === "upcoming" && (
                    <div className="mt-5 pt-4 border-t border-slate-100 flex gap-3">
                      <button
                        disabled={isActing}
                        onClick={() =>
                          setConfirmDialog({
                            sessionId: session._id,
                            action: "complete",
                          })
                        }
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === session._id + "complete" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Mark Complete
                      </button>

                      <button
                        disabled={isActing}
                        onClick={() =>
                          setConfirmDialog({
                            sessionId: session._id,
                            action: "cancel",
                          })
                        }
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === session._id + "cancel" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
