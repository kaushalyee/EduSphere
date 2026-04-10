import React, { useEffect, useRef, useState } from "react";
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
  const [successMessage, setSuccessMessage] = useState("");
  const [sortOrder, setSortOrder] = useState("soonest");
  const [statusFilter, setStatusFilter] = useState("upcoming");
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  const fetchSessions = async (status, options = {}) => {
    const { clearSuccess = true, showLoading = true } = options;

    try {
      if (clearSuccess) setSuccessMessage("");
      setError("");

      if (showLoading) {
        setLoading(true);
        setSessions([]);
      }

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
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSessions(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleAction = async (sessionId, action) => {
    setConfirmDialog(null);
    setActionLoading(sessionId + action);

    try {
      setError("");
      setSuccessMessage("");

      const url =
        action === "complete"
          ? `http://localhost:5000/api/sessions/${sessionId}/complete`
          : `http://localhost:5000/api/sessions/${sessionId}/cancel`;

      await axios.put(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSessions((prev) => prev.filter((s) => s._id !== sessionId));

      setSuccessMessage(
        action === "complete"
          ? "Session marked as completed successfully!"
          : "Session cancelled successfully!"
      );
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} session`);
    } finally {
      setActionLoading(null);
    }
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "soonest" ? dateA - dateB : dateB - dateA;
  });

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    return new Date(dateValue).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDay = (dateValue) => {
    if (!dateValue) return "--";
    return new Date(dateValue).toLocaleDateString("en-GB", { day: "2-digit" });
  };

  const getMonth = (dateValue) => {
    if (!dateValue) return "---";
    return new Date(dateValue).toLocaleDateString("en-GB", { month: "short" });
  };

  const handleUploadClick = (sessionId) => {
    setSelectedSessionId(sessionId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedSessionId) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setError("");
      setSuccessMessage("");

      const res = await axios.post(
        `http://localhost:5000/api/quiz-results/import/${selectedSessionId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await fetchSessions(statusFilter, {
        clearSuccess: false,
        showLoading: false,
      });

      setSuccessMessage(
        `Results uploaded successfully! ${res.data.savedCount} records saved.`
      );
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      e.target.value = "";
      setSelectedSessionId(null);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {successMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {successMessage}
        </div>
      )}

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
                {confirmDialog.action === "complete"
                  ? "Confirm"
                  : "Cancel Session"}
              </button>
            </div>
          </div>
        </div>
      )}

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

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

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
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500 text-sm">
              {sortedSessions.length} session
              {sortedSessions.length !== 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white">
                <button
                  onClick={() => setSortOrder("soonest")}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    sortOrder === "soonest"
                      ? "bg-[#2F66E0] text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Soonest
                </button>
                <button
                  onClick={() => setSortOrder("latest")}
                  className={`px-4 py-2 text-sm font-medium transition border-l border-slate-200 ${
                    sortOrder === "latest"
                      ? "bg-[#2F66E0] text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Latest
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {sortedSessions.map((session) => {
              const isActing =
                actionLoading === session._id + "complete" ||
                actionLoading === session._id + "cancel";

              return (
                <div
                  key={session._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition hover:shadow-md"
                >
                  <div className="flex gap-4">
                    <div className="w-[88px] shrink-0 rounded-2xl bg-[#2F66E0] text-white flex flex-col items-center justify-center py-4 px-3">
                      <p className="text-[11px] uppercase tracking-wide opacity-90">
                        {getMonth(session.date)}
                      </p>
                      <p className="text-3xl font-bold leading-none mt-1">
                        {getDay(session.date)}
                      </p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-blue-600 mb-1">
                            {session.category}
                          </p>
                          <h3 className="text-xl font-bold text-slate-900 leading-tight">
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
                              STATUS_STYLES[session.status] ||
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {session.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2">
                          <Clock3 className="w-4 h-4 text-[#2F66E0]" />
                          <span className="text-lg font-bold text-[#2F66E0]">
                            {session.time}
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-700">
                          <CalendarDays className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {formatDate(session.date)}
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-700">
                          <Clock3 className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {session.duration} mins
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
                          {session.mode === "online" ? (
                            <Monitor className="w-5 h-5 text-slate-500" />
                          ) : (
                            <MapPin className="w-5 h-5 text-slate-500" />
                          )}
                          <span className="text-sm">
                            {session.mode === "online"
                              ? "Online Session"
                              : session.location || "No location added"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
                          <Users className="w-5 h-5 text-slate-500" />
                          <span className="text-sm">
                            Registered: {session.registeredCount}
                            {session.capacity ? ` / ${session.capacity}` : ""}
                          </span>
                        </div>
                      </div>

                      {session.description && (
                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <p className="font-semibold text-slate-800">
                              Description
                            </p>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {session.description}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
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

                      {session.status === "completed" && (
                        <div className="mt-5 pt-4 border-t border-slate-100">
                          {!session.quizLink ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-sm font-medium">
                              <BookOpen className="w-4 h-4" />
                              No Quiz for this session
                            </div>
                          ) : session.resultsUploaded ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-semibold">
                              <CheckCircle2 className="w-4 h-4" />
                              Results Uploaded
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleUploadClick(session._id)}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition"
                              >
                                <BookOpen className="w-4 h-4" />
                                Upload Quiz Results
                              </button>

                              <p className="text-xs text-slate-400 mt-2">
                                Format: Email | Marks | Total
                              </p>
                            </>
                          )}
                        </div>
                      )}

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
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}