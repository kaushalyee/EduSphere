import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, Clock, XCircle } from "lucide-react";

const DEADLINE_DAYS = 7;

export default function PendingResultsBanner({ onGoToSessions }) {
  const [pendingSessions, setPendingSessions] = useState([]);
  const [dismissed, setDismissed] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sessions/completed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sessions = res.data.sessions || [];
        const pending = sessions.filter((s) => s.quizLink && !s.resultsUploaded);
        setPendingSessions(pending);
      } catch (err) {
        // fail silently — it's a reminder, not critical
      }
    };
    fetchPending();
  }, []);

  if (dismissed || pendingSessions.length === 0) return null;

  // Calculate urgency based on closest deadline
  const now = new Date();
  const withDeadlines = pendingSessions.map((s) => {
    const sessionDate = new Date(s.date);
    const deadline = new Date(sessionDate);
    deadline.setDate(deadline.getDate() + DEADLINE_DAYS);
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return { ...s, daysLeft };
  });

  const overdue = withDeadlines.filter((s) => s.daysLeft <= 0);
  const urgent = withDeadlines.filter((s) => s.daysLeft > 0 && s.daysLeft <= 2);
  const normal = withDeadlines.filter((s) => s.daysLeft > 2);

  // Pick the most urgent group to determine banner style
  const isOverdue = overdue.length > 0;
  const isUrgent = urgent.length > 0;

  const bgColor = isOverdue || isUrgent ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200";
  const iconColor = isOverdue || isUrgent ? "text-red-500" : "text-amber-500";
  const textColor = isOverdue || isUrgent ? "text-red-700" : "text-amber-700";
  const subTextColor = isOverdue || isUrgent ? "text-red-500" : "text-amber-500";
  const btnColor = isOverdue || isUrgent
    ? "bg-red-500 hover:bg-red-600"
    : "bg-amber-500 hover:bg-amber-600";

  const getMessage = () => {
    if (isOverdue && overdue.length === pendingSessions.length) {
      return `${overdue.length} session${overdue.length > 1 ? "s are" : " is"} past the upload deadline`;
    }
    if (isOverdue) {
      return `${overdue.length} overdue + ${pendingSessions.length - overdue.length} pending quiz result${pendingSessions.length > 1 ? "s" : ""}`;
    }
    if (isUrgent) {
      const closest = Math.min(...urgent.map((s) => s.daysLeft));
      return `${pendingSessions.length} session${pendingSessions.length > 1 ? "s" : ""} pending — ${closest} day${closest > 1 ? "s" : ""} left to upload`;
    }
    const closest = Math.min(...normal.map((s) => s.daysLeft));
    return `${pendingSessions.length} session${pendingSessions.length > 1 ? "s" : ""} pending results — ${closest} day${closest > 1 ? "s" : ""} left`;
  };

  const getSubMessage = () => {
    if (isOverdue) return "Upload now to keep student records up to date.";
    if (isUrgent) return "Deadline approaching - upload before it's too late.";
    return "Don't forget to upload quiz results for completed sessions.";
  };

  return (
    <div className={`flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 ${bgColor}`}>
      <div className="flex items-center gap-3">
        <div className={`shrink-0 ${iconColor}`}>
          {isOverdue || isUrgent
            ? <AlertTriangle className="w-5 h-5" />
            : <Clock className="w-5 h-5" />}
        </div>
        <div>
          <p className={`font-semibold text-sm ${textColor}`}>{getMessage()}</p>
          <p className={`text-xs mt-0.5 ${subTextColor}`}>{getSubMessage()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onGoToSessions}
          className={`px-4 py-2 rounded-xl text-white text-sm font-semibold transition ${btnColor}`}
        >
          Upload Now
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-600 transition"
          title="Dismiss"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}