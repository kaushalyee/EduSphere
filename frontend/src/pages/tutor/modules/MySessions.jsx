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
  Archive,
  Filter,
  AlertTriangle,
} from "lucide-react";

const STATUS_FILTERS = ["upcoming", "completed", "cancelled", "archived"];

const STATUS_STYLES = {
  upcoming: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editErrors, setEditErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [sortOrder, setSortOrder] = useState("soonest");
  const [statusFilter, setStatusFilter] = useState("upcoming");
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [uploadingSessionId, setUploadingSessionId] = useState(null);

  // ── Archive undo state ─────────────────────────────────────────────────────
  const [undoToast, setUndoToast] = useState(null);
  const undoTimerRef = useRef(null);

  // ── Archived tab filters ───────────────────────────────────────────────────
  const [archivedStatusFilter, setArchivedStatusFilter] = useState("all");
  const [archivedDateFilter, setArchivedDateFilter] = useState("all");
  // Option 2: Pending results filter in archived tab
  const [archivedPendingOnly, setArchivedPendingOnly] = useState(false);

  // ── Completed tab filters ──────────────────────────────────────────────────
  const [completedDateFilter, setCompletedDateFilter] = useState("all");
  const [completedPendingOnly, setCompletedPendingOnly] = useState(false);

  // ── Cancelled tab filters ──────────────────────────────────────────────────
  const [cancelledDateFilter, setCancelledDateFilter] = useState("all");

  // ── Option 1: Archive warning dialog ──────────────────────────────────────
  const [archiveWarningDialog, setArchiveWarningDialog] = useState(null);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  const fetchSessions = async (status, options = {}) => {
    const { clearSuccess = true, showLoading = true } = options;
    try {
      if (clearSuccess) setSuccessMessage("");
      setError("");
      if (showLoading) { setLoading(true); setSessions([]); }

      const endpoint =
        status === "completed"
          ? "http://localhost:5000/api/sessions/completed"
          : status === "cancelled"
            ? "http://localhost:5000/api/sessions/cancelled"
            : status === "archived"
              ? "http://localhost:5000/api/sessions/archived"
              : "http://localhost:5000/api/sessions/my-sessions";

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(response.data.sessions || []);
    } catch (err) {
      setSessions([]);
      setError(err.response?.data?.message || "Failed to fetch sessions");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(statusFilter);
    if (statusFilter !== "archived") {
      setArchivedStatusFilter("all");
      setArchivedDateFilter("all");
      setArchivedPendingOnly(false);
    }
    setCompletedDateFilter("all");
    setCompletedPendingOnly(false);
    setCancelledDateFilter("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // ── Date filter helper ─────────────────────────────────────────────────────
  const getFilteredByDate = (list, dateFilter, dateField = "date") => {
    if (dateFilter === "all") return list;
    const now = new Date();
    return list.filter((s) => {
      const d = new Date(s[dateField]);
      if (dateFilter === "week") {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        return d >= start && d <= end;
      }
      if (dateFilter === "month") {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (dateFilter === "3months") {
        const cutoff = new Date();
        cutoff.setMonth(now.getMonth() - 3);
        return d >= cutoff;
      }
      return true;
    });
  };

  // ── Client-side filter for archived tab ───────────────────────────────────
  const getFilteredArchivedSessions = (list) => {
    let filtered = [...list];
    if (archivedStatusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === archivedStatusFilter);
    }
    if (archivedDateFilter !== "all") {
      const cutoff = new Date();
      if (archivedDateFilter === "month") cutoff.setMonth(cutoff.getMonth() - 1);
      else if (archivedDateFilter === "3months") cutoff.setMonth(cutoff.getMonth() - 3);
      filtered = filtered.filter((s) => new Date(s.archivedAt) >= cutoff);
    }
    // Option 2: filter by pending results
    if (archivedPendingOnly) {
      filtered = filtered.filter((s) => s.quizLink && !s.resultsUploaded);
    }
    return filtered;
  };

  // ── Option 1: Archive click — check if pending results ────────────────────
  const handleArchiveClick = (session) => {
    const hasPendingResults = session.quizLink && !session.resultsUploaded;
    if (hasPendingResults) {
      setArchiveWarningDialog(session);
    } else {
      handleArchive(session);
    }
  };

  // ── Archive handler ────────────────────────────────────────────────────────
  const handleArchive = async (session) => {
    setArchiveWarningDialog(null);
    setActionLoading(session._id + "archive");
    try {
      setError("");
      await axios.put(
        `http://localhost:5000/api/sessions/${session._id}/archive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions((prev) => prev.filter((s) => s._id !== session._id));

      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      const timer = setTimeout(() => setUndoToast(null), 5000);
      setUndoToast({ sessionId: session._id, sessionData: session });
      undoTimerRef.current = timer;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to archive session");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Undo archive ───────────────────────────────────────────────────────────
  const handleUndoArchive = async () => {
    if (!undoToast) return;
    clearTimeout(undoTimerRef.current);
    const { sessionId, sessionData } = undoToast;
    setUndoToast(null);
    try {
      await axios.put(
        `http://localhost:5000/api/sessions/${sessionId}/restore`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions((prev) =>
        [...prev, sessionData].sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    } catch (err) {
      setError("Failed to undo archive");
    }
  };

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
      await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
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

  // ── Build sorted + filtered session list ──────────────────────────────────
  let sortedSessions = [...sessions].sort((a, b) =>
    sortOrder === "soonest"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date)
  );

  if (statusFilter === "archived") {
    sortedSessions = getFilteredArchivedSessions(sortedSessions);
  }
  if (statusFilter === "completed") {
    sortedSessions = getFilteredByDate(sortedSessions, completedDateFilter);
    if (completedPendingOnly) {
      sortedSessions = sortedSessions.filter((s) => s.quizLink && !s.resultsUploaded);
    }
  }
  if (statusFilter === "cancelled") {
    sortedSessions = getFilteredByDate(sortedSessions, cancelledDateFilter);
  }

  const isFiltered =
    (statusFilter === "archived" && (archivedStatusFilter !== "all" || archivedDateFilter !== "all" || archivedPendingOnly)) ||
    (statusFilter === "completed" && (completedDateFilter !== "all" || completedPendingOnly)) ||
    (statusFilter === "cancelled" && cancelledDateFilter !== "all");

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
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
      setUploadingSessionId(selectedSessionId);
      const res = await axios.post(
        `http://localhost:5000/api/quiz-results/import/${selectedSessionId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      await fetchSessions(statusFilter, { clearSuccess: false, showLoading: false });
      setSuccessMessage(`Results uploaded successfully! ${res.data.savedCount} records saved.`);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      e.target.value = "";
      setSelectedSessionId(null);
      setUploadingSessionId(null);
    }
  };

  const [editingSession, setEditingSession] = useState(null);
  const [editForm, setEditForm] = useState({
    date: "", time: "", duration: 60, quizLink: "",
    meetingLink: "", location: "", description: "", capacity: "",
  });

  const handleEditClick = (session) => {
    setError(""); setSuccessMessage(""); setEditErrors({});
    setEditingSession(session);
    setEditForm({
      date: session.date ? new Date(session.date).toISOString().split("T")[0] : "",
      time: session.time || "",
      duration: session.duration || 60,
      quizLink: session.quizLink || "",
      meetingLink: session.meetingLink || "",
      location: session.location || "",
      description: session.description || "",
      capacity: session.capacity || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEditForm = () => {
    const newErrors = {};
    if (!editForm.date) newErrors.date = "Date is required";
    if (!editForm.time) newErrors.time = "Time is required";
    const today = new Date().toISOString().split("T")[0];
    if (editForm.date && editForm.date < today) newErrors.date = "Past dates cannot be selected";
    if (!editForm.duration || Number(editForm.duration) < 30) newErrors.duration = "Duration must be at least 30 minutes";
    if (Number(editForm.duration) > 480) newErrors.duration = "Duration cannot exceed 480 minutes";
    if (editingSession?.mode === "online") {
      if (!editForm.meetingLink.trim()) newErrors.meetingLink = "Meeting link is required";
      else { try { new URL(editForm.meetingLink); } catch { newErrors.meetingLink = "Please enter a valid meeting link"; } }
    }
    if (editingSession?.mode === "offline") {
      if (!editForm.location.trim()) newErrors.location = "Location is required";
      else if (editForm.location.trim().length < 3) newErrors.location = "Please enter a more specific location";
    }
    if (editForm.quizLink) { try { new URL(editForm.quizLink); } catch { newErrors.quizLink = "Please enter a valid quiz link"; } }
    if (editForm.capacity && Number(editForm.capacity) < 1) newErrors.capacity = "Capacity must be at least 1";
    if (editForm.capacity && Number(editForm.capacity) > 500) newErrors.capacity = "Capacity cannot exceed 500";
    if (editForm.capacity && editingSession?.registeredCount && Number(editForm.capacity) < Number(editingSession.registeredCount))
      newErrors.capacity = `Capacity cannot be less than registered count (${editingSession.registeredCount})`;
    if (editForm.description && editForm.description.trim().length > 0 && editForm.description.trim().length < 10)
      newErrors.description = "Description should be at least 10 characters";
    if (editForm.description && editForm.description.trim().length > 1000)
      newErrors.description = "Description cannot exceed 1000 characters";
    return newErrors;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingSession) return;
    const validationErrors = validateEditForm();
    setEditErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    try {
      setError(""); setSuccessMessage("");
      setActionLoading(editingSession._id + "edit");
      const payload = {
        date: editForm.date, time: editForm.time, duration: Number(editForm.duration),
        quizLink: editForm.quizLink, meetingLink: editForm.meetingLink,
        location: editForm.location, description: editForm.description,
        capacity: editForm.capacity ? Number(editForm.capacity) : null,
      };
      const res = await axios.put(
        `http://localhost:5000/api/sessions/${editingSession._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions((prev) => prev.map((s) => (s._id === editingSession._id ? res.data.session : s)));
      setEditingSession(null); setEditErrors({});
      setSuccessMessage("Session updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update session");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx,.xls" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      {/* ── Success toast ── */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-emerald-500 px-8 py-5 text-lg font-semibold text-white shadow-2xl">
          {successMessage}
        </div>
      )}

      {/* ── Undo archive toast ── */}
      {undoToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl">
          <Archive className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium">Session archived</span>
          <button
            onClick={handleUndoArchive}
            className="text-sm font-bold text-blue-400 hover:text-blue-300 transition underline underline-offset-2"
          >
            Undo
          </button>
        </div>
      )}

      {/* ── Option 1: Archive warning dialog (pending results) ── */}
      {archiveWarningDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Quiz Results Not Uploaded</h3>
            </div>
            <p className="text-slate-500 text-sm mb-1">
              This session has a quiz link but results haven't been uploaded yet.
            </p>
            <p className="text-slate-400 text-xs mb-6">
              You can still find it in the Archived tab under <span className="font-semibold text-amber-500">⏳ Pending Results</span>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setArchiveWarningDialog(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition"
              >
                Go Back
              </button>
              <button
                onClick={() => handleArchive(archiveWarningDialog)}
                className="flex-1 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition"
              >
                Archive Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit modal ── */}
      {editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Edit Session</h3>
            <div className="mb-4 text-sm text-slate-600">
              <p><strong>Category:</strong> {editingSession.category}</p>
              <p><strong>Topic:</strong> {editingSession.topic}</p>
              <p><strong>Mode:</strong> {editingSession.mode}</p>
            </div>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <input type="date" name="date" value={editForm.date} onChange={handleEditChange} min={new Date().toISOString().split("T")[0]} className={`border rounded-xl px-4 py-3 ${editErrors.date ? "border-red-400" : ""}`} />
                {editErrors.date && <p className="text-red-500 text-xs px-1">{editErrors.date}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <input type="time" name="time" value={editForm.time} onChange={handleEditChange} className={`border rounded-xl px-4 py-3 ${editErrors.time ? "border-red-400" : ""}`} />
                {editErrors.time && <p className="text-red-500 text-xs px-1">{editErrors.time}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <input type="number" name="duration" value={editForm.duration} onChange={handleEditChange} placeholder="Duration (mins)" min="30" className={`border rounded-xl px-4 py-3 ${editErrors.duration ? "border-red-400" : ""}`} />
                {editErrors.duration && <p className="text-red-500 text-xs px-1">{editErrors.duration}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <input type="number" name="capacity" value={editForm.capacity} onChange={handleEditChange} placeholder="Capacity (optional)" min="1" className={`border rounded-xl px-4 py-3 ${editErrors.capacity ? "border-red-400" : ""}`} />
                {editErrors.capacity && <p className="text-red-500 text-xs px-1">{editErrors.capacity}</p>}
              </div>
              {editingSession.mode === "online" ? (
                <div className="flex flex-col gap-1 md:col-span-2">
                  <input type="text" name="meetingLink" value={editForm.meetingLink} onChange={handleEditChange} placeholder="Meeting Link" className={`border rounded-xl px-4 py-3 ${editErrors.meetingLink ? "border-red-400" : ""}`} />
                  {editErrors.meetingLink && <p className="text-red-500 text-xs px-1">{editErrors.meetingLink}</p>}
                </div>
              ) : (
                <div className="flex flex-col gap-1 md:col-span-2">
                  <input type="text" name="location" value={editForm.location} onChange={handleEditChange} placeholder="Location" className={`border rounded-xl px-4 py-3 ${editErrors.location ? "border-red-400" : ""}`} />
                  {editErrors.location && <p className="text-red-500 text-xs px-1">{editErrors.location}</p>}
                </div>
              )}
              <div className="flex flex-col gap-1 md:col-span-2">
                <input type="text" name="quizLink" value={editForm.quizLink} onChange={handleEditChange} placeholder="Quiz Link (optional)" className={`border rounded-xl px-4 py-3 ${editErrors.quizLink ? "border-red-400" : ""}`} />
                {editErrors.quizLink && <p className="text-red-500 text-xs px-1">{editErrors.quizLink}</p>}
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <textarea name="description" value={editForm.description} onChange={handleEditChange} placeholder="Description (optional)" rows={4} className={`border rounded-xl px-4 py-3 ${editErrors.description ? "border-red-400" : ""}`} />
                <div className="flex justify-between items-center px-1">
                  {editErrors.description ? <p className="text-red-500 text-xs">{editErrors.description}</p> : <span />}
                  <p className="text-xs text-slate-400">{editForm.description.length}/1000</p>
                </div>
              </div>
              <div className="md:col-span-2 flex gap-3 pt-2">
                <button type="button" onClick={() => { setEditingSession(null); setEditErrors({}); }} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" disabled={!!actionLoading} className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
                  {actionLoading ? <span className="inline-flex items-center gap-2 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm dialog ── */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {confirmDialog.action === "complete" ? "Mark as Complete?" : "Cancel Session?"}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {confirmDialog.action === "complete"
                ? "This will mark the session as completed. This action cannot be undone."
                : "This will cancel the session. This action cannot be undone."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDialog(null)} className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition">Go Back</button>
              <button
                onClick={() => handleAction(confirmDialog.sessionId, confirmDialog.action)}
                className={`flex-1 px-4 py-2 rounded-xl font-medium text-white transition ${confirmDialog.action === "complete" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"}`}
              >
                {confirmDialog.action === "complete" ? "Confirm" : "Cancel Session"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-sm font-semibold capitalize rounded-t-lg transition border-b-2 -mb-px ${statusFilter === status
                ? "border-[#2F66E0] text-[#2F66E0]"
                : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
          >
            {status === "archived" ? (
              <span className="inline-flex items-center gap-1.5">
                <Archive className="w-3.5 h-3.5" />
                Archived
              </span>
            ) : status}
          </button>
        ))}
      </div>

      {/* ── Completed tab filters ── */}
      {statusFilter === "completed" && (
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>

          {/* Date range */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden">
            {[
              { value: "all", label: "All Time" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
              { value: "3months", label: "Last 3 Months" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setCompletedDateFilter(value)}
                className={`px-3 py-1.5 text-sm font-medium transition border-r last:border-r-0 border-slate-200 ${completedDateFilter === value
                    ? "bg-[#2F66E0] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Pending Results toggle */}
          <button
            onClick={() => setCompletedPendingOnly((prev) => !prev)}
            className={`px-3 py-1.5 text-sm font-medium rounded-xl border transition ${completedPendingOnly
                ? "bg-amber-500 text-white border-amber-500"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
          >
            ⏳ Pending Results
          </button>

          {/* Clear */}
          {(completedDateFilter !== "all" || completedPendingOnly) && (
            <button
              onClick={() => { setCompletedDateFilter("all"); setCompletedPendingOnly(false); }}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Cancelled tab filters ── */}
      {statusFilter === "cancelled" && (
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>

          <div className="flex rounded-xl border border-slate-200 overflow-hidden">
            {[
              { value: "all", label: "All Time" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
              { value: "3months", label: "Last 3 Months" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setCancelledDateFilter(value)}
                className={`px-3 py-1.5 text-sm font-medium transition border-r last:border-r-0 border-slate-200 ${cancelledDateFilter === value
                    ? "bg-[#2F66E0] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {cancelledDateFilter !== "all" && (
            <button
              onClick={() => setCancelledDateFilter("all")}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Archived tab filters ── */}
      {statusFilter === "archived" && (
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>

          {/* Status filter */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden">
            {[
              { value: "all", label: "All" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setArchivedStatusFilter(value)}
                className={`px-3 py-1.5 text-sm font-medium transition border-r last:border-r-0 border-slate-200 ${archivedStatusFilter === value
                    ? "bg-[#2F66E0] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Date range filter */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden">
            {[
              { value: "all", label: "All Time" },
              { value: "month", label: "This Month" },
              { value: "3months", label: "Last 3 Months" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setArchivedDateFilter(value)}
                className={`px-3 py-1.5 text-sm font-medium transition border-r last:border-r-0 border-slate-200 ${archivedDateFilter === value
                    ? "bg-[#2F66E0] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Option 2: Pending Results toggle in archived tab */}
          <button
            onClick={() => setArchivedPendingOnly((prev) => !prev)}
            className={`px-3 py-1.5 text-sm font-medium rounded-xl border transition ${archivedPendingOnly
                ? "bg-amber-500 text-white border-amber-500"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
          >
            ⏳ Pending Results
          </button>

          {/* Clear filters */}
          {isFiltered && statusFilter === "archived" && (
            <button
              onClick={() => { setArchivedStatusFilter("all"); setArchivedDateFilter("all"); setArchivedPendingOnly(false); }}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

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
            {isFiltered ? "No sessions match your filters" : `No ${statusFilter} Sessions`}
          </h2>
          <p className="text-slate-500 mt-3">
            {isFiltered
              ? "Try adjusting or clearing your filters."
              : statusFilter === "archived"
                ? "Sessions you archive will appear here."
                : `You have no ${statusFilter} sessions yet.`}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500 text-sm">
              {sortedSessions.length} session{sortedSessions.length !== 1 ? "s" : ""}
              {isFiltered ? " (filtered)" : ""}
            </p>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white">
                <button onClick={() => setSortOrder("soonest")} className={`px-4 py-2 text-sm font-medium transition ${sortOrder === "soonest" ? "bg-[#2F66E0] text-white" : "text-slate-600 hover:bg-slate-50"}`}>Soonest</button>
                <button onClick={() => setSortOrder("latest")} className={`px-4 py-2 text-sm font-medium transition border-l border-slate-200 ${sortOrder === "latest" ? "bg-[#2F66E0] text-white" : "text-slate-600 hover:bg-slate-50"}`}>Latest</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {sortedSessions.map((session) => {
              const isActing =
                actionLoading === session._id + "complete" ||
                actionLoading === session._id + "cancel" ||
                actionLoading === session._id + "archive";

              return (
                <div
                  key={session._id}
                  className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition hover:shadow-md ${statusFilter === "archived" ? "opacity-80" : ""}`}
                >
                  <div className="flex gap-4">
                    <div className={`w-[88px] shrink-0 rounded-2xl text-white flex flex-col items-center justify-center py-4 px-3 ${statusFilter === "archived" ? "bg-slate-400" : "bg-[#2F66E0]"}`}>
                      <p className="text-[11px] uppercase tracking-wide opacity-90">{getMonth(session.date)}</p>
                      <p className="text-3xl font-bold leading-none mt-1">{getDay(session.date)}</p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-blue-600 mb-1">{session.category}</p>
                          <h3 className="text-xl font-bold text-slate-900 leading-tight">{session.topic}</h3>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${session.mode === "online" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {session.mode}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[session.status] || "bg-slate-100 text-slate-600"}`}>
                            {session.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2">
                          <Clock3 className="w-4 h-4 text-[#2F66E0]" />
                          <span className="text-lg font-bold text-[#2F66E0]">{session.time}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-700">
                          <CalendarDays className="w-4 h-4" />
                          <span className="text-sm font-medium">{formatDate(session.date)}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-700">
                          <Clock3 className="w-4 h-4" />
                          <span className="text-sm font-medium">{session.duration} mins</span>
                        </div>
                      </div>

                      {/* Archived on date */}
                      {statusFilter === "archived" && session.archivedAt && (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                          <Archive className="w-3.5 h-3.5" />
                          Archived on {formatDate(session.archivedAt)}
                        </div>
                      )}

                      {/* Option 2: Pending results badge in archived tab */}
                      {statusFilter === "archived" && session.quizLink && !session.resultsUploaded && (
                        <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-600 font-semibold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Quiz results not uploaded
                        </div>
                      )}

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
                          {session.mode === "online" ? <Monitor className="w-5 h-5 text-slate-500" /> : <MapPin className="w-5 h-5 text-slate-500" />}
                          <span className="text-sm">{session.mode === "online" ? "Online Session" : session.location || "No location added"}</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
                          <Users className="w-5 h-5 text-slate-500" />
                          <span className="text-sm">Registered: {session.registeredCount}{session.capacity ? ` / ${session.capacity}` : ""}</span>
                        </div>
                      </div>

                      {session.description && (
                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <p className="font-semibold text-slate-800">Description</p>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{session.description}</p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
                        {session.meetingLink && (
                          <a href={session.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition">
                            <LinkIcon className="w-4 h-4" /> Meeting Link
                          </a>
                        )}
                        {session.quizLink && (
                          <a href={session.quizLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition">
                            <BookOpen className="w-4 h-4" /> Quiz Link
                          </a>
                        )}
                      </div>

                      {/* ── Completed actions ── */}
                      {session.status === "completed" && statusFilter !== "archived" && (
                        <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                          {!session.quizLink ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-sm font-medium">
                              <BookOpen className="w-4 h-4" /> No Quiz for this session
                            </div>
                          ) : session.resultsUploaded ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-semibold">
                              <CheckCircle2 className="w-4 h-4" /> Results Uploaded
                            </div>
                          ) : (
                            <>
                              <button
                                disabled={uploadingSessionId === session._id}
                                onClick={() => handleUploadClick(session._id)}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition disabled:opacity-60"
                              >
                                {uploadingSessionId === session._id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <BookOpen className="w-4 h-4" />
                                    Upload Quiz Results
                                  </>
                                )}
                              </button>
                              <p className="text-xs text-slate-400">Format: Email | Marks | Total</p>
                            </>
                          )}
                          {/* Option 1: use handleArchiveClick instead of handleArchive */}
                          <button
                            disabled={isActing}
                            onClick={() => handleArchiveClick(session)}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === session._id + "archive" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                            Archive Session
                          </button>
                        </div>
                      )}

                      {/* ── Upcoming actions ── */}
                      {session.status === "upcoming" && (
                        <div className="mt-5 pt-4 border-t border-slate-100 flex gap-3 flex-wrap">
                          <button disabled={isActing} onClick={() => handleEditClick(session)} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">Edit</button>
                          <button disabled={isActing} onClick={() => setConfirmDialog({ sessionId: session._id, action: "complete" })} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                            {actionLoading === session._id + "complete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Mark Complete
                          </button>
                          <button disabled={isActing} onClick={() => setConfirmDialog({ sessionId: session._id, action: "cancel" })} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                            {actionLoading === session._id + "cancel" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            Cancel
                          </button>
                        </div>
                      )}

                      {/* ── Cancelled actions ── */}
                      {session.status === "cancelled" && statusFilter !== "archived" && (
                        <div className="mt-5 pt-4 border-t border-slate-100">
                          <button
                            disabled={isActing}
                            onClick={() => handleArchive(session)}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === session._id + "archive" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                            Archive Session
                          </button>
                        </div>
                      )}

{/* ── Archived actions ── */}
{statusFilter === "archived" && (
  <div className="mt-5 pt-4 border-t border-slate-100">
    <button
      disabled={isActing}
      onClick={async () => {
        setActionLoading(session._id + "restore");
        try {
          await axios.put(
            `http://localhost:5000/api/sessions/${session._id}/restore`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSessions((prev) => prev.filter((s) => s._id !== session._id));
          setSuccessMessage("Session restored successfully!");
        } catch (err) {
          setError(err.response?.data?.message || "Failed to restore session");
        } finally {
          setActionLoading(null);
        }
      }}
      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {actionLoading === session._id + "restore" ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Archive className="w-4 h-4" />
      )}
      Restore Session
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
