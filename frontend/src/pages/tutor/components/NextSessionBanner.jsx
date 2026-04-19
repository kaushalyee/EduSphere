import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { CalendarDays, Clock3, Monitor, MapPin, ArrowRight } from "lucide-react";

function useCountdown(targetDate, targetTime, durationMins = 60) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetDate || !targetTime) return;

    const getStart = () => {
      const [hours, minutes] = targetTime.split(":").map(Number);
      const dt = new Date(targetDate);
      dt.setHours(hours, minutes, 0, 0);
      return dt;
    };

    const getEnd = () => {
      const end = getStart();
      end.setMinutes(end.getMinutes() + durationMins);
      return end;
    };

    const calc = () => {
      const now = new Date();
      const diffToStart = getStart() - now;
      const diffToEnd   = getEnd() - now;

      // Session hasn't started yet
      if (diffToStart > 0) {
        const days    = Math.floor(diffToStart / 86400000);
        const hours   = Math.floor((diffToStart % 86400000) / 3600000);
        const minutes = Math.floor((diffToStart % 3600000) / 60000);
        const seconds = Math.floor((diffToStart % 60000) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, started: false, ended: false });
      }
      // Session is live (started but not ended)
      else if (diffToEnd > 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, started: true, ended: false });
      }
      // Session is fully over
      else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, started: false, ended: true });
      }
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate, targetTime, durationMins]);

  return timeLeft;
}

function Digit({ value, label }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black tracking-tight text-white"
          style={{
            background: "linear-gradient(135deg, #2F66E0 0%, #1a4fc4 100%)",
            boxShadow: "0 8px 24px rgba(47,102,224,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          {str}
        </div>
      </div>
      <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </span>
    </div>
  );
}

export default function NextSessionBanner({ onGoToSessions }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const timeLeft = useCountdown(session?.date, session?.time, session?.duration);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sessions/my-sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const upcoming = (res.data.sessions || [])
          .filter((s) => s.status === "upcoming")
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setSession(upcoming[0] || null);
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 animate-pulse h-40" />
    );
  }

  if (!session) {
    return (
      <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-8 flex flex-col items-center justify-center text-center gap-2">
        <CalendarDays className="w-8 h-8 text-slate-300" />
        <p className="text-slate-500 font-medium">No upcoming sessions scheduled</p>
        <p className="text-slate-400 text-sm">Create a session to see your countdown here</p>
      </div>
    );
  }

  const dateObj = new Date(session.date);
  const dayNum  = dateObj.toLocaleDateString("en-GB", { day: "2-digit" });
  const month   = dateObj.toLocaleDateString("en-GB", { month: "long" });
  const year    = dateObj.getFullYear();
  const weekday = dateObj.toLocaleDateString("en-GB", { weekday: "long" });
  const fullDate = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div
      className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm"
      style={{ background: "linear-gradient(135deg, #f8faff 0%, #eef3ff 100%)" }}
    >
      {/* Top stripe */}
      <div
        className="h-1.5 w-full"
        style={{ background: "linear-gradient(90deg, #2F66E0, #60a5fa)" }}
      />

      <div className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">

          {/* ── Big Date Block ── */}
          <div className="flex items-center gap-5 shrink-0">
            <div
              className="rounded-2xl flex flex-col items-center justify-center px-6 py-4 min-w-[100px]"
              style={{
                background: "linear-gradient(150deg, #2F66E0 0%, #1a4fc4 100%)",
                boxShadow: "0 12px 32px rgba(47,102,224,0.30)",
              }}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-200">
                {month.slice(0, 3)}
              </span>
              <span className="text-5xl font-black text-white leading-none mt-0.5">
                {dayNum}
              </span>
              <span className="text-[11px] font-semibold text-blue-200 mt-0.5">{year}</span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#2F66E0] mb-1">
                Next Session
              </p>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {weekday}
              </h2>
              <p className="text-slate-500 font-medium mt-0.5">{fullDate}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2F66E0] bg-blue-100 rounded-xl px-3 py-1">
                  <Clock3 className="w-3.5 h-3.5" />
                  {session.time}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl px-3 py-1">
                  {session.mode === "online"
                    ? <><Monitor className="w-3.5 h-3.5" /> Online</>
                    : <><MapPin className="w-3.5 h-3.5" /> {session.location || "Offline"}</>
                  }
                </span>
              </div>

              <p className="mt-2 text-slate-700 font-semibold text-sm line-clamp-1">
                {session.topic}
              </p>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="hidden lg:block w-px self-stretch bg-slate-200 mx-2" />

          {/* ── Countdown ── */}
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {timeLeft?.started ? "Session is live!" : timeLeft?.ended ? "Session ended" : "Starts in"}
            </p>

            {timeLeft && !timeLeft.started && !timeLeft.ended ? (
              <div className="flex gap-3 flex-wrap">
                {timeLeft.days > 0 && <Digit value={timeLeft.days}    label="days" />}
                <Digit value={timeLeft.hours}   label="hrs"  />
                <Digit value={timeLeft.minutes} label="min"  />
                <Digit value={timeLeft.seconds} label="sec"  />
              </div>
            ) : timeLeft?.started ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-lg"
                style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
              >
                🟢 Live Now
              </div>
            ) : timeLeft?.ended ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-slate-600 font-semibold text-sm bg-slate-100 rounded-2xl"
              >
                Session has ended — mark it complete in My Sessions
              </div>
            ) : null}
          </div>

          {/* ── CTA ── */}
          {onGoToSessions && (
            <button
              onClick={onGoToSessions}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[#2F66E0] font-semibold text-sm bg-white border border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition shadow-sm"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
