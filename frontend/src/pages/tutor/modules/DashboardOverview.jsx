import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (date) =>
  new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

const fmtFull = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });

/** bucket sessions by month label (last 6 months) */
function buildMonthlyData(sessions) {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString("default", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
      total: 0,
      completed: 0,
      upcoming: 0,
    });
  }
  sessions.forEach((s) => {
    const d = new Date(s.date);
    const bucket = months.find(
      (m) => m.year === d.getFullYear() && m.month === d.getMonth()
    );
    if (!bucket) return;
    bucket.total++;
    if (s.status === "completed") bucket.completed++;
    if (s.status === "upcoming") bucket.upcoming++;
  });
  return months.map(({ label, total, completed, upcoming }) => ({
    label,
    total,
    completed,
    upcoming,
  }));
}

// ─── sub-components ─────────────────────────────────────────────────────────

function StatCard({ title, value, color, icon, delay, onClick, tab }) {
  const isClickable = !!tab;
  return (
    <div
      className={`stat-card ${isClickable ? "stat-card--clickable" : ""}`}
      style={{ "--accent": color, animationDelay: delay }}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `Go to ${title}` : undefined}
      onKeyDown={isClickable ? (e) => e.key === "Enter" && onClick() : undefined}
      title={isClickable ? `View ${title}` : undefined}
    >
      <span className="stat-icon">{icon}</span>
      <p className="stat-value" style={{ color }}>
        {value}
      </p>
      <p className="stat-label">{title}</p>
      {isClickable && <span className="stat-arrow">→</span>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── main component ──────────────────────────────────────────────────────────

export default function DashboardOverview({ setActiveTab }) {
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    online: 0,
    offline: 0,
  });
  const [nextSession, setNextSession] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [upcomingRes, completedRes, cancelledRes] = await Promise.all([
          axios.get("/api/sessions/my-sessions", { headers }),
          axios.get("/api/sessions/completed", { headers }),
          axios.get("/api/sessions/cancelled", { headers }),
        ]);

        const upcomingSessions = (upcomingRes.data.sessions || []).map((s) => ({
          ...s,
          status: "upcoming",
        }));
        const completedSessions = (completedRes.data.sessions || []).map((s) => ({
          ...s,
          status: "completed",
        }));
        const cancelledSessions = (cancelledRes.data.sessions || []).map((s) => ({
          ...s,
          status: "cancelled",
        }));

        const merged = [...upcomingSessions, ...completedSessions, ...cancelledSessions];
        setAllSessions(merged);

        const sortedUpcoming = [...upcomingSessions].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setNextSession(sortedUpcoming[0] || null);

        setStats({
          total: merged.length,
          upcoming: upcomingSessions.length,
          completed: completedSessions.length,
          cancelled: cancelledSessions.length,
          online: merged.filter((s) => s.mode === "online").length,
          offline: merged.filter((s) => s.mode === "offline").length,
        });
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const nav = (tab) => setActiveTab && setActiveTab(tab);

  const statCards = [
    { title: "Total Sessions", value: stats.total,     color: "#6366f1", icon: "📋", tab: "my-sessions" },
    { title: "Upcoming",       value: stats.upcoming,  color: "#f59e0b", icon: "🗓️", tab: "my-sessions" },
    { title: "Completed",      value: stats.completed, color: "#10b981", icon: "✅", tab: "my-sessions" },
    { title: "Cancelled",      value: stats.cancelled, color: "#ef4444", icon: "❌", tab: "my-sessions" },
    { title: "Online",         value: stats.online,    color: "#0ea5e9", icon: "🌐", tab: null },
    { title: "Offline",        value: stats.offline,   color: "#8b5cf6", icon: "📍", tab: null },
  ];

  const monthlyData = buildMonthlyData(allSessions);

  const pieData = [
    { name: "Completed", value: stats.completed, color: "#10b981" },
    { name: "Upcoming", value: stats.upcoming, color: "#f59e0b" },
    { name: "Cancelled", value: stats.cancelled, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // ── loading / error states ────────────────────────────────────────────────

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="dash-shell">
          <div className="loading-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
          <div className="skeleton-banner" />
          <div className="skeleton-chart" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{css}</style>
        <div className="dash-shell">
          <div className="error-box">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        </div>
      </>
    );
  }

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{css}</style>
      <div className="dash-shell">

        {/* ── stat grid ── */}
        <div className="stat-grid">
          {statCards.map((c, i) => (
            <StatCard
              key={i}
              {...c}
              delay={`${i * 0.07}s`}
              onClick={() => c.tab && nav(c.tab)}
            />
          ))}
        </div>

        {/* ── next session + completion ring ── */}
        <div className="banner-row">
          {nextSession ? (
            <div className="next-session-card">
              <div className="next-badge">NEXT SESSION</div>
              <h2 className="next-topic">{nextSession.topic}</h2>
              <p className="next-date">{fmtFull(nextSession.date)}</p>
              <div className="next-meta">
                <span className="next-chip">⏰ {nextSession.time}</span>
                <span className="next-chip">
                  {nextSession.mode === "online" ? "🌐" : "📍"}{" "}
                  {nextSession.mode}
                </span>
              </div>
              {setActiveTab && (
                <button
                  className="next-cta"
                  onClick={() => nav("my-sessions")}
                >
                  View my sessions →
                </button>
              )}
              <div className="next-glow" />
            </div>
          ) : (
            <div className="no-session-card">
              <span className="no-session-icon">📭</span>
              <p>No upcoming sessions scheduled</p>
            </div>
          )}

          {/* completion ring */}
          <div className="ring-card">
            <p className="ring-label">Completion Rate</p>
            <div className="ring-wrap">
              <svg viewBox="0 0 120 120" className="ring-svg">
                <circle cx="60" cy="60" r="50" className="ring-bg" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="ring-fg"
                  style={{
                    strokeDashoffset: 314 - (314 * completionRate) / 100,
                  }}
                />
              </svg>
              <span className="ring-pct">{completionRate}%</span>
            </div>
            <p className="ring-sub">
              {stats.completed} of {stats.total} sessions done
            </p>

            {/* tiny pie */}
            {pieData.length > 0 && (
              <div className="mini-pie">
                <PieChart width={120} height={120}>
                  <Pie
                    data={pieData}
                    cx={55}
                    cy={55}
                    innerRadius={32}
                    outerRadius={52}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="pie-legend">
                  {pieData.map((d) => (
                    <span key={d.name} className="pie-dot-row">
                      <span className="pie-dot" style={{ background: d.color }} />
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── area chart ── */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Sessions Over Time</h3>
            <span className="chart-subtitle">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#gradTotal)"
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#gradCompleted)"
                dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── summary prose ── */}
        <div className="summary-card">
          <h3>Tutor Summary</h3>
          <p>
            You have created{" "}
            <strong style={{ color: "#6366f1" }}>{stats.total}</strong> sessions in total.{" "}
            <strong style={{ color: "#f59e0b" }}>{stats.upcoming}</strong> are upcoming,{" "}
            <strong style={{ color: "#10b981" }}>{stats.completed}</strong> completed, and{" "}
            <strong style={{ color: "#ef4444" }}>{stats.cancelled}</strong> cancelled.
            Your online-to-offline ratio is{" "}
            <strong style={{ color: "#0ea5e9" }}>{stats.online}</strong> :{" "}
            <strong style={{ color: "#8b5cf6" }}>{stats.offline}</strong>.
          </p>
        </div>
      </div>
    </>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .dash-shell {
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 4px 0 32px;
    animation: dashIn .4s ease both;
  }

  @keyframes dashIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }

  /* ── stat grid ── */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  @media (min-width: 640px)  { .stat-grid { grid-template-columns: repeat(3,1fr) } }
  @media (min-width: 1024px) { .stat-grid { grid-template-columns: repeat(6,1fr) } }

  .stat-card {
    background: #fff;
    border-radius: 18px;
    padding: 20px 16px 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04);
    border: 1px solid #f3f4f6;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    opacity: 0;
    animation: cardPop .45s cubic-bezier(.34,1.56,.64,1) both;
    position: relative;
    overflow: hidden;
    transition: box-shadow .2s, transform .2s;
  }
  .stat-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: var(--accent);
    border-radius: 0 0 18px 18px;
    opacity: .7;
  }
  .stat-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.1); transform: translateY(-2px) }
  @keyframes cardPop { from { opacity:0; transform:scale(.88) } to { opacity:1; transform:scale(1) } }

  .stat-icon { font-size: 20px; margin-bottom: 4px }
  .stat-value { font-size: 26px; font-weight: 800; line-height: 1; margin: 0 }
  .stat-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: .04em; margin: 0 }

  /* ── banner row ── */
  .banner-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  @media (min-width: 768px) { .banner-row { grid-template-columns: 1fr 320px } }

  .next-session-card {
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 45%, #3b82f6 100%);
    border-radius: 22px;
    padding: 28px 28px 32px;
    color: #fff;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(37,99,235,.35);
    animation: dashIn .5s .1s ease both;
  }
  .next-glow {
    position: absolute;
    top: -60px; right: -60px;
    width: 200px; height: 200px;
    background: rgba(255,255,255,.08);
    border-radius: 50%;
    pointer-events: none;
  }
  .next-badge {
    display: inline-block;
    background: rgba(255,255,255,.18);
    border: 1px solid rgba(255,255,255,.3);
    border-radius: 100px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .1em;
    padding: 3px 10px;
    margin-bottom: 12px;
    backdrop-filter: blur(4px);
  }
  .next-topic { font-size: 26px; font-weight: 800; margin: 0 0 6px; line-height: 1.2 }
  .next-date  { font-size: 15px; opacity: .75; margin: 0 0 16px; font-weight: 500 }
  .next-meta  { display: flex; flex-wrap: wrap; gap: 10px }
  .next-chip  {
    background: rgba(255,255,255,.15);
    border: 1px solid rgba(255,255,255,.25);
    border-radius: 100px;
    padding: 7px 16px;
    font-size: 15px;
    font-weight: 600;
    backdrop-filter: blur(4px);
  }

  .no-session-card {
    background: #f9fafb;
    border: 1.5px dashed #d1d5db;
    border-radius: 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 40px;
    color: #9ca3af;
    font-size: 14px;
    font-weight: 500;
  }
  .no-session-icon { font-size: 36px }

  /* ── ring card ── */
  .ring-card {
    background: #fff;
    border-radius: 22px;
    padding: 24px 20px 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04);
    border: 1px solid #f3f4f6;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    animation: dashIn .5s .2s ease both;
  }
  .ring-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #6b7280; margin: 0 }
  .ring-sub   { font-size: 12px; color: #9ca3af; margin: 0 }
  .ring-wrap  { position: relative; width: 110px; height: 110px; margin: 4px 0 }
  .ring-svg   { width: 100%; height: 100%; transform: rotate(-90deg) }
  .ring-bg    { fill: none; stroke: #f0f0f0; stroke-width: 10 }
  .ring-fg    {
    fill: none;
    stroke: #10b981;
    stroke-width: 10;
    stroke-linecap: round;
    stroke-dasharray: 314;
    transition: stroke-dashoffset 1s cubic-bezier(.4,0,.2,1);
  }
  .ring-pct {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 800;
    color: #111827;
  }
  .mini-pie   { display: flex; flex-direction: column; align-items: center; gap: 6px; margin-top: 4px }
  .pie-legend { display: flex; flex-direction: column; gap: 3px; align-self: flex-start }
  .pie-dot-row { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #6b7280; font-weight: 500 }
  .pie-dot    { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0 }

  /* ── chart ── */
  .chart-card {
    background: #fff;
    border-radius: 22px;
    padding: 24px 24px 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04);
    border: 1px solid #f3f4f6;
    animation: dashIn .5s .25s ease both;
  }
  .chart-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 16px }
  .chart-header h3 { font-size: 16px; font-weight: 700; color: #111827; margin: 0 }
  .chart-subtitle { font-size: 12px; color: #9ca3af; font-weight: 500 }
  .chart-tooltip {
    background: #1f2937;
    border-radius: 10px;
    padding: 10px 14px;
    color: #f9fafb;
    font-size: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 8px 24px rgba(0,0,0,.25);
    line-height: 1.8;
  }
  .tooltip-label { font-weight: 700; margin-bottom: 2px; color: #d1d5db }

  /* ── summary ── */
  .summary-card {
    background: #fff;
    border-radius: 22px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04);
    border: 1px solid #f3f4f6;
    animation: dashIn .5s .3s ease both;
  }
  .summary-card h3 { font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 10px }
  .summary-card p  { font-size: 14px; color: #4b5563; line-height: 1.75; margin: 0 }

  .stat-card--clickable {
    cursor: pointer;
  }
  .stat-card--clickable:hover {
    box-shadow: 0 8px 28px rgba(0,0,0,.13);
    transform: translateY(-3px);
  }
  .stat-card--clickable:active {
    transform: translateY(-1px);
  }
  .stat-card--clickable:focus-visible {
    outline: 2px solid var(--accent, #6366f1);
    outline-offset: 2px;
  }
  .stat-arrow {
    position: absolute;
    bottom: 10px;
    right: 12px;
    font-size: 13px;
    color: var(--accent);
    opacity: 0;
    transition: opacity .2s, transform .2s;
    transform: translateX(-4px);
  }
  .stat-card--clickable:hover .stat-arrow {
    opacity: 1;
    transform: translateX(0);
  }
  .next-cta {
    margin-top: 16px;
    background: rgba(255,255,255,.18);
    border: 1px solid rgba(255,255,255,.35);
    border-radius: 100px;
    color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 7px 18px;
    cursor: pointer;
    transition: background .2s, transform .15s;
    backdrop-filter: blur(4px);
    display: inline-block;
  }
  .next-cta:hover {
    background: rgba(255,255,255,.28);
    transform: translateX(3px);
  }
  @keyframes shimmer { to { background-position: 200% center } }
  .skeleton-card, .skeleton-banner, .skeleton-chart {
    border-radius: 18px;
    background: linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);
    background-size: 200%;
    animation: shimmer 1.4s infinite, cardPop .4s ease both;
  }
  .loading-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px }
  @media(min-width:1024px) { .loading-grid { grid-template-columns: repeat(6,1fr) } }
  .skeleton-card   { height: 90px }
  .skeleton-banner { height: 180px; margin-top: 0 }
  .skeleton-chart  { height: 260px }

  /* ── error ── */
  .error-box {
    background: #fef2f2;
    border: 1px solid #fca5a5;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #dc2626;
    font-weight: 600;
    font-size: 14px;
  }
  .error-box span { font-size: 24px }
`;
